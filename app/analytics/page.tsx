"use client";

import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Components } from "react-markdown";

const api = axios.create({ baseURL: "/api" });
const MAX_FILE_SIZE_MB = 10;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"];

// ─── Section config ───────────────────────────────────────────────────
const SECTIONS: Record<string, { icon: string; accent: string; label: string; desc: string }> = {
  "clinical summary":        { icon: "🏥", accent: "#2563eb", label: "Clinical Summary",        desc: "30-second handover" },
  "patient profile":         { icon: "👤", accent: "#0891b2", label: "Patient Profile",         desc: "Demographics & referral" },
  "investigations performed":{ icon: "🔬", accent: "#7c3aed", label: "Investigations",          desc: "Tests ordered" },
  "findings & values":       { icon: "📊", accent: "#059669", label: "Findings & Values",       desc: "All test results" },
  "critical & abnormal":     { icon: "🚨", accent: "#dc2626", label: "Critical Findings",       desc: "Requires immediate attention" },
  "diagnosis":               { icon: "🩺", accent: "#be185d", label: "Diagnosis",               desc: "Clinical impression" },
  "current medications":     { icon: "💊", accent: "#0d9488", label: "Medications",             desc: "Prescribed drugs" },
  "immediate action":        { icon: "⚡", accent: "#ea580c", label: "Immediate Action",        desc: "What to do right now" },
  "treatment considerations":{ icon: "📋", accent: "#4f46e5", label: "Treatment Plan",          desc: "Clinical recommendations" },
  "follow-up":               { icon: "🔁", accent: "#65a30d", label: "Follow-up Plan",          desc: "Monitoring & review" },
};

function getSection(heading: string) {
  const h = heading.toLowerCase();
  for (const [key, val] of Object.entries(SECTIONS)) {
    if (h.includes(key)) return val;
  }
  return { icon: "📄", accent: "#6b7280", label: heading, desc: "" };
}

