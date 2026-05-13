"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaDiscord, FaTwitter, FaGoogle, FaInstagram, FaGithub, FaLinkedin, FaYoutube, FaTwitch, FaExternalLinkAlt, FaArrowRight, FaCode, FaPalette, FaRocket } from "react-icons/fa";
import { ProfileData } from "@/types";

// --- ANIMATED TEXT COMPONENT ---
const RevealText = ({
  text,
  className,
  delay = 0,
  speed = 0.08
}: {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
}) => {
  return (
    <span className={`inline-block ${className}`}>
      {text.split("").map((char, index) => (
        <span
          key={index}
          className="opacity-0 animate-reveal inline-block"
          style={{
            animationDelay: `${delay + index * speed}s`,
            minWidth: char === " " ? "0.3em" : "auto"
          }}
        >
          {char}
        </span>
      ))}
    </span>
  );
};

// --- FLOATING ORB DECORATION ---
const FloatingOrb = ({ className }: { className?: string }) => (
  <div className={`absolute rounded-full blur-3xl pointer-events-none ${className}`} />
);

// --- MAIN COMPONENT ---
export default function Home() {
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

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = "auto";
      document.body.style.overflow = "auto";
    };
  }, []);

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

  const getIcon = (p: string) => {
    const lower = p.toLowerCase();
    if (lower.includes("discord")) return <FaDiscord size={18} />;
    if (lower.includes("twitter") || lower.includes("x")) return <FaTwitter size={18} />;
    if (lower.includes("instagram")) return <FaInstagram size={18} />;
    if (lower.includes("google") || lower.includes("mail")) return <FaGoogle size={16} />;
    if (lower.includes("github")) return <FaGithub size={18} />;
    if (lower.includes("linkedin")) return <FaLinkedin size={18} />;
    if (lower.includes("youtube")) return <FaYoutube size={18} />;
    if (lower.includes("twitch")) return <FaTwitch size={18} />;
    return <FaExternalLinkAlt size={16} />;
  };

  return (
    <main className="h-[100dvh] w-full bg-deep-bg flex items-center justify-center overflow-hidden relative font-sans select-none" suppressHydrationWarning={true}>

      {/* --- BACKGROUND DECORATIONS --- */}
      <FloatingOrb className="w-[600px] h-[600px] bg-violet-600/10 top-[-200px] right-[-200px] animate-float" />
      <FloatingOrb className="w-[400px] h-[400px] bg-amber-500/5 bottom-[-100px] left-[-100px] animate-float-delayed" />
      <FloatingOrb className="w-[300px] h-[300px] bg-sky-500/5 top-[40%] left-[20%] animate-float" />

      {/* Dot Pattern Background */}
      <div className="absolute inset-0 bg-dot-pattern bg-dot-md opacity-30 pointer-events-none" />

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-violet-950/20 via-transparent to-transparent pointer-events-none" />

      {/* --- MAIN LAYOUT --- */}
      <div className="relative w-full max-w-7xl h-full flex items-center z-20 px-6 md:px-12 lg:px-16">

        <div className="w-full grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 lg:gap-16 items-center">

          {/* --- LEFT: CONTENT --- */}
          <div className="relative z-10 flex flex-col justify-center">

            {/* Status Badge */}
            <div className="opacity-0 animate-reveal mb-6" style={{ animationDelay: '0.2s' }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs font-medium text-violet-300 tracking-wide">
                  {profile.statusMsg || "Available for work"}
                </span>
              </div>
            </div>

            {/* Main Heading */}
            <div className="space-y-2 mb-6">
              <h2 className="text-sm md:text-base font-medium text-slate-400 tracking-wide opacity-0 animate-reveal" style={{ animationDelay: '0.4s' }}>
                Hey, I&apos;m
              </h2>
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05]">
                <span className="text-gradient-primary opacity-0 animate-reveal" style={{ animationDelay: '0.6s' }}>
                  {profile.alias}
                </span>
              </h1>
              <h3 className="text-xl md:text-2xl lg:text-3xl font-light text-slate-300 tracking-wide opacity-0 animate-reveal" style={{ animationDelay: '0.9s' }}>
                {profile.designation}
              </h3>
            </div>

            {/* Bio */}
            <p className="text-base md:text-lg text-slate-400 leading-relaxed max-w-xl mb-8 opacity-0 animate-reveal" style={{ animationDelay: '1.1s' }}>
              {profile.bioLong}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-10 opacity-0 animate-reveal" style={{ animationDelay: '1.3s' }}>
              <Link
                href="/projects"
                className="group inline-flex items-center gap-3 px-7 py-3.5 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 hover:-translate-y-0.5"
              >
                View My Work
                <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-3 px-7 py-3.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-semibold rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-0.5"
              >
                About Me
              </Link>
            </div>

            {/* Social Links */}
            <div className="opacity-0 animate-reveal" style={{ animationDelay: '1.5s' }}>
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-3 font-medium">Connect</p>
              <div className="flex items-center gap-2">
                {profile.socialLinks && profile.socialLinks.length > 0 ? (
                  profile.socialLinks.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-violet-400 hover:border-violet-500/30 hover:bg-violet-500/10 transition-all duration-300 hover:-translate-y-1"
                    >
                      {getIcon(link.platform)}
                    </a>
                  ))
                ) : (
                  <span className="text-xs text-slate-600">No links configured.</span>
                )}
              </div>
            </div>
          </div>

          {/* --- RIGHT: AVATAR / VISUAL --- */}
          <div className="hidden lg:flex items-center justify-center relative opacity-0 animate-reveal" style={{ animationDelay: '0.8s' }}>
            {/* Decorative ring */}
            <div className="absolute w-[420px] h-[420px] rounded-full border border-violet-500/10 animate-[spin_60s_linear_infinite]" />
            <div className="absolute w-[380px] h-[380px] rounded-full border border-dashed border-amber-500/10 animate-[spin_45s_linear_infinite_reverse]" />

            {/* Avatar container */}
            <div className="relative w-[340px] h-[340px] rounded-full overflow-hidden border-2 border-violet-500/20 shadow-[0_0_60px_rgba(139,92,246,0.2)]">
              <Image
                src={profile.avatar || "/images/home avatar.png"}
                alt="Avatar"
                fill
                className="object-cover"
                priority
              />
              {/* Gradient overlay at bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-deep-bg/60 via-transparent to-transparent" />
            </div>

            {/* Floating badges */}
            <div className="absolute -top-4 -right-4 p-3 glass-card rounded-xl animate-float opacity-0 animate-reveal" style={{ animationDelay: '1.8s' }}>
              <FaCode className="text-violet-400 text-lg" />
            </div>
            <div className="absolute -bottom-2 -left-8 p-3 glass-card rounded-xl animate-float-delayed opacity-0 animate-reveal" style={{ animationDelay: '2.0s' }}>
              <FaPalette className="text-amber-400 text-lg" />
            </div>
            <div className="absolute top-1/2 -right-12 p-3 glass-card rounded-xl animate-float opacity-0 animate-reveal" style={{ animationDelay: '2.2s' }}>
              <FaRocket className="text-sky-400 text-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* --- BOTTOM STATUS BAR --- */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center z-30 opacity-0 animate-reveal" style={{ animationDelay: '2s' }}>
        <div className="flex items-center gap-6 text-[10px] md:text-xs text-slate-500 font-mono tracking-wider">
          <span>&copy; 2026 Sharaf Systems</span>
          <span className="w-1 h-1 bg-slate-600 rounded-full" />
          <span>All Rights Reserved</span>
        </div>
      </div>
    </main>
  );
}
