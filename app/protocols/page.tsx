"use client";
import { useState, useEffect } from "react";
import { FaFileContract, FaShieldAlt, FaFingerprint } from "react-icons/fa";
import { ProtocolSection } from "@/types";

interface ProtocolsData { title: string; version: string; sections: ProtocolSection[]; }

export default function ProtocolsPage() {
  const [protocols, setProtocols] = useState<ProtocolsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => { try { const res = await fetch('/api/profile'); const data = await res.json(); if (data.success) setProtocols(data.data.protocols); } catch (err) { console.error(err); } finally { setLoading(false); } })();
  }, []);

  if (loading) return <main className="min-h-screen bg-deep-bg flex items-center justify-center"><div className="w-10 h-10 border-2 border-cerulean/30 border-t-cerulean rounded-full animate-spin" /></main>;
  if (!protocols) return <main className="min-h-screen bg-deep-bg flex items-center justify-center"><p className="text-red-400 text-sm">Failed to load protocols.</p></main>;

  return (
    <main className="min-h-screen bg-deep-bg font-sans select-none overflow-x-hidden relative pb-12 text-pearl page-top">
      <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-galaxy/30 rounded-full blur-[80px] pointer-events-none" />
      <div className="max-w-4xl mx-auto section-padding relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-pearl">{protocols.title.split(' ')[0]} <span className="text-gradient-primary">{protocols.title.split(' ').slice(1).join(' ')}</span></h1>
            <div className="flex items-center gap-2 text-xs text-pearl/40 mt-1"><FaFileContract className="text-cerulean" /><span>v{protocols.version}</span></div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-medium"><div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> Active</div>
        </div>

        <div className="glass-card p-5 md:p-8 lg:p-10 space-y-8">
          {protocols.sections.map((section, index) => (
            <section key={index} id={`s-${index}`}>
              <h2 className="text-base font-bold text-pearl mb-3 flex items-center gap-2">
                <span className="text-[10px] text-cerulean bg-cerulean/10 border border-cerulean/20 px-2 py-0.5 rounded font-mono">0{index + 1}</span>
                {section.title}
              </h2>
              <div className="text-sm text-pearl/50 leading-relaxed [&_strong]:text-pearl [&_a]:text-cerulean [&_a]:underline [&_p]:mb-2" dangerouslySetInnerHTML={{ __html: section.content }} />
            </section>
          ))}
          <div className="pt-8 mt-8 border-t border-white/[0.05] flex flex-col items-start gap-2">
            <div className="flex items-center gap-2 text-pearl font-bold text-sm"><FaFingerprint className="text-cerulean" /> Signed: Sharaf</div>
            <p className="text-[10px] text-pearl/30 font-mono">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
