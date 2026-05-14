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
        if (!res.ok || !contentType || !contentType.includes("application/json")) throw new Error("Fetch failed");
        const data = await res.json();
        if (data.success) setProfile(data.data);
      } catch (error) { console.error("Failed to fetch profile:", error); }
      finally { setLoading(false); }
    }
    fetchProfile();
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => { document.documentElement.style.overflow = "auto"; document.body.style.overflow = "auto"; };
  }, []);

  const getIcon = (p: string) => {
    const l = p.toLowerCase();
    if (l.includes("discord")) return <FaDiscord size={15} />;
    if (l.includes("twitter") || l.includes("x")) return <FaTwitter size={15} />;
    if (l.includes("instagram")) return <FaInstagram size={15} />;
    if (l.includes("google") || l.includes("mail")) return <FaGoogle size={13} />;
    if (l.includes("github")) return <FaGithub size={15} />;
    if (l.includes("linkedin")) return <FaLinkedin size={15} />;
    if (l.includes("youtube")) return <FaYoutube size={15} />;
    if (l.includes("twitch")) return <FaTwitch size={15} />;
    return <FaExternalLinkAlt size={13} />;
  };

  if (loading) {
    return (
      <main className="h-[100dvh] w-full bg-deep-bg flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-cerulean/30 border-t-cerulean rounded-full animate-spin" />
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="h-[100dvh] w-full bg-deep-bg flex items-center justify-center">
        <div className="text-red-400 text-sm">Failed to load profile data.</div>
      </main>
    );
  }

  return (
    <main className="h-[100dvh] w-full bg-deep-bg overflow-hidden relative font-sans select-none">
      {/* BG */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-100 pointer-events-none" />
      <div className="absolute top-[-15%] right-[-8%] w-[600px] h-[600px] bg-galaxy/40 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-15%] left-[-8%] w-[400px] h-[400px] bg-lilac/8 rounded-full blur-[80px] pointer-events-none" />

      {/* CONTENT */}
      <div className="relative z-10 h-full flex flex-col">
        <div className="flex-1 flex items-center justify-center px-5 md:px-10 lg:px-16">
          <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* LEFT */}
            <div className="space-y-6 text-center lg:text-left">
              {/* Status */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] opacity-0 animate-reveal" style={{ animationDelay: '0.1s' }}>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
                </span>
                <span className="text-[11px] text-pearl/70">{profile.statusMsg || "Available for work"}</span>
              </div>

              {/* Name */}
              <div className="space-y-2 opacity-0 animate-reveal" style={{ animationDelay: '0.25s' }}>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1]">
                  <span className="text-pearl">{profile.alias.split(' ')[0]}</span>
                  {profile.alias.split(' ').length > 1 && (
                    <><br /><span className="text-gradient-primary">{profile.alias.split(' ').slice(1).join(' ')}</span></>
                  )}
                  {profile.alias.split(' ').length === 1 && <span className="text-cerulean">.</span>}
                </h1>
                <p className="text-base md:text-lg text-pearl/50 font-light">{profile.designation}</p>
              </div>

              {/* Bio */}
              <p className="text-sm text-pearl/40 leading-relaxed max-w-md mx-auto lg:mx-0 opacity-0 animate-reveal" style={{ animationDelay: '0.4s' }}>
                {profile.bioLong}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 justify-center lg:justify-start opacity-0 animate-reveal" style={{ animationDelay: '0.55s' }}>
                <Link href="/projects" className="group inline-flex items-center gap-2 px-5 py-2.5 bg-cerulean hover:bg-cerulean/90 text-white text-sm font-medium rounded-lg transition-all shadow-lg shadow-cerulean/20 hover:-translate-y-0.5">
                  View Projects <FaArrowRight className="text-[10px] group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link href="/about" className="px-5 py-2.5 text-sm font-medium text-pearl/70 hover:text-pearl bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.06] rounded-lg transition-all hover:-translate-y-0.5">
                  Learn More
                </Link>
              </div>

              {/* Socials */}
              <div className="flex items-center gap-1.5 justify-center lg:justify-start opacity-0 animate-reveal" style={{ animationDelay: '0.7s' }}>
                {profile.socialLinks && profile.socialLinks.length > 0 ? (
                  profile.socialLinks.map((link, idx) => (
                    <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded-lg text-pearl/40 hover:text-cerulean hover:bg-cerulean/10 transition-all">
                      {getIcon(link.platform)}
                    </a>
                  ))
                ) : <span className="text-[11px] text-pearl/30">No links configured.</span>}
              </div>
            </div>

            {/* RIGHT - AVATAR CARD */}
            <div className="hidden lg:flex items-center justify-center relative opacity-0 animate-reveal" style={{ animationDelay: '0.3s' }}>
              <div className="absolute w-[420px] h-[420px] rounded-full bg-gradient-to-br from-galaxy/60 via-transparent to-lilac/10 blur-sm" />
              <div className="relative w-[360px] h-[460px] rounded-2xl overflow-hidden border border-white/[0.06] bg-gradient-to-b from-galaxy/60 to-deep-bg/80 shadow-2xl">
                <div className="absolute inset-0">
                  <Image src={profile.avatar || "/images/home avatar.png"} alt="Avatar" fill className="object-cover object-top" priority />
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-bg via-deep-bg/30 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-cerulean rounded-full" />
                    <span className="text-[11px] text-pearl/50">{profile.designation}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(profile.skillStats || []).slice(0, 3).map((stat, idx) => (
                      <div key={idx} className="px-2.5 py-1 rounded-md bg-white/[0.05] border border-white/[0.06] text-[10px] text-pearl/70">
                        {stat.label} <span className="text-cerulean ml-0.5">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Corner accents */}
                <div className="absolute top-3 right-3 w-6 h-6 border-t border-r border-gold/40 rounded-tr-md" />
                <div className="absolute bottom-3 left-3 w-6 h-6 border-b border-l border-gold/40 rounded-bl-md" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="shrink-0 pb-4 flex items-center justify-between px-5 md:px-10 opacity-0 animate-reveal" style={{ animationDelay: '0.9s' }}>
          <span className="text-[10px] text-pearl/30 font-mono">&copy; {new Date().getFullYear()} Sharaf Systems</span>
          <div className="flex items-center gap-1.5 text-[10px] text-pearl/30">
            <span className="hidden sm:inline">Scroll</span>
            <FaArrowDown className="text-cerulean/50 animate-bounce text-[8px]" />
          </div>
        </div>
      </div>
    </main>
  );
}
