"use client";
import { useState, useEffect } from "react";
import { FaFileContract, FaShieldAlt, FaFingerprint } from "react-icons/fa";
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
        <div className="w-12 h-12 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
      </main>
    );
  }

  if (!protocols) {
    return (
      <main className="min-h-screen w-full bg-deep-bg flex items-center justify-center">
        <p className="text-red-400">Failed to load protocols.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-deep-bg font-sans select-none overflow-x-hidden relative pb-16 text-white pt-28 md:pt-36">

      {/* Background */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto section-padding relative z-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-3">Legal</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white mb-3">
              {protocols.title.split(' ')[0]}{' '}
              <span className="text-gradient-primary">{protocols.title.split(' ').slice(1).join(' ')}</span>
            </h1>
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <FaFileContract className="text-violet-400" />
              <span>Terms of Service</span>
              <span className="text-slate-600">&bull;</span>
              <span>Version {protocols.version}</span>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Active
          </div>
        </div>

        {/* Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar - Table of Contents */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-28 space-y-4">
              <div className="glass-card p-6">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">Contents</h3>
                <ul className="space-y-2.5">
                  {protocols.sections.map((section, index) => (
                    <li key={index}>
                      <a href={`#section-${index}`} className="flex items-center gap-2 text-sm text-slate-400 hover:text-violet-400 transition-colors">
                        <span className="text-violet-500/70 text-xs font-mono">0{index + 1}</span>
                        <span className="truncate">{section.title}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass-card p-5 border-l-2 border-l-violet-500/30">
                <FaShieldAlt className="text-xl text-violet-400 mb-2" />
                <p className="text-xs text-slate-400 leading-relaxed">
                  By engaging services, you agree to these terms and conditions.
                </p>
              </div>
            </div>
          </aside>

          {/* Main Document */}
          <div className="flex-1 glass-card p-6 md:p-10 lg:p-12">
            {/* Top gradient line */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-violet-500/40 via-amber-500/20 to-transparent" />

            <div className="space-y-10 max-w-3xl">
              {protocols.sections.map((section, index) => (
                <section key={index} id={`section-${index}`} className="scroll-mt-32">
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-3">
                    <span className="text-xs font-mono text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-1 rounded">
                      0{index + 1}
                    </span>
                    {section.title}
                  </h2>
                  <div
                    className="text-slate-300 leading-relaxed text-sm md:text-base [&_strong]:text-white [&_a]:text-violet-400 [&_a]:underline [&_p]:mb-3"
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />
                </section>
              ))}

              {/* Signature */}
              <div className="pt-10 mt-10 border-t border-white/[0.06] flex flex-col items-start gap-3">
                <div className="flex items-center gap-2 text-white font-bold text-lg">
                  <FaFingerprint className="text-violet-400" />
                  Signed: Sharaf
                </div>
                <p className="text-xs text-slate-600 font-mono">
                  Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
