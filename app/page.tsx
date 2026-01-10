"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaDiscord, FaTwitter, FaGoogle, FaInstagram, FaGithub, FaLinkedin, FaYoutube, FaTwitch, FaExternalLinkAlt } from "react-icons/fa";
import { ProfileData } from "@/types";

// --- 1. DEFINITIONS ---

const CornerBracket = ({ className, rotate = "0" }: { className?: string, rotate?: string }) => (
  <svg
    className={`${className} transition-all duration-500`}
    style={{ transform: `rotate(${rotate}deg)` }}
    width="50"
    height="50"
    viewBox="0 0 50 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M50 2H2V50" stroke="#22d3ee" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const RevealText = ({
  text,
  className,
  delay = 0,
  speed = 0.1
}: {
  text: string,
  className?: string,
  delay?: number,
  speed?: number
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

// --- 2. MAIN COMPONENT ---

export default function Home() {
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

  useEffect(() => {
    // Force body overflow hidden when on Home Page
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = "auto";
      document.body.style.overflow = "auto";
    };
  }, []);

  if (loading) {
    return (
      <main className="h-[100dvh] w-full bg-deep-bg flex items-center justify-center">
        <div className="text-cyan-400 font-mono text-xl">Loading...</div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="h-[100dvh] w-full bg-deep-bg flex items-center justify-center">
        <div className="text-red-500 font-mono text-xl">Failed to load profile data.</div>
      </main>
    );
  }

  return (
    <main className="h-[100dvh] w-full bg-deep-bg flex items-center justify-center p-4 md:p-8 font-sans select-none overflow-hidden relative">

      {/* THE MAIN CARD */}
      <div className="relative w-full max-w-7xl min-h-[70vh] lg:h-[80vh] lg:max-h-[800px] flex bg-[#0a1128]/70 backdrop-blur-xl rounded-[20px] md:rounded-[40px] shadow-[0_0_80px_rgba(34,211,238,0.2)] z-20">

        {/* Border Glows */}
        <div className="absolute inset-0 rounded-[20px] md:rounded-[40px] border border-cyan-500/20 pointer-events-none z-20"></div>

        {/* --- CORNER BRACKETS --- */}
        <div className="absolute -top-4 -right-4 z-30 hidden sm:block">
          <CornerBracket rotate="0" />
        </div>
        <div className="absolute -bottom-4 -left-4 z-30 hidden sm:block">
          <CornerBracket rotate="180" />
        </div>

        {/* --- BLUR SEAM --- */}
        <div className="absolute top-0 left-[45%] h-full w-32 -ml-16 z-35 pointer-events-none hidden lg:block">
          <div className="w-full h-full backdrop-blur-2xl [-webkit-mask-image:linear-gradient(to_right,transparent,black,transparent)]"></div>
        </div>

        {/* --- GRID LAYOUT --- */}
        <div className="w-full h-full grid grid-cols-1 lg:grid-cols-[45%_55%]">

          {/* --- LEFT COLUMN: Character --- */}
          <div className="relative h-full w-full hidden lg:block">
            <div className="absolute bottom-[-10%] left-[-20px] h-[115%] w-full flex items-end justify-center z-30 pointer-events-none">
              <Image
                src={profile.avatar || "/images/lucial-avatar1.png"}
                alt="Avatar"
                width={900}
                height={1100}
                className="object-contain h-full w-auto object-bottom drop-shadow-[0_30px_60px_rgba(0,0,0,0.8)] pr-8"
                priority
              />
            </div>
          </div>

          {/* --- RIGHT COLUMN: Content --- */}
          <div className="relative z-40 h-full flex flex-col justify-center p-6 sm:p-10 lg:p-16 overflow-hidden">

            {/* MOBILE BACKGROUND IMAGE */}
            <div className="absolute inset-0 lg:hidden z-0 pointer-events-none opacity-20 select-none">
              <Image
                src={profile.avatar || "/images/lucial-avatar1.png"}
                alt="Background Avatar"
                fill
                className="object-cover object-top"
                priority
              />
            </div>

            <div className="relative z-10 w-full">

              {/* Header Text */}
              <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                <div className="flex items-center gap-3">
                  <div className="h-[1px] w-8 md:w-12 bg-cyan-400 shadow-[0_0_10px_#22d3ee]"></div>
                  <h3 className="text-cyan-400 text-[10px] md:text-sm font-bold tracking-[0.2em] uppercase">
                    <RevealText text="Welcome to my portfolio" speed={0.05} />
                  </h3>
                </div>

                <div className="relative w-fit">
                  <h1 className="text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] tracking-tighter uppercase italic leading-[1.1] pr-2 pb-2">
                    <RevealText text={profile.alias} delay={1.2} speed={0.15} />
                  </h1>
                  <h1 className="absolute top-1 left-1 text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-black text-cyan-500/20 tracking-tighter uppercase italic leading-[1.1] -z-10 blur-sm opacity-0 animate-reveal" style={{ animationDelay: '2s' }}>
                    {profile.alias}
                  </h1>
                </div>

                <h2 className="text-lg md:text-2xl text-blue-100 font-light tracking-widest uppercase opacity-0 animate-reveal" style={{ animationDelay: '2.5s' }}>
                  {profile.designation}
                </h2>
              </div>

              <p className="text-blue-200/80 text-sm md:text-lg leading-relaxed max-w-lg mb-8 md:mb-10 opacity-0 animate-reveal" style={{ animationDelay: '2.8s' }}>
                {profile.bioLong}
              </p>

              {/* --- CONTACT ME SECTION --- */}
              <div className="opacity-0 animate-reveal" style={{ animationDelay: '3.2s' }}>
                <p className="text-[10px] md:text-xs text-blue-400/50 uppercase tracking-widest mb-4">Contact Me</p>

                <div className="flex items-center gap-3 flex-wrap">
                  {/* DYNAMIC SOCIAL LINKS */}
                  {profile.socialLinks && profile.socialLinks.length > 0 ? (
                    profile.socialLinks.map((link, idx) => {
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
                        <a
                          key={idx}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-black/40 border border-white/5 rounded-xl text-gray-400 hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-cyan-900/20 hover:scale-110 transition-all duration-300 shadow-lg"
                        >
                          {getIcon(link.platform)}
                        </a>
                      );
                    })
                  ) : (
                    <div className="text-xs text-gray-600">No uplink signals detected.</div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* INTEGRATED FOOTER */}
      <div className="absolute bottom-6 w-full text-center z-30 opacity-0 animate-reveal" style={{ animationDelay: '3.5s' }}>
        <p className="text-[10px] md:text-xs text-blue-200/40 font-mono tracking-widest uppercase mb-1">Terms of Use</p>
        <p className="text-[10px] md:text-xs text-blue-200/20 font-mono tracking-widest uppercase">© 2025 Sharaf SYSTEMS. ALL RIGHTS RESERVED</p>
      </div>

    </main>
  );
}