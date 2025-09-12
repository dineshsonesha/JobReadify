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

    const prompt = `
You are an expert career coach and professional resume reviewer.
Review the following resume and provide feedback in a concise, professional, and constructive tone.

Guidelines:
- Highlight strengths (clarity, structure, ATS keywords, measurable results).
- Identify weaknesses (formatting, vague wording, missing achievements).
- Suggest improvements (action verbs, quantifiable results, alignment with job roles).
- Keep the response professional, ATS-focused, and no longer than 6–8 short paragraphs.

Resume Content:
${pdfData.text}
`;

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = response.choices[0].message.content;

    await sql` INSERT INTO resumes (user_id, prompt, content, type) VALUES (${userId}, ${`Review the uploaded resume`}, ${content}, 'resume-review')`;

    if (plan !== 'premium') {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1
        }
      })
    }

    res.json({ success: true, content: content });
  } catch (error) {
    console.log(error.messages);
    res.json({ success: false, message: error.message });
  }
}

export const skillGrowth = async (req, res) => {
  try {
    const plan = req.plan;
    const free_usage = req.free_usage;
    const { userId } = req.auth();

    if (!req.file) {
      return res.json({ success: false, message: "No resume uploaded" });
    }
    if (plan !== 'premium' && free_usage >= 10) {
      return res.json({ success: false, message: 'You have reached your free usage limit. Upgrade to premium to generate more content.' });
    }

    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdf(dataBuffer);

    const prompt = `
You are a career coach and skill development expert.
Analyze the following resume and generate a **personalized skill growth plan**.

Guidelines:
- Identify missing or outdated skills relevant to the candidate's profile.
- Suggest trending tools, technologies, or frameworks for their industry.
- Recommend certifications, online courses, or learning paths.
- Provide a roadmap (short-term, mid-term, long-term).
- Keep the response professional, concise, and actionable (use bullet points where possible).

Resume Content:
${pdfData.text}
`;

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = response.choices[0].message.content;
    if (plan !== 'premium') {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1
        }
      })
    }

    res.json({ success: true, content });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

const addSection = (doc, title, content, isList = false) => {
  if (!content || (Array.isArray(content) && content.length === 0)) return;
  doc.moveDown(0.5);
  doc.font("Helvetica-Bold").fontSize(14).text(title);
  doc.moveDown(0.2);
  doc.font("Helvetica").fontSize(11);
  if (isList && Array.isArray(content)) {
    content.forEach((item) => {
      if (item.trim()) doc.text(`• ${item.trim()}`);
    });
  } else {
    doc.text(Array.isArray(content) ? content.join("\n") : content);
  }
};

