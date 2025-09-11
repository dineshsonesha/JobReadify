import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";
import user_group from "../assets/user_group.png";

export default function Hero() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(!open);

  return (
    <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 py-16">
      {/* Tagline */}
      <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 rounded-full px-4 py-2 text-sm font-medium mb-6">
        <Sparkles className="w-4 h-4" />
        Smarter Resume Building with AI
      </div>

      {/* Title */}
      <h1 className="text-4xl sm:text-6xl font-bold text-gray-800 leading-tight mb-6 max-w-3xl">
        Land Your Dream Job with{" "}
        <span className="text-purple-600">AI-Powered Resumes</span>
      </h1>

      {/* Subtitle */}
      <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl">
        Go beyond traditional resume builders. Optimize your resume for specific
        roles, identify skill gaps, and unlock personalized growth paths to
        accelerate your career.
      </p>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => navigate("/ai/resume-builder")}
          className="group inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-lg shadow-md transition"
        >
          Start Building
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          onClick={handleOpen}
          className="px-8 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
        >
          Watch Demo
        </button>
      </div>

      {/* Social proof */}
      <div className="flex items-center gap-3 mt-8 text-gray-600">
        <img src={user_group} alt="users" className="h-8" />
        <span>Trusted by 10K+ job seekers</span>
      </div>

    </section>
  );
}
