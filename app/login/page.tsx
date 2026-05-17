"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaUser, FaLock, FaShieldAlt, FaSpinner, FaExclamationTriangle } from "react-icons/fa";

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
      setError("Invalid credentials. Please try again.");
    } else if (result?.ok) {
      router.push("/dashboard");
    }
    setLoading(false);
  };

  return (
    <main className="h-screen bg-deep-bg flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background */}
      <div className="absolute top-[-150px] right-[-150px] w-[400px] h-[400px] bg-galaxy/40 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[-150px] left-[-150px] w-[300px] h-[300px] bg-lilac/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Card */}
      <div className="relative w-full max-w-sm bg-surface border border-white/[0.06] rounded-2xl p-7 shadow-2xl">
        {/* Logo */}
        <div className="flex justify-center mb-5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cerulean to-lilac flex items-center justify-center shadow-lg shadow-cerulean/20">
            <FaShieldAlt className="text-white text-lg" />
          </div>
        </div>

        <h1 className="text-lg font-bold text-center text-pearl mb-0.5">Welcome Back</h1>
        <p className="text-[11px] text-pearl/40 text-center mb-6">Sign in to access your dashboard</p>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="text-[10px] text-pearl/40 font-medium mb-1.5 block">Username</label>
            <div className="relative">
              <FaUser className="absolute top-3 left-3.5 text-pearl/20" size={11} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="input-field pl-9"
                autoFocus
                disabled={loading}
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-pearl/40 font-medium mb-1.5 block">Password</label>
            <div className="relative">
              <FaLock className="absolute top-3 left-3.5 text-pearl/20" size={11} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="input-field pl-9"
                disabled={loading}
                required
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-1.5 text-[11px] text-red-400 bg-red-500/10 border border-red-500/15 rounded-lg px-3 py-2">
              <FaExclamationTriangle size={10} /> {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-cerulean hover:bg-cerulean/90 disabled:bg-cerulean/50 text-deep-bg text-sm font-medium rounded-lg transition-all shadow-md shadow-cerulean/20 flex items-center justify-center gap-2"
          >
            {loading ? <FaSpinner className="animate-spin" size={13} /> : "Sign In"}
          </button>
        </form>

        <Link
          href="/"
          className="block mt-3 w-full py-2 text-center text-[11px] text-pearl/40 hover:text-pearl border border-white/[0.05] hover:border-white/[0.1] rounded-lg transition-all"
        >
          Return Home
        </Link>
      </div>
    </main>
  );
}