export const CreateAiResume = async (req, res) => {
  try {
    const { userId } = req.auth ? req.auth() : { userId: null };
    const plan = req.plan;
    if (plan !== "premium") {
      return res.json({ success: false, message: "This feature is only for premium users." });
    }

    const form = req.body || {};
    const {
      fullName = "",
      email = "",
      phone = "",
      summary = "",
      education = "",
      skills = "",
      experience = "",
      projects = "",
      linkedin = "",
      portfolio = "",
      certifications = "",
      achievements = "",
    } = form;

   const prompt = `
You are an expert resume writer and career coach.
Given the candidate's details, generate a professional, ATS-friendly resume in JSON format only.
Follow these rules strictly:
- Use concise, professional language with strong action verbs.
- Where input details are missing, generate relevant and realistic placeholder content based on typical roles/projects/skills.
- Keep the tone formal and achievement-oriented.
- Use bullet-style phrasing for skills, experience, projects, certifications, and achievements.
- Do not include markdown, headings, commentary, or extra text outside the JSON.

Required JSON structure:
{
  "summary": "3-4 line professional summary highlighting strengths and goals",
  "skills": ["Key skills as short phrases"],
  "experience": ["Work experience or internships as impact-driven bullets; if none, generate academic/volunteer/project experience"],
  "projects": ["Key projects or academic projects as measurable bullets"],
  "education": "Formatted education details (Degree, Institution, Year)",
  "certifications": ["Relevant certifications or training"],
  "achievements": ["Notable achievements, awards, or recognitions"]
}

Candidate Details:
Name: ${fullName || "N/A"}
Email: ${email || "N/A"}
Phone: ${phone || "N/A"}
LinkedIn: ${linkedin || ""}
Portfolio: ${portfolio || ""}
Summary: ${summary || ""}
Education: ${education || ""}
Skills: ${skills || ""}
Experience: ${experience || ""}
Projects: ${projects || ""}
Certifications: ${certifications || ""}
Achievements: ${achievements || ""}

Respond with JSON only, no explanations or formatting outside the JSON.
`;

    const aiResponse = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.25,
      max_tokens: 1200,
    });

    const rawContent = aiResponse.choices?.[0]?.message?.content || "";

    // Robust JSON parsing
    let parsed = {};
    const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        parsed = JSON.parse(jsonMatch[0]);
      } catch {
        parsed = { summary: rawContent, skills: [], experience: [], education: "", certifications: [], achievements: [] };
      }
    } else {
      parsed = { summary: rawContent, skills: [], experience: [], education: "", certifications: [], achievements: [] };
    }

    parsed.skills = Array.isArray(parsed.skills) ? parsed.skills : [];
    parsed.experience = Array.isArray(parsed.experience) ? parsed.experience : [];
    parsed.certifications = Array.isArray(parsed.certifications) ? parsed.certifications : [];
    parsed.achievements = Array.isArray(parsed.achievements) ? parsed.achievements : [];

    const uploadDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

    const pdfFilename = `${Date.now()}-resume.pdf`;
    const pdfPath = path.join(uploadDir, pdfFilename);

    const doc = new PDFDocument({ margin: 40 });
    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);

    // Header
    doc.fontSize(18).font("Helvetica-Bold").text(fullName || "Name", { align: "center" });
    doc.moveDown(0.2);
    doc.fontSize(10).font("Helvetica").text([email, phone].filter(Boolean).join(" | "), { align: "center" });
    if (linkedin) doc.moveDown(0.2).text(`LinkedIn: ${linkedin}`, { align: "center" });
    if (portfolio) doc.moveDown(0.2).text(`Portfolio: ${portfolio}`, { align: "center" });

    // Sections
    addSection(doc, "Professional Summary", parsed.summary);
    addSection(doc, "Key Skills", parsed.skills, true);
    addSection(doc, "Experience", parsed.experience, true);
    addSection(doc, "Projects", parsed.projects, true);
    addSection(doc, "Education", parsed.education);
    addSection(doc, "Certifications & Achievements", [...parsed.certifications, ...parsed.achievements], true);

    doc.end();
    await new Promise((resolve, reject) => {
      stream.on("finish", resolve);
      stream.on("error", reject);
    });

    // Upload to Cloudinary
    const uploadResult = await cloudinary.v2.uploader.upload(pdfPath, {
      folder: "resumes",
      resource_type: "auto",
      format: "pdf",
    });

    // Save in DB
    await sql`
      INSERT INTO resumes (user_id, prompt, content, type, file_url, cloudinary_id)
      VALUES (${userId}, 'AI Generated Resume', ${rawContent}, 'enhanced-resume', ${uploadResult.secure_url}, ${uploadResult.public_id})
    `;

    try { fs.unlinkSync(pdfPath); } catch (e) { }

    return res.json({
      success: true,
      content: parsed,
      url: uploadResult.secure_url,
      cloudinary_id: uploadResult.public_id,
    });

  } catch (error) {
    console.error("CreateAiResume error:", error);
    return res.status(500).json({ success: false, message: error.message || String(error) });
  }
};

