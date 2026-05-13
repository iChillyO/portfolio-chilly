"use client";
import { usePathname } from "next/navigation";

export default function EdgeBlurs() {
  const pathname = usePathname();

  // Only show subtle edge effects on home page
  if (pathname !== "/") return null;

  return (
    <>
      {/* Top gradient fade */}
      <div className="fixed top-0 left-0 w-full h-24 bg-gradient-to-b from-deep-bg to-transparent pointer-events-none z-[40]" />
      {/* Bottom gradient fade */}
      <div className="fixed bottom-0 left-0 w-full h-24 bg-gradient-to-t from-deep-bg to-transparent pointer-events-none z-[40]" />
    </>
  );
}
