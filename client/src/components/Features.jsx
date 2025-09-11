import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Sparkles, Target, Briefcase, TrendingUp } from "lucide-react";

export default function Features() {
  const navigate = useNavigate();
  const { user } = useUser();

  const features = [
    {
      title: "AI Resume Optimization",
      description:
        "Tailor your resume for specific job roles with AI-driven recommendations.",
      icon: Sparkles,
      bg: { from: "#7C3AED", to: "#6D28D9" },
      path: "/builder",
    },
    {
      title: "Skill Gap Analysis",
      description:
        "Identify missing skills and receive suggestions to strengthen your profile.",
      icon: Target,
      bg: { from: "#2563EB", to: "#1D4ED8" },
      path: "/skills",
    },
    {
      title: "Job Role Matching",
      description:
        "Instantly match your resume with job descriptions to boost hiring chances.",
      icon: Briefcase,
      bg: { from: "#059669", to: "#047857" },
      path: "/matcher",
    },
    {
      title: "Personalized Growth Paths",
      description:
        "Get tailored learning and career recommendations to level up faster.",
      icon: TrendingUp,
      bg: { from: "#F59E0B", to: "#D97706" },
      path: "/growth",
    },
  ];

  return (
    <div className="px-4 sm:px-20 xl:px-32 my-24">
      {/* Section Header */}
      <div className="text-center">
        <h2 className="text-slate-700 text-[42px] font-semibold">
          Powerful Resume Features
        </h2>
        <p className="text-gray-500 max-w-lg mx-auto">
          Go beyond traditional resume builders. Unlock AI-powered tools to
          showcase your strengths and land your dream job faster.
        </p>
      </div>

      {/* Features Grid */}
      <div className="flex flex-wrap justify-center mt-10">
        {features.map((feature, index) => (
          <div
            key={index}
            className="p-8 m-4 max-w-xs rounded-lg bg-white shadow-lg border border-gray-100 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            onClick={() => user && navigate(feature.path)}
          >
            <feature.icon
              className="w-12 h-12 p-3 text-white rounded-xl"
              style={{
                background: `linear-gradient(to bottom, ${feature.bg.from}, ${feature.bg.to})`,
              }}
            />
            <h3 className="mt-6 mb-3 text-lg font-semibold">
              {feature.title}
            </h3>
            <p className="text-gray-400 text-sm max-w-[95%]">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
