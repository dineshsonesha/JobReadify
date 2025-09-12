import PDFDocument from "pdfkit";
import OpenAI from "openai";
import sql from "../configs/db.js";
import fs from 'fs';
import pdf from 'pdf-parse/lib/pdf-parse.js';
import path from "path";
import cloudinary from "cloudinary";

const AI = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

export const resumeReview = async (req, res) => {
    try {
        const { userId } = req.auth();
        const resume = req.file;
        const plan = req.plan;
        const free_usage = req.free_usage;

        if (plan !== 'premium' && free_usage >= 10) {
            return res.json({ success: false, message: 'You have reached your free usage limit. Upgrade to premium to generate more content.' });
        }

        if (resume.size > 5 * 1024 * 1024) {
            return res.json({ success: false, message: 'Resume size must be less than 5MB' });
        }

        const dataBuffer = fs.readFileSync(resume.path);
        const pdfData = await pdf(dataBuffer);

        const prompt = `Review the following resume and provide constructive feedback on its strengths, weaknesses, and potential areas for improvement. Respond in a professional and concise manner.Resume Content:\n\n ${pdfData.text}`;

        const response = await AI.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: 1000,
        });

        const content = response.choices[0].message.content;

        await sql` INSERT INTO resumes (user_id, prompt, content, type) VALUES (${userId}, ${`Review the uploaded resume`}, ${content}, 'resume-review')`;

        res.json({ success: true, content: content });

    } catch (error) {
        console.log(error.messages);
        res.json({ success: false, message: error.message });
    }
}

export const skillGrowth = async (req, res) => {
    try {
        if (!req.file) {
            return res.json({ success: false, message: "No resume uploaded" });
        }

        const dataBuffer = fs.readFileSync(req.file.path);
        const pdfData = await pdf(dataBuffer);

        const prompt = `You are a career coach. Analyze the following resume and suggest a skill growth plan.
Identify missing skills, trending tools, and learning paths for the candidate.
Resume Content:\n\n${pdfData.text}`;

        const response = await AI.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: 1000,
        });

        const content = response.choices[0].message.content;

        res.json({ success: true, content });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

export const generateEnhancedResume = async (req, res) => {
  try {
    // get userId (your auth middleware should attach it)
    const { userId } = req.auth ? req.auth() : { userId: null };
    const form = req.body || {};

    // ensure keys exist (safeguard)
    const {
      fullName = "",
      email = "",
      phone = "",
      summary = "",
      education = "",
      skills = "",
      experience = "",
      linkedin = "",
      portfolio = "",
      certifications = "",
      achievements = "",
    } = form;

    // Compose prompt: include optional fields and instructions for "no experience"
    const prompt = `
You are an expert resume writer and career coach. Produce:
1) A short professional summary (2-3 lines).
2) A concise "Key Skills" bullet list (use the skills provided).
3) Experience bullets formatted for ATS; if no professional experience is provided, create a Projects / Academic Projects / Internships section with 3-5 bullet points showing impact and measurable outcomes. Use transferable skills.
4) Education section formatted neatly.
5) Certifications & Achievements section (if provided).
6) LinkedIn / Portfolio blurb (if links are provided) and suggestions how to display them.

Input details:
Name: ${fullName || "N/A"}
Email: ${email || "N/A"}
Phone: ${phone || "N/A"}
Summary: ${summary || "N/A"}
Education: ${education || "N/A"}
Skills: ${skills || "N/A"}
Experience: ${experience || ""} 
LinkedIn: ${linkedin || ""}
Portfolio: ${portfolio || ""}
Certifications: ${certifications || ""}
Achievements: ${achievements || ""}

Be concise, bullet-heavy where appropriate, ATS-friendly, and produce final output that can be pasted directly into a PDF resume.
`;

    // call AI
    const aiResponse = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.25,
      max_tokens: 1200,
    });

    const enhancedText = aiResponse.choices?.[0]?.message?.content || aiResponse.choices?.[0]?.text || "No response";

    // create uploads dir if missing
    const uploadDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

    const pdfFilename = `${Date.now()}-resume.pdf`;
    const pdfPath = path.join(uploadDir, pdfFilename);

    // Create PDF
    const doc = new PDFDocument({ margin: 40 });
    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);

    doc.fontSize(18).text(fullName || "Name", { align: "center" });
    doc.moveDown(0.2);
    doc.fontSize(10).text(`${email || ""} ${phone ? " | " + phone : ""}`, { align: "center" });
    if (linkedin) doc.moveDown(0.2).text(`LinkedIn: ${linkedin}`, { align: "center" });
    if (portfolio) doc.moveDown(0.2).text(`Portfolio: ${portfolio}`, { align: "center" });

    doc.moveDown();
    doc.fontSize(11).text(enhancedText, { align: "left" });

    doc.end();

    // wait for finish
    await new Promise((resolve, reject) => {
      stream.on("finish", resolve);
      stream.on("error", reject);
    });

    // Upload to Cloudinary (cloudinary.v2 should already be configured by your connectCloudinary())
    const uploadResult = await cloudinary.v2.uploader.upload(pdfPath, {
      folder: "resumes",
      resource_type: "raw", // PDF as raw
    });

    // Insert into DB. ADD file_url and cloudinary_id columns to resumes table (see migration below)
    const promptSummary = "Enhanced resume generated (resume-builder)";
    await sql`
      INSERT INTO resumes (user_id, prompt, content, type, file_url, cloudinary_id)
      VALUES (${userId}, ${promptSummary}, ${enhancedText}, 'enhanced-resume', ${uploadResult.secure_url}, ${uploadResult.public_id})
    `;

    // delete local file
    try { fs.unlinkSync(pdfPath); } catch (e) { /* non-fatal */ }

    // return to frontend
    return res.json({
      success: true,
      content: enhancedText,
      url: uploadResult.secure_url,
      cloudinary_id: uploadResult.public_id,
    });
  } catch (error) {
    console.error("generateEnhancedResume error:", error);
    return res.status(500).json({ success: false, message: error.message || String(error) });
  }
};

