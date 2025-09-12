// import React, { useState } from "react";
// import {
//   FileText,
//   Sparkles,
//   Download,
//   Eye,
//   Mail,
//   Phone,
//   Linkedin,
//   Globe,
// } from "lucide-react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { useAuth } from "@clerk/clerk-react";
// import Markdown from "react-markdown";

// axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

// export default function ResumeBuilder() {
//   const [form, setForm] = useState({
//     fullName: "",
//     email: "",
//     phone: "",
//     education: "",
//     skills: "",
//     experience: "",
//     summary: "",
//     linkedin: "",
//     portfolio: "",
//     certifications: "",
//     achievements: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [content, setContent] = useState("");
//   const [pdfUrl, setPdfUrl] = useState("");

//   const { getToken } = useAuth();

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       const token = await getToken();
//       const { data } = await axios.post("/api/ai/resume-builder", form, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!data.success) {
//         toast.error(data.message || "Something went wrong");
//         setLoading(false);
//         return;
//       }

//       setContent(data.content || "");
//       setPdfUrl(data.url || "");
//     } catch (err) {
//       console.error(err);
//       toast.error("Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 bg-gray-50 text-slate-700">
//       {/* Left: Form */}
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 space-y-5"
//       >
//         <div className="flex items-center gap-3 mb-2">
//           <Sparkles className="w-6 text-[#00DA83]" />
//           <h1 className="text-2xl font-semibold">Build Your Resume</h1>
//         </div>

//         {/* Personal Info */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <input
//             name="fullName"
//             value={form.fullName}
//             onChange={handleChange}
//             placeholder="Full name"
//             required
//             className="p-2 border rounded"
//           />
//           <input
//             name="email"
//             type="email"
//             value={form.email}
//             onChange={handleChange}
//             placeholder="Email"
//             required
//             className="p-2 border rounded"
//           />
//           <input
//             name="phone"
//             value={form.phone}
//             onChange={handleChange}
//             placeholder="Phone"
//             className="p-2 border rounded"
//           />
//           <input
//             name="linkedin"
//             value={form.linkedin}
//             onChange={handleChange}
//             placeholder="LinkedIn URL"
//             className="p-2 border rounded"
//           />
//           <input
//             name="portfolio"
//             value={form.portfolio}
//             onChange={handleChange}
//             placeholder="Portfolio / GitHub"
//             className="p-2 border rounded"
//           />
//         </div>

