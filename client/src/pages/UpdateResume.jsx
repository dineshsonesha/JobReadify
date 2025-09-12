import {
  FileText,
  Sparkles,
  Download,
  Eye,
} from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";
import Markdown from "react-markdown";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export default function UpdateResume() {
  const [resumeFile, setResumeFile] = useState(null);
  const [role, setRole] = useState("");
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      toast.error("Please upload your resume");
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("resume", resumeFile);
      formData.append("role", role);
      formData.append("skills", skills);

      const { data } = await axios.post("/api/ai/update-resume", formData, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        setContent(data.content);
        setPdfUrl(data.url || "");
        toast.success("Resume updated successfully!");
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 bg-gray-50 text-slate-700">
      {/* Left: Form */}
      <form
        onSubmit={onSubmitHandler}
        className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 space-y-5"
      >
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-6 text-[#00DA83]" />
          <h1 className="text-2xl font-semibold">Enhance Your Resume</h1>
        </div>

        {/* Upload */}
        <div>
          <label className="block text-sm font-medium">Upload Resume (PDF)</label>
          <input
            onChange={(e) => setResumeFile(e.target.files[0])}
            type="file"
            accept="application/pdf"
            className="w-full p-2 mt-2 text-sm border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-medium">Target Role</label>
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            type="text"
            placeholder="e.g. Frontend Developer"
            className="w-full p-2 mt-2 text-sm border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Skills */}
        <div>
          <label className="block text-sm font-medium">Highlight Skills</label>
          <textarea
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="e.g. React, Node.js, MySQL"
            className="w-full p-2 mt-2 text-sm border border-gray-300 rounded-md"
            rows={3}
          />
        </div>

        {/* Button */}
        <button
          disabled={loading}
          className="w-full py-2 bg-gradient-to-r from-[#00DA83] to-[#009BB3] text-white rounded-md flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <FileText className="w-4" />
          )}
          {loading ? "Updating..." : "Update Resume"}
        </button>
      </form>

      {/* Right: Preview */}
      <div className="bg-white shadow-lg rounded-xl p-6 border flex flex-col">
        {/* Header with buttons */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-[#00DA83]" />
            <h2 className="text-xl font-semibold">AI enhance Preview</h2>
          </div>

          {pdfUrl && (
            <div className="flex gap-2">
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 bg-[#009BB3] text-white rounded-md text-sm"
              >
                <Eye className="w-4" /> View
              </a>
              <a
                href={pdfUrl}
                download="updated_resume.pdf"
                className="flex items-center gap-2 px-3 py-1.5 bg-[#00DA83] text-white rounded-md text-sm"
              >
                <Download className="w-4" /> Download
              </a>
            </div>
          )}
        </div>

        {/* Content */}
        {!content ? (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-sm text-center">
            Upload a resume, add role & skills, then click <b>Update Resume</b> to see results.
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <div className="mt-4 bg-gray-50 p-4 rounded text-sm">
              <Markdown>{content}</Markdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
