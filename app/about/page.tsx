"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { FaServer, FaTerminal } from "react-icons/fa";
import { ProfileData, ExperienceCard } from "@/types";

export default function About() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/profile');
        const data = await res.json();
        if (data.success) {
          setProfile(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <main className="h-screen w-full bg-deep-bg flex items-center justify-center">
        <div className="text-cyan-400 font-mono text-xl">Loading...</div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="h-screen w-full bg-deep-bg flex items-center justify-center">
        <div className="text-red-500 font-mono text-xl">Failed to load profile data.</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-deep-bg flex items-center justify-center p-4 md:p-8 font-sans select-none overflow-x-hidden relative pt-24 pb-12">


      {/* MAIN DATA CARD */}
      <div className="relative w-full max-w-6xl min-h-[85vh] md:h-[85vh] bg-[#0a1128]/80 backdrop-blur-xl border border-cyan-500/30 rounded-[20px] md:rounded-[30px] shadow-[0_0_50px_rgba(34,211,238,0.15)] overflow-hidden flex flex-col md:flex-row z-20 mt-12 md:mt-0">

        {/* Decorative Header Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>

        {/* --- LEFT COLUMN: ID CARD / STATS --- */}
        <div className="w-full md:w-[35%] bg-black/20 border-b md:border-b-0 md:border-r border-cyan-500/20 p-6 md:p-8 flex flex-col relative">

          {/* Avatar Box */}
          <div className="relative w-full aspect-square mb-6 rounded-2xl overflow-hidden border-2 border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.2)] group">
            <div className="absolute inset-0 bg-cyan-500/10 mix-blend-overlay z-10"></div>
            {/* Scanline Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(transparent_2px,#000_3px)] bg-[length:100%_4px] opacity-20 pointer-events-none z-20"></div>

            <Image
              src={profile.aboutImage || "/images/lucial-avatar1.png"}
              alt="Profile"
              fill
              className="object-cover object-top transition-transform duration-500 group-hover:scale-110"
            />
          </div>

          {/* ID Info */}
          <div className="space-y-1 mb-6 md:mb-8 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter italic">
              {profile.alias}
            </h2>
            <div className="flex items-center justify-center md:justify-start gap-2 text-cyan-400 font-mono text-[10px] md:text-sm">
              <span className="animate-pulse">●</span>
              <span>{profile.designation}</span>
            </div>
          </div>

          {/* Stats Bars (RPG Style) */}
          <div className="space-y-4 font-mono text-[10px] md:text-xs tracking-widest text-blue-200">
            {profile.skillStats && profile.skillStats.length > 0 ? (
              profile.skillStats.map((stat, idx) => (
                <StatBar key={idx} label={stat.label} percentage={stat.value} color={stat.color} />
              ))
            ) : (
              <>
                <StatBar label="Frontend" percentage="95%" color="bg-blue-500" />
                <StatBar label="Backend" percentage="85%" color="bg-indigo-500" />
                <StatBar label="Creativity" percentage="100%" color="bg-pink-500" />
                <StatBar label="Caffeine" percentage="110%" color="bg-yellow-400" />
              </>
            )}
          </div>

          {/* Bottom Details */}
          <div className="mt-8 md:mt-auto pt-4 md:pt-8 flex justify-center md:justify-start gap-4 text-[8px] md:text-xs text-gray-500 font-mono uppercase">
            <div>ID: 8492-XJ</div>
            <div>LOC: EARTH-616</div>
          </div>
        </div>

        {/* --- RIGHT COLUMN: BIO & TIMELINE --- */}
        <div className="flex-1 p-6 md:p-12 overflow-y-auto custom-scrollbar">

          {/* Section Title */}
          <div className="flex items-center gap-4 mb-6 md:mb-8">
            <FaTerminal className="text-2xl md:text-3xl text-cyan-500" />
            <h1 className="text-xl md:text-3xl font-bold text-white tracking-widest uppercase">
              Mission Briefing
            </h1>
          </div>

          {/* Bio Text */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6 mb-8 md:mb-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>
            <p className="text-base md:text-lg text-blue-100/90 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: profile.missionBriefing.replace(/\n/g, '<br />') }}
            >
            </p>
          </div>

          {/* Experience Grid */}
          <h3 className="text-lg md:text-xl text-cyan-400 font-bold mb-6 tracking-widest uppercase flex items-center gap-2">
            <FaServer /> Experience Log
          </h3>

          <div className="grid grid-cols-1 gap-4">
            {profile.experienceLog.map((exp, index) => (
              <ExpCard
                key={index}
                role={exp.title}
                company={exp.type}
                desc={exp.desc}
              />
            ))}
          </div>

        </div>

      </div>
    </main>
  );
}

// --- HELPER COMPONENTS ---

// 1. Stat Bar Component
const StatBar = ({ label, percentage, color }: { label: string, percentage: string, color: string }) => {
  // Derive the text color class from the bg class for the shadow glow (e.g. bg-red-500 -> text-red-500)
  const textClass = color.replace("bg-", "text-");

  return (
    <div className="w-full">
      <div className="flex justify-between mb-1">
        <span>{label}</span>
        <span>{percentage}</span>
      </div>
      <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
        <div className={`h-full ${color} ${textClass} shadow-[0_0_10px_currentColor]`} style={{ width: percentage }}></div>
      </div>
    </div>
  );
};

// 2. Experience Card Component
const ExpCard = ({ role, company, desc }: { role: string, company: string, desc: string }) => (
  <div className="group relative p-4 bg-black/20 hover:bg-cyan-900/10 border border-white/5 hover:border-cyan-500/30 rounded-xl transition-all duration-300">
    <div className="flex justify-between items-start mb-1">
      <h4 className="text-white font-bold text-lg group-hover:text-cyan-400 transition-colors">{role}</h4>
      <span className="text-xs font-mono text-cyan-500/70 border border-cyan-500/20 px-2 py-1 rounded bg-cyan-950/30">{company}</span>
    </div>
    <p className="text-sm text-gray-400">{desc}</p>
  </div>
);