export const generateEnhancedResume = async (req, res) => {
  try {
    const { userId } = req.auth ? req.auth() : { userId: null };
    const plan = req.plan;
    const resumeFile = req.file;
    const { role = "", skills = "" } = req.body;

    if (!resumeFile) return res.status(400).json({ success: false, message: "No resume uploaded" });
    if (plan !== "premium") return res.status(403).json({ success: false, message: "Feature only for premium users" });

    // 1️⃣ Read PDF safely
    const dataBuffer = fs.readFileSync(resumeFile.path);
    const pdfData = await pdf(dataBuffer);
    if (!pdfData.text || pdfData.text.trim() === "") {
      return res.status(400).json({ success: false, message: "PDF has no readable text" });
    }

    // 2️⃣ Prompt AI
    const prompt = `
You are a career coach and expert resume writer.
Enhance the following resume by aligning it with the target role and skills.
Guidelines:
- Emphasize the role: ${role}
- Highlight skills: ${skills}
- Optimize for ATS
- Use professional tone
- Respond in JSON format

Required JSON structure:
{
  "summary": "string",
  "skills": ["string"],
  "experience": ["string"],
  "education": "string",
  "certifications": ["string"],
  "achievements": ["string"]
}

Resume Content:
${pdfData.text}
`;

    const aiResponse = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.25,
      max_tokens: 1200,
    });

    const rawContent = aiResponse.choices?.[0]?.message?.content || "";

    // 3️⃣ Parse AI response safely
    let parsed = {};
    try {
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    } catch (e) {
      console.warn("AI JSON parsing failed", e);
      parsed = {};
    }

    // 4️⃣ Provide safe defaults
    const safeArray = (arr) => Array.isArray(arr) ? arr : [];
    parsed.summary = typeof parsed.summary === "string" ? parsed.summary : "No summary available";
    parsed.skills = safeArray(parsed.skills);
    parsed.experience = safeArray(parsed.experience);
    parsed.education = typeof parsed.education === "string" ? parsed.education : "Education details not available";
    parsed.certifications = safeArray(parsed.certifications);
    parsed.achievements = safeArray(parsed.achievements);

    // 5️⃣ Generate PDF safely
    const uploadDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

    const pdfFilename = `${Date.now()}-updated-resume.pdf`;
    const pdfPath = path.join(uploadDir, pdfFilename);

    const doc = new PDFDocument({ margin: 40 });
    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);

    // Helper: addSection
    const addSection = (doc, title, content, isList = false) => {
      doc.moveDown().fontSize(14).font("Helvetica-Bold").text(title);
      doc.moveDown(0.2).fontSize(12).font("Helvetica");
      if (isList && Array.isArray(content)) {
        content.forEach((item) => {
          if (typeof item === "string") doc.text(`• ${item}`);
        });
      } else if (typeof content === "string") {
        doc.text(content);
      }
    };

    doc.fontSize(18).font("Helvetica-Bold").text(role || "Updated Resume", { align: "center" });

    addSection(doc, "Professional Summary", parsed.summary);
    addSection(doc, "Key Skills", parsed.skills, true);
    addSection(doc, "Experience", parsed.experience, true);
    addSection(doc, "Education", parsed.education);
    addSection(doc, "Certifications & Achievements", [...parsed.certifications, ...parsed.achievements], true);

    doc.end();
    await new Promise((resolve, reject) => {
      stream.on("finish", resolve);
      stream.on("error", reject);
    });

    // 6️⃣ Upload to Cloudinary
    const uploadResult = await cloudinary.v2.uploader.upload(pdfPath, {
      folder: "resumes",
      resource_type: "raw",
    });

    // 7️⃣ Save in DB
    await sql`
      INSERT INTO resumes (user_id, prompt, content, type, file_url, cloudinary_id)
      VALUES (${userId}, 'Updated Resume', ${rawContent}, 'updated-resume', ${uploadResult.secure_url}, ${uploadResult.public_id})
    `;

    // Cleanup
    fs.unlinkSync(pdfPath);
    fs.unlinkSync(resumeFile.path);

    res.json({ success: true, content: parsed, url: uploadResult.secure_url });
  } catch (error) {
    console.error("generateEnhancedResume error:", error);
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};
