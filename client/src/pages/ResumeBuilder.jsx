// ResumeBuilder.jsx (updated)
import React, { useState } from "react";
import { FileText, Sparkles } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";
import Markdown from "react-markdown";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export default function ResumeBuilder() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    education: "",
    skills: "",
    experience: "",
    summary: "",
    linkedin: "",
    portfolio: "",
    certifications: "",
    achievements: "",
  });
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");

  const { getToken } = useAuth();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = await getToken();
      const { data } = await axios.post("/api/ai/resume-builder", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!data.success) {
        toast.error(data.message || "Something went wrong");
        setLoading(false);
        return;
      }

      setContent(data.content || "");
      setPdfUrl(data.url || "");
      setPreview(true);

      // open preview in new tab (optional)
      if (data.url) window.open(data.url, "_blank");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start gap-4 text-slate-700">
      {/* Left: form */}
      <form onSubmit={handleSubmit} className="w-full max-w-lg p-5 bg-white border rounded-lg shadow-sm">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-primary" />
          <h1 className="text-xl font-semibold">Resume Builder</h1>
        </div>

        <div className="mt-6 space-y-3">
          <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Full name" required className="w-full p-2 border rounded" />
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required className="w-full p-2 border rounded" />
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="w-full p-2 border rounded" />
          <input name="linkedin" value={form.linkedin} onChange={handleChange} placeholder="LinkedIn URL (optional)" className="w-full p-2 border rounded" />
          <input name="portfolio" value={form.portfolio} onChange={handleChange} placeholder="Portfolio / GitHub (optional)" className="w-full p-2 border rounded" />
          <textarea name="education" value={form.education} onChange={handleChange} placeholder="Education" rows={2} className="w-full p-2 border rounded" />
          <textarea name="skills" value={form.skills} onChange={handleChange} placeholder="Skills (comma separated)" rows={2} className="w-full p-2 border rounded" />
          <textarea name="experience" value={form.experience} onChange={handleChange} placeholder="Experience (leave empty if none)" rows={3} className="w-full p-2 border rounded" />
          <textarea name="certifications" value={form.certifications} onChange={handleChange} placeholder="Certifications (optional)" rows={2} className="w-full p-2 border rounded" />
          <textarea name="achievements" value={form.achievements} onChange={handleChange} placeholder="Achievements (optional)" rows={2} className="w-full p-2 border rounded" />
          <textarea name="summary" value={form.summary} onChange={handleChange} placeholder="Professional summary (optional)" rows={2} className="w-full p-2 border rounded" />
        </div>

        <button type="submit" disabled={loading} className="w-full mt-4 py-2 bg-gradient-to-r from-indigo-700 to-purple-500 text-white rounded flex items-center justify-center gap-2">
          <FileText className="w-4" />
          {loading ? "Generating..." : "Generate Resume"}
        </button>
      </form>

      {/* Right: AI Assistant and preview */}
      <div className="w-full max-w-lg p-5 bg-white border rounded-lg shadow-sm min-h-[400px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-semibold">AI Assistant</h1>
          </div>
        </div>

        {!preview ? (
          <div className="flex-1 flex items-center justify-center h-full">
            <p className="text-gray-400 text-sm">Fill the form and click <b>Generate Resume</b> to see AI suggestions & PDF downloads.</p>
          </div>
        ) : (
          <div className="mt-4 text-sm text-slate-700 space-y-3">
            <h2 className="text-lg font-bold">{form.fullName}</h2>
            <p className="text-gray-600">{form.email} {form.phone && ` | ${form.phone}`}</p>

            <div>
              <h3 className="font-semibold mt-3">Enhanced Resume</h3>
              <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-3 rounded"><Markdown>{content}</Markdown></pre>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 mt-3">
              {pdfUrl && (
                <>
                  <button
                    onClick={() => window.open(pdfUrl, "_blank")}
                    className="px-3 py-2 border rounded hover:bg-gray-50"
                  >
                    View PDF
                  </button>

                  <a
                    href={pdfUrl}
                    download={`${form.fullName || "resume"}.pdf`}
                    className="px-3 py-2 border rounded hover:bg-gray-50"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Download PDF
                  </a>
                </>
              )}
            </div>

            {/* quick tips */}
            <div className="text-xs text-gray-500 mt-4">
              <p>Tip: If you had no experience, the AI creates project-based bullets. Add more certifications or project links for a stronger result.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