//         {/* Other Details */}
//         <textarea
//           name="summary"
//           value={form.summary}
//           onChange={handleChange}
//           placeholder="Professional Summary"
//           rows={3}
//           className="w-full p-2 border rounded"
//         />
//         <textarea
//           name="skills"
//           value={form.skills}
//           onChange={handleChange}
//           placeholder="Skills (comma separated)"
//           rows={2}
//           className="w-full p-2 border rounded"
//         />
//         <textarea
//           name="experience"
//           value={form.experience}
//           onChange={handleChange}
//           placeholder="Experience"
//           rows={3}
//           className="w-full p-2 border rounded"
//         />
//         <textarea
//           name="education"
//           value={form.education}
//           onChange={handleChange}
//           placeholder="Education"
//           rows={2}
//           className="w-full p-2 border rounded"
//         />
//         <textarea
//           name="certifications"
//           value={form.certifications}
//           onChange={handleChange}
//           placeholder="Certifications"
//           rows={2}
//           className="w-full p-2 border rounded"
//         />
//         <textarea
//           name="achievements"
//           value={form.achievements}
//           onChange={handleChange}
//           placeholder="Achievements"
//           rows={2}
//           className="w-full p-2 border rounded"
//         />

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full py-2 bg-gradient-to-r from-[#00DA83] to-[#009BB3] text-white rounded-md flex items-center justify-center gap-2"
//         >
//           <FileText className="w-4" />
//           {loading ? "Generating..." : "Generate Resume"}
//         </button>
//       </form>

//       {/* Right: Preview */}
//       <div className="bg-white shadow-lg rounded-xl p-6 border flex flex-col">
//         {/* Header with action buttons */}
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center gap-3">
//             <FileText className="w-5 h-5 text-[#00DA83]" />
//             <h2 className="text-xl font-semibold">AI Enhanced Preview</h2>
//           </div>

//           {pdfUrl && (
//             <div className="flex gap-2">
//               <a
//                 href={pdfUrl}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="flex items-center gap-2 px-3 py-1.5 bg-[#009BB3] text-white rounded-md text-sm"
//               >
//                 <Eye className="w-4" /> View
//               </a>
//               <a
//                 href={pdfUrl}
//                 download={`${form.fullName || "resume"}.pdf`}
//                 className="flex items-center gap-2 px-3 py-1.5 bg-[#00DA83] text-white rounded-md text-sm"
//               >
//                 <Download className="w-4" /> Download
//               </a>
//             </div>
//           )}
//         </div>

//         {/* Resume content */}
//         {!content ? (
//           <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
//             Fill in details & click <b>Generate Resume</b> to see the preview.
//           </div>
//         ) : (
//           <div className="flex-1 overflow-y-auto">
//             <h2 className="text-lg font-bold">{form.fullName}</h2>
//             <p className="text-gray-600 flex items-center gap-2">
//               <Mail className="w-4" /> {form.email}
//               {form.phone && (
//                 <>
//                   <span>|</span> <Phone className="w-4" /> {form.phone}
//                 </>
//               )}
//             </p>
//             {form.linkedin && (
//               <p className="text-gray-600 flex items-center gap-2 mt-1">
//                 <Linkedin className="w-4" /> {form.linkedin}
//               </p>
//             )}
//             {form.portfolio && (
//               <p className="text-gray-600 flex items-center gap-2 mt-1">
//                 <Globe className="w-4" /> {form.portfolio}
//               </p>
//             )}

//             <div className="mt-4 bg-gray-50 p-4 rounded text-sm">
//               <Markdown>{content}</Markdown>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
import React, { useState } from "react";
import {
  FileText,
  Sparkles,
  Download,
  Eye,
  Mail,
  Phone,
  Linkedin,
  Globe,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";

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

  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState({}); // JSON object now
  const [pdfUrl, setPdfUrl] = useState("");

  const { getToken } = useAuth();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

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

      // Backend now returns structured JSON
      setContent(data.content || {});
      setPdfUrl(data.url || "");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 bg-gray-50 text-slate-700">
      {/* Left: Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 space-y-5"
      >
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-6 text-[#00DA83]" />
          <h1 className="text-2xl font-semibold">Build Your Resume</h1>
        </div>

        {/* Personal Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Full name"
            required
            className="p-2 border rounded"
          />
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="p-2 border rounded"
          />
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="p-2 border rounded"
          />
          <input
            name="linkedin"
            value={form.linkedin}
            onChange={handleChange}
            placeholder="LinkedIn URL"
            className="p-2 border rounded"
          />
          <input
            name="portfolio"
            value={form.portfolio}
            onChange={handleChange}
            placeholder="Portfolio / GitHub"
            className="p-2 border rounded"
          />
        </div>

        {/* Other Details */}
        <textarea
          name="summary"
          value={form.summary}
          onChange={handleChange}
          placeholder="Professional Summary"
          rows={3}
          className="w-full p-2 border rounded"
        />
        <textarea
          name="skills"
          value={form.skills}
          onChange={handleChange}
          placeholder="Skills (comma separated)"
          rows={2}
          className="w-full p-2 border rounded"
        />
        <textarea
          name="experience"
          value={form.experience}
          onChange={handleChange}
          placeholder="Experience"
          rows={3}
          className="w-full p-2 border rounded"
        />
        <textarea
          name="projects"
          value={form.projects}
          onChange={handleChange}
          placeholder="Projects"
          rows={3}
          className="w-full p-2 border rounded"
        />
        <textarea
          name="education"
          value={form.education}
          onChange={handleChange}
          placeholder="Education"
          rows={2}
          className="w-full p-2 border rounded"
        />
        <textarea
          name="certifications"
          value={form.certifications}
          onChange={handleChange}
          placeholder="Certifications"
          rows={2}
          className="w-full p-2 border rounded"
        />
        <textarea
          name="achievements"
          value={form.achievements}
          onChange={handleChange}
          placeholder="Achievements"
          rows={2}
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-gradient-to-r from-[#00DA83] to-[#009BB3] text-white rounded-md flex items-center justify-center gap-2"
        >
          <FileText className="w-4" />
          {loading ? "Generating..." : "Generate Resume"}
        </button>
      </form>

      {/* Right: Preview */}
      <div className="bg-white shadow-lg rounded-xl p-6 border flex flex-col">
        {/* Header with action buttons */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-[#00DA83]" />
            <h2 className="text-xl font-semibold">AI Enhanced Preview</h2>
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
                download={`${form.fullName || "resume"}.pdf`}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#00DA83] text-white rounded-md text-sm"
              >
                <Download className="w-4" /> Download
              </a>
            </div>
          )}
        </div>

        {/* Resume content */}
        {!Object.keys(content).length ? (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
            Fill in details & click <b>Generate Resume</b> to see the preview.
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-3">
            <h2 className="text-lg font-bold">{form.fullName}</h2>
            <p className="text-gray-600 flex items-center gap-2">
              <Mail className="w-4" /> {form.email}
              {form.phone && (
                <>
                  <span>|</span> <Phone className="w-4" /> {form.phone}
                </>
              )}
            </p>
            {form.linkedin && (
              <p className="text-gray-600 flex items-center gap-2 mt-1">
                <Linkedin className="w-4" /> {form.linkedin}
              </p>
            )}
            {form.portfolio && (
              <p className="text-gray-600 flex items-center gap-2 mt-1">
                <Globe className="w-4" /> {form.portfolio}
              </p>
            )}

            {/* Structured Resume Preview */}
            <div className="mt-4 bg-gray-50 p-4 rounded text-sm space-y-3">
              {content.summary && (
                <div>
                  <h3 className="font-semibold">Professional Summary</h3>
                  <p>{content.summary}</p>
                </div>
              )}

              {content.skills?.length > 0 && (
                <div>
                  <h3 className="font-semibold">Key Skills</h3>
                  <ul className="list-disc list-inside">
                    {content.skills.map((skill, i) => (
                      <li key={i}>{skill}</li>
                    ))}
                  </ul>
                </div>
              )}

              {content.experience?.length > 0 && (
                <div>
                  <h3 className="font-semibold">Experience / Projects</h3>
                  <ul className="list-disc list-inside">
                    {content.experience.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {content.projects?.length > 0 && (
                <div>
                  <h3 className="font-semibold">Projects</h3>
                  <ul className="list-disc list-inside">
                    {content.projects.map((proj, i) => (
                      <li key={i}>{proj}</li>
                    ))}
                  </ul>
                </div>
              )}

              {content.education && (
                <div>
                  <h3 className="font-semibold">Education</h3>
                  <p>{content.education}</p>
                </div>
              )}

              {(content.certifications?.length || content.achievements?.length) > 0 && (
                <div>
                  <h3 className="font-semibold">Certifications & Achievements</h3>
                  <ul className="list-disc list-inside">
                    {[...(content.certifications || []), ...(content.achievements || [])].map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}