// ─── Custom Markdown Components ───────────────────────────────────────
const MD: Components = {
  h2({ children }) {
    const text = String(children).replace(/^[^\w]+/, "").trim();
    const sec = getSection(text);
    return (
      <div style={{ borderLeft: `4px solid ${sec.accent}` }}
        className="mt-10 mb-3 pl-4 flex items-center gap-3">
        <span className="text-2xl leading-none">{sec.icon}</span>
        <div>
          <div className="text-base font-bold text-gray-900 tracking-tight leading-tight">
            {sec.label}
          </div>
          {sec.desc && (
            <div className="text-xs font-medium mt-0.5" style={{ color: sec.accent }}>
              {sec.desc}
            </div>
          )}
        </div>
      </div>
    );
  },

  h3({ children }) {
    return (
      <h3 className="text-sm font-bold text-gray-800 mt-5 mb-2 uppercase tracking-widest">
        {children}
      </h3>
    );
  },

  p({ children }) {
    const text = String(children);

    // Clinical Summary intro → blue alert box
    if (
      text.toLowerCase().startsWith("write 2") ||
      text.match(/^(this patient|patient is|the patient)/i)
    ) return null;

    // Disclaimer
    if (text.toLowerCase().includes("ai-generated clinical")) {
      return (
        <p className="mt-8 text-xs text-gray-400 italic border-t border-dashed border-gray-200 pt-4">
          {children}
        </p>
      );
    }

    return <p className="text-sm text-gray-700 leading-7 mb-2">{children}</p>;
  },

  ul({ children }) {
    return <ul className="my-3 space-y-2 pl-1">{children}</ul>;
  },

  li({ children }) {
    const text = String(children);
    const isUrgent = text.toLowerCase().includes("urgent") || text.toLowerCase().includes("immediate");
    return (
      <li className="flex items-start gap-2.5 text-sm leading-6">
        <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${isUrgent ? "bg-red-500" : "bg-blue-400"}`} />
        <span className="text-gray-700">{children}</span>
      </li>
    );
  },

  strong({ children }) {
    const text = String(children);
    if (text.toLowerCase().includes("urgent") || text.toLowerCase().includes("critical")) {
      return <strong className="font-bold text-red-600">{children}</strong>;
    }
    return <strong className="font-semibold text-gray-900">{children}</strong>;
  },

  blockquote({ children }) {
    return (
      <blockquote className="my-4 pl-4 border-l-4 border-amber-400 bg-amber-50 py-3 pr-4 rounded-r-xl text-sm text-amber-800 italic">
        {children}
      </blockquote>
    );
  },

  hr() {
    return <div className="my-7 border-t border-dashed border-gray-200" />;
  },

  table({ children }) {
    return (
      <div className="my-4 rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-sm">{children}</table>
      </div>
    );
  },
  thead({ children }) {
    return <thead className="bg-gray-900 text-gray-100 text-xs uppercase tracking-wide">{children}</thead>;
  },
  tbody({ children }) {
    return <tbody className="divide-y divide-gray-100 bg-white">{children}</tbody>;
  },
  tr({ children }) {
    return <tr className="hover:bg-gray-50 transition-colors duration-100">{children}</tr>;
  },
  th({ children }) {
    return <th className="px-4 py-2.5 font-semibold text-left">{children}</th>;
  },
  td({ children }) {
    const text = String(children);
    const isRed = text.includes("🔴") || text.toLowerCase().includes("critical") || text.toLowerCase().includes("high");
    const isYellow = text.includes("🟡") || text.toLowerCase().includes("borderline");
    return (
      <td className={`px-4 py-2.5 text-sm font-medium
        ${isRed ? "text-red-700" : isYellow ? "text-amber-600" : "text-gray-700"}`}>
        {children}
      </td>
    );
  },
};

// ─── Page ─────────────────────────────────────────────────────────────
export default function AnalyticsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFile = (f?: File) => {
    setResult(null); setFileError(null);
    if (!f) return;
    if (!ACCEPTED_TYPES.includes(f.type)) { setFileError("Unsupported type. Upload JPG, PNG, WebP, GIF, or PDF."); return; }
    if (f.size > MAX_FILE_SIZE_MB * 1024 * 1024) { setFileError(`File too large. Max ${MAX_FILE_SIZE_MB} MB.`); return; }
    setFile(f);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true); setResult(null);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await api.post("/analytics", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setResult(res.data.summary);
    } catch (err) {
      const msg = axios.isAxiosError(err) ? err.response?.data?.error ?? "Server error." : "Unexpected error.";
      setResult(`**Error:** ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-5">

        {/* ── Header ── */}
        <div className="flex items-center gap-4 py-4">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-xl shadow-lg shadow-blue-900/50">
            🏥
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">
              Clinical Report Analyser
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              AI-assisted summary for treating physicians · Fast triage support
            </p>
          </div>
          <div className="ml-auto text-xs bg-blue-900/50 text-blue-300 border border-blue-800 px-3 py-1.5 rounded-full font-medium">
            GPT-4o Vision
          </div>
        </div>

        {/* ── Upload Panel ── */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
            Upload Patient Report
          </p>

          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragOver(false); handleFile(e.dataTransfer.files[0]); }}
            onClick={() => document.getElementById("file-input")?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
              ${isDragOver ? "border-blue-500 bg-blue-950/40" : "border-gray-700 hover:border-blue-600 hover:bg-gray-800/50"}`}
          >
            <input id="file-input" type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])} />

            <div className="text-3xl mb-3">{file ? "📎" : "☁️"}</div>
            {file
              ? <p className="text-blue-400 font-semibold text-sm">{file.name}</p>
              : <>
                  <p className="text-gray-300 text-sm font-medium">Drop report here or <span className="text-blue-400 underline">browse</span></p>
                  <p className="text-gray-500 text-xs mt-1">JPG · PNG · PDF · Max {MAX_FILE_SIZE_MB} MB</p>
                </>
            }
          </div>

          {fileError && <p className="mt-2 text-xs text-red-400 font-medium">{fileError}</p>}

          <div className="flex gap-3 mt-5">
            <button onClick={handleUpload} disabled={!file || loading}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-200
                ${!file || loading
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/50 active:scale-95"}`}>
              {loading
                ? <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Generating Clinical Summary...
                  </span>
                : "⚡ Generate Clinical Summary"
              }
            </button>
            {(file || result) && !loading && (
              <button onClick={() => { setFile(null); setResult(null); setFileError(null); }}
                className="px-5 py-3 rounded-xl text-sm font-semibold bg-gray-800 hover:bg-gray-700 text-gray-300 transition-all">
                Clear
              </button>
            )}
          </div>
        </div>

        {/* ── Clinical Report Output ── */}
        {result && (
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">

            {/* Top bar */}
            <div className="bg-gray-900 px-7 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-lg">📋</span>
                <div>
                  <p className="text-white font-bold text-sm">Clinical Report Summary</p>
                  <p className="text-gray-400 text-xs mt-0.5">For physician use · {file?.name}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {["🏥", "⚠️", "💊", "⚡"].map((icon, i) => (
                  <span key={i} className="w-7 h-7 bg-gray-800 rounded-lg flex items-center justify-center text-sm border border-gray-700">
                    {icon}
                  </span>
                ))}
              </div>
            </div>

            {/* Section index */}
            <div className="px-7 py-4 bg-gray-50 border-b border-gray-100 flex flex-wrap gap-2">
              <p className="w-full text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
                Sections
              </p>
              {Object.values(SECTIONS).map((sec) => (
                <span key={sec.label}
                  style={{ borderColor: sec.accent + "40", color: sec.accent, backgroundColor: sec.accent + "10" }}
                  className="text-xs px-3 py-1 rounded-full font-semibold border">
                  {sec.icon} {sec.label}
                </span>
              ))}
            </div>

            {/* Report content */}
            <div className="px-7 py-6">
              <ReactMarkdown components={MD}>{result}</ReactMarkdown>
            </div>

            {/* Footer */}
            <div className="px-7 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <p className="text-xs text-gray-400">
                ⚠️ Verify all values against original report before initiating treatment
              </p>
              <button onClick={() => window.print()}
                className="text-xs text-blue-600 hover:underline font-medium">
                🖨️ Print Summary
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}