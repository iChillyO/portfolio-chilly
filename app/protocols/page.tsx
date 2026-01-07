"use client";
import { useState, useEffect } from "react";
import { FaFileContract, FaShieldAlt, FaFingerprint, FaExclamationTriangle } from "react-icons/fa";
import { FaSpinner } from "react-icons/fa";
import { ProtocolSection } from "@/types";

interface ProtocolsData {
  title: string;
  version: string;
  sections: ProtocolSection[];
}

export default function ProtocolsPage() {
  const [protocols, setProtocols] = useState<ProtocolsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProtocols = async () => {
      try {
        const res = await fetch('/api/profile');
        const data = await res.json();
        if (data.success) {
          setProtocols(data.data.protocols);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProtocols();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen w-full bg-deep-bg flex items-center justify-center">
        <div className="text-cyan-400 font-mono text-xl">Loading...</div>
      </main>
    );
  }

  if (!protocols) {
    return (
      <main className="min-h-screen w-full bg-deep-bg flex items-center justify-center">
        <p className="text-red-500">Failed to load system protocols.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-deep-bg font-sans select-none flex flex-col items-center overflow-x-hidden relative pb-12 text-white">


      {/* --- HEADER --- */}
      <div className="max-w-6xl w-full relative z-20 shrink-0 px-4 md:px-12 mt-24 md:mt-32 mb-8 flex flex-col md:flex-row items-center md:items-end justify-between gap-4 text-center md:text-left">
        <div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter uppercase italic mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
            {protocols.title.split(' ')[0]} <span className="text-cyan-500">{protocols.title.split(' ').slice(1).join(' ')}</span>
          </h1>
          <div className="text-blue-200/60 tracking-widest text-[10px] md:text-xs font-mono uppercase flex items-center justify-center md:justify-start gap-2">
            <FaFileContract /> <span>Terms of Service</span>
            <span className="text-cyan-500"></span>
            <span>Version {protocols.version}</span>
          </div>
        </div>

        {/* Status Badge */}
        <div className="px-4 py-2 border border-green-500/30 bg-green-900/10 rounded-full flex items-center gap-2 text-green-400 text-[10px] md:text-xs font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(34,197,94,0.1)]">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Status: Active
        </div>
      </div>

      {/* --- DOCUMENT VIEWER CONTAINER --- */}
      <div className="w-full max-w-6xl px-4 md:px-12 pb-12 flex flex-col md:flex-row gap-8 relative z-20">

        {/* LEFT SIDEBAR (Navigation - Hidden on very small screens) */}
        <div className="hidden lg:flex flex-col gap-4 w-64 shrink-0 pt-4">
          <div className="p-6 bg-[#0a1128]/80 backdrop-blur-md border border-white/10 rounded-2xl">
            <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-4 border-b border-white/10 pb-2">
              Index
            </h3>
            <ul className="space-y-3 text-sm text-blue-200/70 font-mono">
              {protocols.sections.map((section, index) => (
                <li key={index} className="hover:text-cyan-400 cursor-pointer transition-colors flex items-center gap-2">
                  <span className="text-cyan-500">0{index + 1}.</span> {section.title}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 bg-cyan-950/20 border border-cyan-500/20 rounded-2xl">
            <FaShieldAlt className="text-2xl text-cyan-400 mb-2" />
            <p className="text-xs text-cyan-200/70 leading-relaxed">
              By engaging in these protocols, you agree to the binding logic of this contract.
            </p>
          </div>
        </div>

        {/* RIGHT CONTENT (Scrollable Document) */}
        <div className="flex-1 bg-[#0a1128]/60 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 md:p-12 relative overflow-hidden">

          {/* Decorative Top Line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-transparent opacity-50"></div>

          <div className="space-y-8 md:space-y-12 max-w-3xl mx-auto lg:mx-0">
            {protocols.sections.map((section, index) => (
              <section key={index}>
                <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="text-cyan-500 text-[10px] md:text-sm font-mono border border-cyan-500/30 px-2 py-1 rounded">0{index + 1}</span>
                  {section.title}
                </h2>
                <div className="prose prose-invert text-blue-100/90 leading-relaxed text-sm md:text-base" dangerouslySetInnerHTML={{ __html: section.content }} />
              </section>
            ))}

            {/* Footer Signature */}
            <div className="pt-12 mt-12 border-t border-white/10 flex flex-col gap-2 items-center md:items-start text-center md:text-left">
              <div className="flex items-center gap-2 text-white font-black uppercase italic text-lg md:text-xl">
                <FaFingerprint className="text-cyan-500" />
                Signed: Sharaf
              </div>
              <p className="text-[10px] md:text-xs text-gray-500 font-mono">System Protocols Updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}