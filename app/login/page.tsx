"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaUser, FaLock, FaSignInAlt, FaSpinner } from "react-icons/fa";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    if (result?.error) {
      setError("Invalid credentials");
    } else if (result?.ok) {
      router.push("/dashboard");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen w-full bg-deep-bg flex items-center justify-center p-4 font-sans overflow-hidden relative select-none">
      <div className="bg-[#0a1128]/80 backdrop-blur border border-cyan-500/30 p-8 md:p-12 rounded-xl shadow-[0_0_50px_rgba(34,211,238,0.2)] w-full max-w-md animate-in fade-in zoom-in-50 duration-500">
        <h1 className="text-3xl md:text-4xl font-black text-white text-center mb-8 tracking-tighter uppercase italic">
          System <span className="text-cyan-500">Login</span>
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-[10px] text-cyan-500 uppercase tracking-widest mb-2 block">Username</label>
            <div className="relative">
              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black/50 border border-cyan-900 rounded pl-12 pr-4 py-3 text-white focus:border-cyan-400 outline-none transition-colors"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-cyan-500 uppercase tracking-widest mb-2 block">Password</label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/50 border border-cyan-900 rounded pl-12 pr-4 py-3 text-white focus:border-cyan-400 outline-none transition-colors"
                required
                disabled={loading}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-500/50 text-red-400 text-sm px-4 py-3 rounded-md text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-black font-bold py-4 rounded uppercase tracking-widest transition-all flex items-center justify-center gap-3"
            disabled={loading}
          >
            {loading ? <FaSpinner className="animate-spin" /> : <FaSignInAlt />}
            {loading ? "AUTHENTICATING..." : "ACCESS SYSTEM"}
          </button>
        </form>
      </div>
    </main>
  );
}
