import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useClerk } from "@clerk/clerk-react";
import { Sparkles, Target, FileText, TrendingUp, ArrowRight } from "lucide-react";

export default function Features() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { openSignIn } = useClerk();

  const features = [
    {
      title: "Resume Builder",
      description:
        "Create a professional, ATS-friendly resume from scratch using AI assistance.",
      icon: Sparkles,
      bg: { from: "#7C3AED", to: "#6D28D9" },
      path: "/ai/resume-builder",
    },
    {
      title: "Review Resume",
      description:
        "Get AI-powered feedback highlighting strengths, weaknesses, and improvements for your resume.",
      icon: FileText,
      bg: { from: "#F43F5E", to: "#BE123C" },
      path: "/ai/review-resume",
    },
    {
      title: "Skill Growth",
      description:
        "Identify missing skills and receive personalized learning paths to enhance your profile.",
      icon: Target,
      bg: { from: "#2563EB", to: "#1D4ED8" },
      path: "/ai/skill-growth",
    },
    {
      title: "Enhance Resume",
      description:
        "Enhance your existing resume with AI to highlight achievements, skills, and target roles effectively.",
      icon: TrendingUp,
      bg: { from: "#F59E0B", to: "#D97706" },
      path: "/ai/enhance-resume",
    },
  ];

  const handleClick = (path) => {
    if (user) {
      navigate(path);
    } else {
      openSignIn(); // opens Clerk login modal
    }
  };

  return (
    <div className="px-4 sm:px-20 xl:px-32 my-24">
      {/* Section Header */}
      <div className="text-center">
        <h2 className="text-slate-700 text-[42px] font-bold">
          Proficient Resume Tools
        </h2>
        <p className="text-gray-500 max-w-lg mx-auto mt-3">
          Enhance, review, and grow your resume with AI-powered tools tailored for professionals.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mt-12">
        {features.map((feature, index) => (
          <div
            key={index}
            className="relative p-8 rounded-2xl bg-white shadow-xl border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer flex flex-col items-center text-center group"
            onClick={() => handleClick(feature.path)}
          >
            <div
              className="p-6 rounded-xl mb-6"
              style={{
                background: `linear-gradient(135deg, ${feature.bg.from}, ${feature.bg.to})`,
              }}
            >
              <feature.icon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
            <p className="text-gray-500 text-sm mb-4">{feature.description}</p>
            {/* Hover Arrow */}
            <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <ArrowRight className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
