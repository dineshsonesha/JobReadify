// ReviewResume.jsx (Polished UI like SkillGrowth)
import { FileText, Sparkles } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";
import Markdown from "react-markdown";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export default function ReviewResume() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("resume", input);

      const { data } = await axios.post("/api/ai/resume-review", formData, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        setContent(data.content);
        toast.success("Resume reviewed successfully!");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 bg-gray-50 text-slate-700">
      {/* Left: Upload Form */}
      <form
        onSubmit={onSubmitHandler}
        className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 space-y-5 max-h-[600px]"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-purple-500" />
          <h1 className="text-2xl font-semibold text-slate-800">Resume Review</h1>
        </div>

        {/* Upload */}
        <div>
          <label className="block text-sm font-medium text-slate-600">Upload Resume (PDF)</label>
          <input
            onChange={(e) => setInput(e.target.files[0])}
            type="file"
            accept="application/pdf"
            className="w-full p-2 mt-2 text-sm border border-gray-300 rounded-md"
            required
          />
          <p className="text-sm text-gray-500 mt-1">Supports PDF resumes only.</p>
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-gradient-to-r from-[#3C81F6]/80 to-[#9234EA]/80 text-white rounded-md flex items-center justify-center cursor-pointer gap-2"
        >
          {loading ?
            <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span> : <FileText className="w-4" />} Review Resume
        </button>
      </form>

      {/* Right: Review Analysis */}
      <div className="bg-white shadow-lg rounded-xl p-6 border flex flex-col min-h-[450px] max-h-[600px]">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-5 h-5 text-purple-500" />
          <h2 className="text-xl font-semibold text-slate-800">Analysis Result</h2>
        </div>

        {!content ? (
          <div className="flex-1 flex items-center justify-center text-center text-gray-400 text-sm">
            <div className="flex flex-col items-center gap-4 max-w-sm">
              <FileText className="w-10 h-10" />
              <p>
                Upload your resume and click{" "}
                <span className="font-medium text-slate-600">Review Resume</span> to receive AI-powered feedback.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <div className="bg-gray-50 p-4 rounded text-sm">
              <Markdown>{content}</Markdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
