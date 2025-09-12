// Dashboard.jsx
import React, { useEffect, useState } from "react";
import { FileText, Sparkles, Download, Eye } from "lucide-react";
import { Protect, useAuth } from "@clerk/clerk-react";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export default function Dashboard() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();

  const getDashboardData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/user/get-user-resumes", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        setResumes(data.resumes);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Cards Row */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        {/* Total Resumes Card */}
        <div className="p-6 rounded-2xl bg-white/70 backdrop-blur-lg border border-gray-200 shadow-md hover:shadow-lg transition-all duration-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Total Resumes</p>
              <h2 className="text-3xl font-bold text-slate-700">{resumes.length}</h2>
            </div>
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Active Plan Card */}
        <div className="p-6 rounded-2xl bg-white/70 backdrop-blur-lg border border-gray-200 shadow-md hover:shadow-lg transition-all duration-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Active Plan</p>
              <h2 className="text-2xl font-bold text-slate-700">
                <Protect plan="premium" fallback="Free">
                  Premium
                </Protect>
              </h2>
            </div>
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-violet-500 text-white">
              <FileText className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Resume List */}
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200 shadow-md">
        <h3 className="text-xl font-semibold text-slate-700 mb-4">Recent Resumes</h3>

        {loading ? (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 bg-gray-200 rounded-lg"
              ></div>
            ))}
          </div>
        ) : resumes.length === 0 ? (
          <p className="text-gray-500">No resumes created yet.</p>
        ) : (
          <div className="space-y-4">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className="flex items-center justify-between p-4 rounded-xl border bg-white shadow-sm hover:shadow-md transition-all"
              >
                <div>
                  <h4 className="font-semibold text-slate-700 capitalize">
                    {resume.type.replace("-", " ")}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {new Date(resume.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  {resume.file_url && (
                    <>
                      <a
                        href={resume.file_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        <Eye className="w-4 h-4" /> View
                      </a>
                      <a
                        href={resume.file_url}
                        download={`${resume.type}.pdf`}
                        className="flex items-center gap-1 px-3 py-2 text-sm border rounded-lg hover:bg-gray-50 transition"
                      >
                        <Download className="w-4 h-4" /> Download
                      </a>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
