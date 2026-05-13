"use client";

import { useState, useEffect } from "react";
import { FaShieldAlt, FaLock, FaKey, FaExclamationTriangle, FaSpinner } from "react-icons/fa";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Auth() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    if (result?.error) {
      setError("Invalid credentials. Please try again.");
    } else if (result?.ok) {
      router.push("/dashboard");
    }
    setLoading(false);
  };

  if (status === "loading") {
    return (
      <main className="h-screen w-full bg-deep-bg flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main className="h-screen w-full bg-deep-bg flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-[-200px] right-[-200px] w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-sm bg-surface border border-white/[0.08] rounded-2xl p-8 shadow-2xl">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shadow-lg shadow-violet-600/30">
            <FaShieldAlt className="text-white text-xl" />
          </div>
        </div>

        <h1 className="text-xl font-bold text-center text-white mb-1">Welcome Back</h1>
        <p className="text-xs text-slate-500 text-center mb-8">Sign in to access your dashboard</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 font-medium mb-1.5 block">Username</label>
            <div className="relative">
              <FaLock className="absolute top-3.5 left-3.5 text-slate-600" size={12} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:border-violet-500/50 focus:outline-none transition-colors"
                autoFocus
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 font-medium mb-1.5 block">Password</label>
            <div className="relative">
              <FaKey className="absolute top-3.5 left-3.5 text-slate-600" size={12} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:border-violet-500/50 focus:outline-none transition-colors"
                disabled={loading}
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2.5">
              <FaExclamationTriangle size={11} /> {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-600/50 text-white text-sm font-semibold rounded-lg transition-all shadow-md shadow-violet-600/20 flex items-center justify-center gap-2"
          >
            {loading ? <FaSpinner className="animate-spin" size={14} /> : "Sign In"}
          </button>
        </form>

        <div className="mt-4">
          <Link href="/" className="block w-full py-2.5 text-center text-xs text-slate-500 hover:text-white border border-white/[0.06] hover:border-white/[0.12] rounded-lg transition-all">
            Return to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
