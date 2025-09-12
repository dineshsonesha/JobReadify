// SkillGrowth.jsx (Improved UI)
import { TrendingUp, FileText } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import Markdown from "react-markdown";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export default function SkillGrowth() {
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

      const { data } = await axios.post("/api/ai/skill-growth", formData, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
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
        className="bg-white shadow-lg max-h-[600px] rounded-xl p-6 border border-gray-200 space-y-5"
      >
        <div className="flex items-center gap-3">
          <TrendingUp className="w-6 text-[#00DA83]" />
          <h1 className="text-2xl font-semibold">Skill Growth Suggestions</h1>
        </div>

        {/* Upload */}
        <div>
          <label className="block text-sm font-medium">Upload Resume (PDF)</label>
          <input
            onChange={(e) => setInput(e.target.files[0])}
            type="file"
            accept="application/pdf"
            className="w-full p-2 mt-2 text-sm border border-gray-300 rounded-md"
            required
          />
          <p className="text-sm text-gray-500 mt-1">Supports PDF resume only.</p>
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
          {loading ? "Analyzing..." : "Get Skill Growth Plan"}
        </button>
      </form>

      {/* Right: AI Growth Path */}
      <div className="bg-white shadow-lg rounded-xl p-6 border flex flex-col min-h-[450px] max-h-[600px]">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-5 h-5 text-[#00DA83]" />
          <h2 className="text-xl font-semibold">Growth Path</h2>
        </div>

        {!content ? (
          <div className="flex-1 flex items-center justify-center text-center text-gray-400 text-sm">
            <div className="flex flex-col items-center gap-4 max-w-sm">
              <TrendingUp className="w-10 h-10" />
              <p>
                Upload your resume and click{" "}
                <span className="font-medium text-slate-600">Get Skill Growth Plan</span> to see
                which skills you should learn next.
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
