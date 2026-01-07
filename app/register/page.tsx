"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaUserPlus, FaLock, FaUser } from "react-icons/fa";

export default function Register() {
    const [formData, setFormData] = useState({ username: "", password: "", confirmPassword: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password
                }),
            });

            const data = await res.json();

            if (res.ok) {
                router.push("/login?registered=true");
            } else {
                setError(data.message || "Registration failed");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen w-full bg-deep-bg flex items-center justify-center p-4 font-sans overflow-hidden relative select-none">
            <div className="w-full max-w-md bg-black/60 backdrop-blur-md border border-cyan-500/30 p-8 rounded-xl shadow-[0_0_50px_rgba(6,182,212,0.15)] relative overflow-hidden group">

                {/* Decorative corner accents */}
                <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-cyan-500/50 rounded-tl-xl"></div>
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-cyan-500/50 rounded-br-xl"></div>

                <div className="text-center mb-8 relative z-10">
                    <div className="flex justify-center mb-4">
                        <div className="p-4 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                            <FaUserPlus size={24} />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-white uppercase tracking-[0.2em] mb-2">Initialize User</h1>
                    <p className="text-cyan-500/60 text-xs tracking-widest">ESTABLISH NEW NEURAL LINK</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded text-center text-xs tracking-wide">
                            ⚠ {error}
                        </div>
                    )}

                    <div className="relative group/input">
                        <FaUser className="absolute top-4 left-4 text-cyan-500/50 group-focus-within/input:text-cyan-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="IDENTIFIER (USERNAME)"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            className="w-full bg-black/40 border border-cyan-900 rounded p-3 pl-12 text-white placeholder-cyan-900 focus:border-cyan-400 outline-none transition-all text-sm tracking-wider"
                            required
                        />
                    </div>

                    <div className="relative group/input">
                        <FaLock className="absolute top-4 left-4 text-cyan-500/50 group-focus-within/input:text-cyan-400 transition-colors" />
                        <input
                            type="password"
                            placeholder="ACCESS KEY (PASSWORD)"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full bg-black/40 border border-cyan-900 rounded p-3 pl-12 text-white placeholder-cyan-900 focus:border-cyan-400 outline-none transition-all text-sm tracking-wider"
                            required
                        />
                    </div>

                    <div className="relative group/input">
                        <FaLock className="absolute top-4 left-4 text-cyan-500/50 group-focus-within/input:text-cyan-400 transition-colors" />
                        <input
                            type="password"
                            placeholder="VERIFY KEY (CONFIRM)"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            className="w-full bg-black/40 border border-cyan-900 rounded p-3 pl-12 text-white placeholder-cyan-900 focus:border-cyan-400 outline-none transition-all text-sm tracking-wider"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-cyan-600/20 hover:bg-cyan-600 border border-cyan-500/50 text-cyan-500 hover:text-black font-bold py-3 rounded uppercase tracking-[0.2em] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group-hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                    >
                        {loading ? "INITIALIZING..." : "CREATE IDENTITY"}
                    </button>

                    <div className="text-center mt-6">
                        <Link href="/login" className="text-xs text-cyan-500/60 hover:text-cyan-400 underline decoration-dashed underline-offset-4 tracking-widest transition-colors">
              // RETURN TO LOGIN SEQUENCE
                        </Link>
                    </div>
                </form>
            </div>
        </main>
    );
}
