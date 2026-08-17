"use client";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full min-h-screen bg-deep-bg page-transition">
      {children}
    </div>
  );
}
