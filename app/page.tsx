"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaDiscord, FaTwitter, FaGoogle, FaInstagram, FaGithub, FaLinkedin, FaYoutube, FaTwitch, FaExternalLinkAlt, FaArrowRight, FaArrowDown } from "react-icons/fa";
import { ProfileData } from "@/types";

export default function Home() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/profile');
        const contentType = res.headers.get("content-type");
        if (!res.ok || !contentType || !contentType.includes("application/json")) {
          throw new Error("Fetch failed");
        }
        const data = await res.json();
        if (data.success) setProfile(data.data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "auto";
      document.body.style.overflow = "auto";
    };
  }, []);

  const getIcon = (p: string) => {
    const lower = p.toLowerCase();
    if (lower.includes("discord")) return <FaDiscord size={16} />;
    if (lower.includes("twitter") || lower.includes("x")) return <FaTwitter size={16} />;
    if (lower.includes("instagram")) return <FaInstagram size={16} />;
    if (lower.includes("google") || lower.includes("mail")) return <FaGoogle size={14} />;
    if (lower.includes("github")) return <FaGithub size={16} />;
    if (lower.includes("linkedin")) return <FaLinkedin size={16} />;
    if (lower.includes("youtube")) return <FaYoutube size={16} />;
    if (lower.includes("twitch")) return <FaTwitch size={16} />;
    return <FaExternalLinkAlt size={14} />;
  };

  if (loading) {
    return (
      <main className="h-[100dvh] w-full bg-deep-bg flex items-center justify-center" suppressHydrationWarning={true}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
          <p className="text-violet-400 font-mono text-sm tracking-widest uppercase">Initializing...</p>
        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="h-[100dvh] w-full bg-deep-bg flex items-center justify-center">
        <div className="text-red-400 font-mono text-lg">Failed to load profile data.</div>
      </main>
    );
  }

  return (
    <main className="h-[100dvh] w-full bg-deep-bg overflow-hidden relative font-sans select-none" suppressHydrationWarning={true}>

      {/* === BACKGROUND LAYERS === */}
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(rgba(139,92,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.3) 1px, transparent 1px)', backgroundSize: '60px 60px' }}
      />
      {/* Gradient blobs */}
      <div className="absolute top-[-20%] right-[-10%] w-[700px] h-[700px] bg-violet-600/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/6 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[30%] left-[50%] w-[300px] h-[300px] bg-amber-500/4 rounded-full blur-[80px] pointer-events-none" />

      {/* === MAIN CONTENT === */}
      <div className="relative z-10 h-full flex flex-col">

        {/* Center content */}
        <div className="flex-1 flex items-center justify-center px-6 md:px-12 lg:px-20">
          <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* === LEFT SIDE: TEXT === */}
            <div className="space-y-8 text-center lg:text-left">

              {/* Availability pill */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] opacity-0 animate-reveal" style={{ animationDelay: '0.1s' }}>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400" />
                </span>
                <span className="text-xs text-slate-300 font-medium">{profile.statusMsg || "Available for work"}</span>
              </div>

              {/* Name & title */}
              <div className="space-y-3 opacity-0 animate-reveal" style={{ animationDelay: '0.3s' }}>
                <h1 className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-black tracking-tight leading-[0.95]">
                  <span className="text-white">{profile.alias.split(' ')[0]}</span>
                  {profile.alias.split(' ').length > 1 && (
                    <>
                      <br />
                      <span className="text-gradient-primary">{profile.alias.split(' ').slice(1).join(' ')}</span>
                    </>
                  )}
                  {profile.alias.split(' ').length === 1 && (
                    <span className="text-gradient-primary">.</span>
                  )}
                </h1>
                <p className="text-lg md:text-xl text-slate-400 font-light">{profile.designation}</p>
              </div>

              {/* Bio */}
              <p className="text-sm md:text-base text-slate-500 leading-relaxed max-w-lg mx-auto lg:mx-0 opacity-0 animate-reveal" style={{ animationDelay: '0.5s' }}>
                {profile.bioLong}
              </p>

              {/* CTA row */}
              <div className="flex flex-wrap items-center gap-4 justify-center lg:justify-start opacity-0 animate-reveal" style={{ animationDelay: '0.7s' }}>
                <Link
                  href="/projects"
                  className="group inline-flex items-center gap-2.5 px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-lg transition-all duration-300 shadow-lg shadow-violet-600/25 hover:shadow-violet-500/40 hover:-translate-y-0.5"
                >
                  View Projects
                  <FaArrowRight className="text-xs group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2.5 px-6 py-3 text-sm font-semibold text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.15] rounded-lg transition-all duration-300 hover:-translate-y-0.5"
                >
                  Learn More
                </Link>
              </div>

              {/* Social row */}
              <div className="flex items-center gap-2 justify-center lg:justify-start opacity-0 animate-reveal" style={{ animationDelay: '0.9s' }}>
                {profile.socialLinks && profile.socialLinks.length > 0 ? (
                  profile.socialLinks.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:text-violet-400 hover:bg-violet-500/10 transition-all duration-200"
                    >
                      {getIcon(link.platform)}
                    </a>
                  ))
                ) : (
                  <span className="text-xs text-slate-600">No links configured.</span>
                )}
              </div>
            </div>

            {/* === RIGHT SIDE: VISUAL === */}
            <div className="hidden lg:flex items-center justify-center relative opacity-0 animate-reveal" style={{ animationDelay: '0.4s' }}>
              {/* Outer glow ring */}
              <div className="absolute w-[480px] h-[480px] rounded-full bg-gradient-to-br from-violet-500/10 via-transparent to-indigo-500/5 blur-sm" />

              {/* Main card/bento */}
              <div className="relative w-[400px] h-[500px] rounded-3xl overflow-hidden border border-white/[0.08] bg-gradient-to-b from-slate-900/80 to-slate-950/90 backdrop-blur-sm shadow-2xl">
                {/* Image */}
                <div className="absolute inset-0">
                  <Image
                    src={profile.avatar || "/images/home avatar.png"}
                    alt="Avatar"
                    fill
                    className="object-cover object-top"
                    priority
                  />
                  {/* Gradient fade */}
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-bg via-deep-bg/40 to-transparent" />
                </div>

                {/* Bottom overlay info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-violet-500 rounded-full" />
                    <span className="text-xs text-slate-400 font-medium">{profile.designation}</span>
                  </div>

                  {/* Mini stat badges */}
                  <div className="flex flex-wrap gap-2">
                    {(profile.skillStats || []).slice(0, 3).map((stat, idx) => (
                      <div key={idx} className="px-3 py-1.5 rounded-md bg-white/[0.05] border border-white/[0.06] text-[10px] text-slate-300 font-medium">
                        {stat.label} <span className="text-violet-400 ml-1">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Decorative corner accents */}
                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-violet-500/30 rounded-tr-lg" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-violet-500/30 rounded-bl-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* === BOTTOM BAR === */}
        <div className="shrink-0 pb-6 flex items-center justify-between px-6 md:px-12 lg:px-20 opacity-0 animate-reveal" style={{ animationDelay: '1.2s' }}>
          <div className="text-[10px] md:text-xs text-slate-600 font-mono tracking-wider">
            &copy; {new Date().getFullYear()} Sharaf Systems
          </div>
          <div className="flex items-center gap-2 text-[10px] md:text-xs text-slate-600">
            <span className="hidden sm:inline">Scroll to explore</span>
            <FaArrowDown className="text-violet-500/50 animate-bounce" />
          </div>
        </div>
      </div>
    </main>
  );
}
