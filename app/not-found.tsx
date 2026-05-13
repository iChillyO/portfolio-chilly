"use client";
import Link from "next/link";
import { FaHome } from "react-icons/fa";

export default function NotFound() {
  return (
    <main className="h-screen w-full bg-deep-bg flex flex-col items-center justify-center p-4 text-center select-none relative overflow-hidden">

      {/* Background orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        <h1 className="text-8xl md:text-9xl font-black text-gradient-primary tracking-tighter">
          404
        </h1>

        <div className="space-y-3">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Page Not Found
          </h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-7 py-3.5 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-violet-500/20 hover:-translate-y-0.5"
        >
          <FaHome /> Back to Home
        </Link>
      </div>
    </main>
  );
}
