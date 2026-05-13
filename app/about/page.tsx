"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { FaBriefcase, FaGraduationCap, FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import { ProfileData } from "@/types";

export default function About() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/profile');
        const contentType = res.headers.get("content-type");

        if (!res.ok || !contentType || !contentType.includes("application/json")) {
          const errorText = await res.text();
          throw new Error(`Fetch failed with status ${res.status}: ${errorText.substring(0, 100)}`);
        }

        const data = await res.json();
        if (data.success) {
          setProfile(data.data);
        } else {
          console.error("Profile API returned failure:", data.error);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen w-full bg-deep-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
          <p className="text-violet-400 font-mono text-sm tracking-widest">Loading...</p>
        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-screen w-full bg-deep-bg flex items-center justify-center">
        <div className="text-red-400 font-mono text-lg">Failed to load profile data.</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-deep-bg font-sans select-none overflow-x-hidden relative pt-28 md:pt-36 pb-16">

      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto section-padding relative z-10">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-3">Get to know me</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white mb-4">
            About <span className="text-gradient-primary">Me</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            A brief story of who I am, what drives me, and what I bring to the table.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-10 lg:gap-16">

          {/* Left Column - Photo & Quick Info */}
          <div className="flex flex-col items-center lg:items-start gap-6">

            {/* Avatar */}
            <div className="relative w-72 h-72 lg:w-full lg:h-80 rounded-2xl overflow-hidden border border-white/[0.08] shadow-xl group">
              <Image
                src={profile.aboutImage || "/images/about avatar.png"}
                alt="Profile"
                fill
                className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-deep-bg/80 via-transparent to-transparent" />
            </div>

            {/* Quick Info Card */}
            <div className="w-full glass-card p-6 space-y-4">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Quick Info</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <FaMapMarkerAlt className="text-violet-400 shrink-0" />
                  <span className="text-slate-300">Earth-616</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <FaBriefcase className="text-amber-400 shrink-0" />
                  <span className="text-slate-300">{profile.designation}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <FaCalendarAlt className="text-sky-400 shrink-0" />
                  <span className="text-slate-300">Available for work</span>
                </div>
              </div>
            </div>

            {/* Skill Bars */}
            {profile.skillStats && profile.skillStats.length > 0 && (
              <div className="w-full glass-card p-6 space-y-4">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Stats</h3>
                <div className="space-y-4">
                  {profile.skillStats.map((stat, idx) => (
                    <SkillBar key={idx} label={stat.label} percentage={stat.value} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Bio & Experience */}
          <div className="space-y-10">

            {/* Bio Section */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-[2px] bg-gradient-to-r from-violet-500 to-transparent" />
                My Story
              </h2>
              <div className="glass-card p-6 md:p-8">
                <p
                  className="text-base md:text-lg text-slate-300 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: profile.missionBriefing.replace(/\n/g, '<br />') }}
                />
              </div>
            </section>

            {/* Experience Section */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-8 h-[2px] bg-gradient-to-r from-amber-500 to-transparent" />
                Experience
              </h2>
              <div className="space-y-4">
                {profile.experienceLog.map((exp, index) => (
                  <ExperienceCard
                    key={index}
                    title={exp.title}
                    type={exp.type}
                    desc={exp.desc}
                    index={index}
                  />
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

// --- HELPER COMPONENTS ---

const SkillBar = ({ label, percentage }: { label: string; percentage: string }) => {
  const numericValue = parseInt(percentage) || 0;
  const clampedValue = Math.min(numericValue, 100);

  return (
    <div className="w-full">
      <div className="flex justify-between mb-1.5 text-xs">
        <span className="text-slate-300 font-medium">{label}</span>
        <span className="text-violet-400 font-mono">{percentage}</span>
      </div>
      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-violet-600 to-violet-400 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
};

const ExperienceCard = ({ title, type, desc, index }: { title: string; type: string; desc: string; index: number }) => (
  <div className="group glass-card-hover p-5 md:p-6">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
      <h4 className="text-white font-bold text-base group-hover:text-violet-400 transition-colors">{title}</h4>
      <span className="text-xs font-medium text-violet-400 bg-violet-500/10 border border-violet-500/20 px-3 py-1 rounded-full w-fit">
        {type}
      </span>
    </div>
    <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
  </div>
);
