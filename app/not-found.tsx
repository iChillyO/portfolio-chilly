"use client";
import Link from "next/link";
import { FaExclamationTriangle, FaHome } from "react-icons/fa";

export default function NotFound() {
  return (
    <main className="h-screen w-full bg-[#0a1128] flex flex-col items-center justify-center p-4 text-center select-none relative overflow-hidden">
      
      {/* Background Glitch Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500/50 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-red-500/50 animate-pulse"></div>
      
      <div className="relative z-10 space-y-6">
        <FaExclamationTriangle className="text-6xl text-red-500 mx-auto animate-bounce" />
        
        <h1 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600 tracking-tighter">
          404
        </h1>
        
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-red-400 uppercase tracking-widest">
            Signal Lost
          </h2>
          <p className="text-blue-200/60 font-mono text-sm">
            The coordinates you entered lead to deep space. No data found.
          </p>
        </div>

        <Link 
          href="/"
          className="inline-flex items-center gap-2 px-8 py-3 bg-cyan-900/20 border border-cyan-500/50 text-cyan-400 font-bold uppercase tracking-widest rounded-full hover:bg-cyan-500 hover:text-black transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.5)]"
        >
          <FaHome /> Re-establish Uplink
        </Link>
      </div>

    </main>
  );
}