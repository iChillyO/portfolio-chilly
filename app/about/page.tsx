"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  FaBriefcase, FaMapMarkerAlt, FaCalendarAlt, FaEnvelope, FaPhone, FaGlobe,
  FaUser, FaBirthdayCake, FaGraduationCap, FaLanguage, FaCode, FaHeart,
  FaStar, FaShieldAlt, FaRocket, FaClock, FaLink, FaUniversity
} from "react-icons/fa";
import { ProfileData } from "@/types";

// Icon map for the Quick Info box (must match dashboard editor options)
const quickInfoIconMap: Record<string, React.ReactNode> = {
  FaMapMarkerAlt: <FaMapMarkerAlt size={11} />, FaBriefcase: <FaBriefcase size={11} />,
  FaCalendarAlt: <FaCalendarAlt size={11} />, FaEnvelope: <FaEnvelope size={11} />,
  FaPhone: <FaPhone size={11} />, FaGlobe: <FaGlobe size={11} />,
  FaUser: <FaUser size={11} />, FaBirthdayCake: <FaBirthdayCake size={11} />,
  FaGraduationCap: <FaGraduationCap size={11} />, FaLanguage: <FaLanguage size={11} />,
  FaCode: <FaCode size={11} />, FaHeart: <FaHeart size={11} />,
  FaStar: <FaStar size={11} />, FaShieldAlt: <FaShieldAlt size={11} />,
  FaRocket: <FaRocket size={11} />, FaClock: <FaClock size={11} />,
  FaLink: <FaLink size={11} />, FaUniversity: <FaUniversity size={11} />,
};

const getQuickIcon = (name: string): React.ReactNode =>
  quickInfoIconMap[name] || <FaMapMarkerAlt size={11} />;

export default function About() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/profile');
        const contentType = res.headers.get("content-type");
        if (!res.ok || !contentType || !contentType.includes("application/json")) throw new Error("Fetch failed");
        const data = await res.json();
        if (data.success) setProfile(data.data);
      } catch (error) { console.error("Failed to fetch profile:", error); }
      finally { setLoading(false); }
    }
    fetchProfile();
  }, []);

  if (loading) return <main className="min-h-screen bg-deep-bg flex items-center justify-center"><div className="w-10 h-10 border-2 border-cerulean/30 border-t-cerulean rounded-full animate-spin" /></main>;
  if (!profile) return <main className="min-h-screen bg-deep-bg flex items-center justify-center"><div className="text-red-400 text-sm">Failed to load profile.</div></main>;

  // Default Quick Info if user hasn't configured any yet
  const defaultQuickInfo = [
    { icon: "FaMapMarkerAlt", iconColor: "text-cerulean", text: "Earth-616", order: 0 },
    { icon: "FaBriefcase", iconColor: "text-gold", text: profile.designation, order: 1 },
    { icon: "FaCalendarAlt", iconColor: "text-lilac", text: "Available for work", order: 2 },
  ];
  const quickInfoItems = (profile.quickInfo && profile.quickInfo.length > 0)
    ? [...profile.quickInfo].sort((a, b) => (a.order || 0) - (b.order || 0))
    : defaultQuickInfo;

  return (
    <main className="min-h-screen bg-deep-bg font-sans select-none overflow-x-hidden relative page-top pb-12">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-galaxy/30 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto section-padding relative z-10">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-pearl">
            About <span className="text-gradient-primary">Me</span>
          </h1>
          <p className="text-pearl/40 text-xs mt-1.5 max-w-sm mx-auto">A brief story of who I am and what I bring to the table.</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 lg:gap-12">
          {/* Left */}
          <div className="flex flex-col items-center lg:items-start gap-5">
            <div className="relative w-60 h-60 lg:w-full lg:h-72 rounded-xl overflow-hidden border border-white/[0.06] group">
              <Image src={profile.aboutImage || "/images/about avatar.png"} alt="Profile" fill className="object-cover object-top group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-deep-bg/70 via-transparent to-transparent" />
            </div>

            <div className="w-full glass-card p-4 space-y-3">
              <h3 className="text-[10px] font-medium text-pearl/40 uppercase tracking-widest">Quick Info</h3>
              <div className="space-y-2.5">
                {quickInfoItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs">
                    <span className={`shrink-0 ${item.iconColor || "text-cerulean"}`}>{getQuickIcon(item.icon)}</span>
                    <span className="text-pearl/70">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {profile.skillStats && profile.skillStats.length > 0 && (
              <div className="w-full glass-card p-4 space-y-3">
                <h3 className="text-[10px] font-medium text-pearl/40 uppercase tracking-widest">Stats</h3>
                <div className="space-y-3">
                  {profile.skillStats.map((stat, idx) => (
                    <div key={idx} className="w-full">
                      <div className="flex justify-between mb-1 text-[11px]">
                        <span className="text-pearl/60">{stat.label}</span>
                        <span className="text-cerulean font-mono">{stat.value}</span>
                      </div>
                      <div className="w-full h-1 bg-white/[0.05] rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-cerulean to-lilac rounded-full" style={{ width: `${Math.min(parseInt(stat.value) || 0, 100)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right */}
          <div className="space-y-8">
            <section>
              <h2 className="text-lg font-bold text-pearl mb-3 flex items-center gap-2">
                <span className="w-6 h-[2px] bg-gradient-to-r from-cerulean to-transparent" /> My Story
              </h2>
              <div className="glass-card p-5">
                <p className="text-sm text-pearl/60 leading-relaxed" dangerouslySetInnerHTML={{ __html: profile.missionBriefing.replace(/\n/g, '<br />') }} />
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-pearl mb-4 flex items-center gap-2">
                <span className="w-6 h-[2px] bg-gradient-to-r from-gold to-transparent" /> Experience
              </h2>
              <div className="space-y-3">
                {profile.experienceLog.map((exp, index) => (
                  <div key={index} className="glass-card-hover p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 mb-1.5">
                      <h4 className="text-pearl font-semibold text-sm">{exp.title}</h4>
                      <span className="text-[10px] font-medium text-cerulean bg-cerulean/10 border border-cerulean/20 px-2 py-0.5 rounded-full w-fit">{exp.type}</span>
                    </div>
                    <p className="text-xs text-pearl/40 leading-relaxed">{exp.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
