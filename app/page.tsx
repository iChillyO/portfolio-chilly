"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaDiscord, FaTwitter, FaGoogle, FaInstagram } from "react-icons/fa";
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
    <path d="M50 2H2V50" stroke="#22D3EE" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
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
    <main className="h-screen w-full bg-deep-bg bg-space-pattern bg-cover bg-center flex items-center justify-center p-4 font-sans overflow-hidden relative select-none">
      
      {/* THE MAIN CARD */}
      <div className="relative w-full max-w-7xl h-[80vh] max-h-[800px] flex bg-[#0a1128]/70 backdrop-blur-xl rounded-[40px] shadow-[0_0_80px_rgba(8,145,178,0.2)] mt-12 z-20">
        
        {/* Border Glows */}
        <div className="absolute inset-0 rounded-[40px] border border-cyan-500/20 pointer-events-none z-20"></div>

        {/* --- CORNER BRACKETS --- */}
        <div className="absolute -top-4 -right-4 z-30">
          <CornerBracket rotate="0" />
        </div>
        <div className="absolute -bottom-4 -left-4 z-30">
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
          <div className="relative z-40 h-full flex flex-col justify-center p-8 lg:p-16">
            
            {/* Header Text */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="h-[1px] w-12 bg-cyan-400 shadow-[0_0_10px_#22d3ee]"></div>
                <h3 className="text-cyan-400 text-sm font-bold tracking-[0.2em] uppercase">
                  <RevealText text="Welcome to my portfolio" speed={0.05} />
                </h3>
              </div>
              
              <div className="relative w-fit">
                <h1 className="text-7xl lg:text-8xl xl:text-9xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] tracking-tighter uppercase italic leading-[1.1] pr-2 pb-2">
                  <RevealText text={profile.alias} delay={1.2} speed={0.15} />
                </h1>
                <h1 className="absolute top-1 left-1 text-7xl lg:text-8xl xl:text-9xl font-black text-cyan-500/20 tracking-tighter uppercase italic leading-[1.1] -z-10 blur-sm opacity-0 animate-reveal" style={{ animationDelay: '2s' }}>
                  {profile.alias}
                </h1>
              </div>

              <h2 className="text-2xl text-blue-100 font-light tracking-widest uppercase opacity-0 animate-reveal" style={{ animationDelay: '2.5s' }}>
                {profile.designation}
              </h2>
            </div>

            <p className="text-blue-200/80 text-lg leading-relaxed max-w-lg mb-10 opacity-0 animate-reveal" style={{ animationDelay: '2.8s' }}>
              {profile.bioLong}
            </p>
            
            {/* --- CONTACT ME SECTION --- */}
            <div className="opacity-0 animate-reveal" style={{ animationDelay: '3.2s' }}>
               <p className="text-xs text-blue-400/50 uppercase tracking-widest mb-4">Contact Me</p>
               
               <div className="flex items-center gap-3">
                 <a href="#" target="_blank" className="w-12 h-12 flex items-center justify-center bg-black/40 border border-white/5 rounded-xl text-gray-400 hover:text-indigo-400 hover:border-indigo-500/50 hover:bg-indigo-900/20 hover:scale-110 transition-all duration-300 shadow-lg">
                   <FaDiscord size={20} />
                 </a>
                 <a href="#" target="_blank" className="w-12 h-12 flex items-center justify-center bg-black/40 border border-white/5 rounded-xl text-gray-400 hover:text-white hover:border-white/50 hover:bg-white/10 hover:scale-110 transition-all duration-300 shadow-lg">
                   <FaTwitter size={20} />
                 </a>
                 <a href="#" target="_blank" className="w-12 h-12 flex items-center justify-center bg-black/40 border border-white/5 rounded-xl text-gray-400 hover:text-pink-400 hover:border-pink-500/50 hover:bg-pink-900/20 hover:scale-110 transition-all duration-300 shadow-lg">
                   <FaInstagram size={20} />
                 </a>
                 <a href="mailto:sharaf@example.com" className="w-12 h-12 flex items-center justify-center bg-black/40 border border-white/5 rounded-xl text-gray-400 hover:text-red-400 hover:border-red-500/50 hover:bg-red-900/20 hover:scale-110 transition-all duration-300 shadow-lg">
                   <FaGoogle size={18} />
                 </a>
               </div>
            </div>

          </div>
        </div>
      </div>

      {/* --- BOTTOM RIGHT FOOTER (UPDATED VISIBILITY) --- */}
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-1 text-[10px] md:text-xs font-mono tracking-widest text-gray-400 items-end text-right">
        <Link href="/protocols" className="hover:text-cyan-400 transition-colors uppercase font-bold">
          Terms of Use
        </Link>
        <p className="uppercase opacity-80">© 2025 Sharaf SYSTEMS. ALL RIGHTS RESERVED.</p>
      </div>

      {/* --- EDGE BLUR EFFECTS --- */}
      <div className="fixed bottom-0 left-0 w-full h-24 bg-gradient-to-t from-deep-bg via-deep-bg/90 to-transparent pointer-events-none z-10 backdrop-blur-[1px]"></div>
      <div className="fixed top-0 left-0 h-full w-24 bg-gradient-to-r from-deep-bg via-deep-bg/90 to-transparent pointer-events-none z-10 backdrop-blur-[1px]"></div>
      <div className="fixed top-0 right-0 h-full w-24 bg-gradient-to-l from-deep-bg via-deep-bg/90 to-transparent pointer-events-none z-10 backdrop-blur-[1px]"></div>
    
    </main>
  );
}