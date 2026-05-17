"use client";
import Link from "next/link";
import { FaHome } from "react-icons/fa";

export default function NotFound() {
  return (
    <main className="h-screen w-full bg-deep-bg flex flex-col items-center justify-center p-4 text-center select-none relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-galaxy/30 rounded-full blur-[80px] pointer-events-none" />
      <div className="relative z-10 space-y-5">
        <h1 className="text-7xl md:text-8xl font-black text-gradient-primary tracking-tighter">404</h1>
        <h2 className="text-xl font-bold text-pearl">Page Not Found</h2>
        <p className="text-pearl/40 text-sm max-w-sm mx-auto">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-cerulean text-deep-bg text-sm font-medium rounded-lg shadow-md shadow-cerulean/20 hover:-translate-y-0.5 transition-all">
          <FaHome size={12} /> Back to Home
        </Link>
      </div>
    </main>
  );
}
