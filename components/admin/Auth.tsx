"use client";

import { useState } from "react";
import { FaShieldAlt, FaLock, FaKey, FaExclamationTriangle } from "react-icons/fa";

interface AuthProps {
  onAuth: () => void;
}

export default function Auth({ onAuth }: AuthProps) {
  const [userInput, setUserInput] = useState("");
  const [passInput, setPassInput] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, these credentials would be validated on a secure backend.
    // For this portfolio, we use environment variables.
    if (userInput === process.env.NEXT_PUBLIC_ADMIN_USERNAME && passInput === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      onAuth();
    } else {
      setError("ACCESS DENIED: Invalid Credentials");
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <main className="h-screen w-full bg-[#050b14] bg-space-pattern bg-cover flex flex-col items-center justify-center p-4 text-cyan-400 font-mono">
      <div className="border border-cyan-500/30 p-8 rounded-2xl max-w-md w-full bg-[#0a1128]/90 backdrop-blur-xl shadow-[0_0_50px_rgba(34,211,238,0.15)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
        <div className="flex justify-center mb-6 text-6xl text-cyan-500 animate-pulse"><FaShieldAlt /></div>
        <h1 className="text-2xl font-bold text-center mb-2 uppercase tracking-[0.3em] text-white">System Locked</h1>
        <form onSubmit={handleLogin} className="space-y-4 mt-8">
          <div className="relative group">
            <FaLock className="absolute top-4 left-4 text-gray-500 group-focus-within:text-cyan-400 transition-colors"/>
            <input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder="USERNAME" className="w-full bg-black/50 border border-cyan-900 rounded-lg py-3 pl-12 text-white focus:border-cyan-400 outline-none transition-colors tracking-widest uppercase" autoFocus />
          </div>
          <div className="relative group">
            <FaKey className="absolute top-4 left-4 text-gray-500 group-focus-within:text-cyan-400 transition-colors"/>
            <input type="password" value={passInput} onChange={(e) => setPassInput(e.target.value)} placeholder="PASSWORD" className="w-full bg-black/50 border border-cyan-900 rounded-lg py-3 pl-12 text-white focus:border-cyan-400 outline-none transition-colors tracking-widest" />
          </div>

          {/* Error Message */}
          <div className="h-6 mt-2 text-center">
            {error && (
              <div className="text-red-500 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 animate-in fade-in">
                <FaExclamationTriangle /> {error}
              </div>
            )}
          </div>
          
          <button type="submit" className="w-full bg-cyan-500/20 border border-cyan-500/50 hover:bg-cyan-500 hover:text-black py-3 rounded-lg font-bold uppercase tracking-widest transition-all duration-300">Initialize Session</button>
        </form>
      </div>
    </main>
  );
}