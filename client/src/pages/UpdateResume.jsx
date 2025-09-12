import { FileText, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '@clerk/clerk-react';
import Markdown from 'react-markdown';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export default function UpdateResume() {
  const [resumeFile, setResumeFile] = useState(null);
  const [role, setRole] = useState('');
  const [skills, setSkills] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');

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
      formData.append('resume', resumeFile);
      formData.append('role', role);
      formData.append('skills', skills);

      const { data } = await axios.post('/api/ai/update-resume', formData, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        setContent(data.content);
        toast.success("Resume updated successfully!");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
    setLoading(false);
  };

  return (
  <div className="min-h-screen p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 bg-gray-50 text-slate-700">
    {/* Left column - Form */}
    <form
      onSubmit={onSubmitHandler}
      className="flex-1 p-8 bg-white border rounded border-gray-200 overflow-y-auto"
    >
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="w-6 text-[#00DA83]" />
        <h1 className="text-xl font-semibold">Update Resume</h1>
      </div>

      {/* Upload */}
      <label className="block text-sm font-medium">Upload Resume</label>
      <input
        onChange={(e) => setResumeFile(e.target.files[0])}
        type="file"
        accept="application/pdf"
        className="w-full p-2 px-3 mt-2 outline-none text-sm border border-gray-300 rounded-md text-gray-600"
        required
      />
      <p className="text-sm text-gray-500 mt-1">Supports PDF only.</p>

      {/* Role */}
      <label className="block mt-6 text-sm font-medium">Suggested Role</label>
      <input
        value={role}
        onChange={(e) => setRole(e.target.value)}
        type="text"
        placeholder="e.g. Frontend Developer"
        className="w-full p-2 px-3 mt-2 outline-none text-sm border border-gray-300 rounded-md text-gray-600"
        required
      />

      {/* Skills */}
      <label className="block mt-6 text-sm font-medium">Highlight Skills</label>
      <textarea
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
        placeholder="e.g. React, Node.js, MySQL"
        className="w-full p-2 px-3 mt-2 outline-none text-sm border border-gray-300 rounded-md text-gray-600"
        rows={3}
      />

      {/* Button */}
      <button
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#00DA83] to-[#009BB3] text-white px-4 py-2 mt-8 text-sm rounded-lg cursor-pointer hover:opacity-90 transition"
      >
        {loading ? (
          <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
        ) : (
          <FileText className="w-5" />
        )}
        Update Resume
      </button>
    </form>

    {/* Right column - Result */}
    <div className="flex-1 p-8 bg-white overflow-y-auto">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-5 h-5 text-[#00DA83]" />
        <h1 className="text-xl font-semibold">Updated Resume Result</h1>
      </div>

      {!content ? (
        <div className="flex-1 flex justify-center items-center text-center text-gray-400">
          <div className="text-sm flex flex-col items-center gap-5">
            <FileText className="w-9 h-9" />
            <p>Upload a resume, add role & skills, then click "Update Resume"</p>
          </div>
        </div>
      ) : (
        <div className="mt-3 h-full overflow-y-auto text-sm text-slate-600">
          <div className="reset-tw">
            <Markdown>{content}</Markdown>
          </div>
        </div>
      )}
    </div>
  </div>
);
}