export const updateResume = async (req, res) => {
  try {
    const { userId } = req.auth ? req.auth() : { userId: null };
    const resumeFile = req.file;
    const { role = "", skills = "" } = req.body;

    if (!resumeFile) return res.json({ success: false, message: "No resume uploaded" });

    // Read PDF content
    const dataBuffer = fs.readFileSync(resumeFile.path); // <-- THIS WAS MISSING
    const pdfData = await pdf(dataBuffer);

    // AI prompt for updating resume
    const prompt = `
You are a career coach and expert resume writer. Update the following resume with:
1. Highlighted role: ${role}
2. Key skills: ${skills}
3. Format in ATS-friendly bullets
4. Keep professional tone and concise

Resume Content:
${pdfData.text}
    `;

    const aiResponse = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.25,
      max_tokens: 1200,
    });

    const enhancedText = aiResponse.choices?.[0]?.message?.content || "No response";

    // Create PDF
    const uploadDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

    const pdfFilename = `${Date.now()}-updated-resume.pdf`;
    const pdfPath = path.join(uploadDir, pdfFilename);

    const doc = new PDFDocument({ margin: 40 });
    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);

    doc.fontSize(18).text(role || "Updated Resume", { align: "center" });
    doc.moveDown();
    doc.fontSize(11).text(enhancedText, { align: "left" });
    doc.end();

    await new Promise((resolve, reject) => {
      stream.on("finish", resolve);
      stream.on("error", reject);
    });

    // Upload PDF to Cloudinary
    const uploadResult = await cloudinary.v2.uploader.upload(pdfPath, {
      folder: "resumes",
      resource_type: "raw",
    });

    // Insert/update DB
    await sql`
      INSERT INTO resumes (user_id, prompt, content, type, file_url, cloudinary_id)
      VALUES (${userId}, 'Resume updated via update-resume', ${enhancedText}, 'updated-resume', ${uploadResult.secure_url}, ${uploadResult.public_id})
    `;

    // Cleanup local file
    try { fs.unlinkSync(pdfPath); } catch(e) {}
    try { fs.unlinkSync(resumeFile.path); } catch(e) {}

    res.json({ success: true, content: enhancedText, url: uploadResult.secure_url });

  } catch (error) {
    console.error("updateResume error:", error);
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};
