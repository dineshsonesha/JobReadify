import React, { useState } from "react";
import { Gem, Sparkles, FileText, PlusCircle } from "lucide-react";
import { Protect } from "@clerk/clerk-react";

export default function Dashboard() {
  const [creations, setCreations] = useState([]);
  const templates = [
    {
      id: 1,
      name: "Modern Resume",
      description: "Clean and ATS-friendly format for job applications.",
    },
    {
      id: 2,
      name: "Creative Resume",
      description: "Stylish layout with highlights for projects & skills.",
    },
    {
      id: 3,
      name: "Minimal Resume",
      description: "Simple, elegant design for a professional touch.",
    },
  ];

  return (
    <div className="h-full overflow-y-scroll p-6">
      {/* Stats Cards */}
      <div className="flex justify-start gap-4 flex-wrap">
        {/* Total Creations */}
        <div className="flex justify-between items-center w-72 p-4 px-6 rounded-xl bg-white border border-gray-200">
          <div className="text-slate-600">
            <p className="text-sm">Total Creations</p>
            <h2 className="text-xl font-semibold">{creations.length}</h2>
          </div>
          <div className="w-10 h-10 flex items-center justify-center text-white rounded-lg bg-gradient-to-br from-[#3588F2] to-[#0BB0D7]">
            <Sparkles className="w-5 text-white" />
          </div>
        </div>

        {/* Active Plan */}
        <div className="flex justify-between items-center w-72 p-4 px-6 rounded-xl bg-white border border-gray-200">
          <div className="text-slate-600">
            <p className="text-sm">Active Plan</p>
            <h2 className="text-xl font-semibold">
              <Protect plan="premium" fallback="Free">
                Premium
              </Protect>
            </h2>
          </div>
          <div className="w-10 h-10 flex items-center justify-center text-white rounded-lg bg-gradient-to-br from-[#FF61C5] to-[#9E53EE]">
            <Gem className="w-5 text-white" />
          </div>
        </div>
      </div>

      {/* Templates Section */}
      <div className="mt-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-slate-700">Choose a Template</h2>
          <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:scale-105 transition">
            <PlusCircle className="w-4 h-4" />
            Create New Resume
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className="p-6 rounded-xl bg-white border border-gray-200 shadow hover:shadow-lg transition cursor-pointer"
            >
              <FileText className="w-10 h-10 text-indigo-600 mb-4" />
              <h3 className="text-lg font-semibold">{template.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{template.description}</p>
              <button className="text-indigo-600 font-medium hover:underline">
                Use Template
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Creations */}
      {loading ? (
        <div className="flex items-center justify-center h-3/4">
          <div className="w-11 h-11 rounded-full border-3 border-purple-500 border-t-transparent animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-3 mt-10">
          <p className="mb-4 text-lg font-semibold text-slate-700">
            Recent Creations
          </p>
          {creations.length > 0 ? (
            creations.map((item) => <CreationItem key={item.id} item={item} />)
          ) : (
            <p className="text-gray-500 text-sm">No creations yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
