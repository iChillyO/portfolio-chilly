"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Projects", path: "/projects" },
    { name: "Work Queue", path: "/work-queue" },
    { name: "Pricing", path: "/pricing" },
    { name: "Protocols", path: "/protocols" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#020617]/85 backdrop-blur-[24px] border-b border-cyan-500/20 shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
      {/* Subtle Bottom Glow Line */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center relative">

        {/* MOBILE LEFT SPACER (to help center logo) */}
        <div className="flex-1 lg:hidden"></div>

        {/* LOGO (Centered on mobile, Left on desktop) */}
        <div className="flex-none lg:flex-1 flex justify-center lg:justify-start min-w-0">
          <Link href="/" className="cursor-pointer group flex items-center gap-3 max-w-full">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shrink-0 group-hover:bg-cyan-500/30 transition-all duration-500">
              <span className="text-cyan-400 font-black text-lg">C</span>
            </div>
            <span className="text-white font-orbitron font-black text-sm md:text-lg tracking-[0.2em] uppercase italic truncate group-hover:text-cyan-400 transition-colors duration-500">
              Sharaf Hazem
            </span>
          </Link>
        </div>

        {/* MIDDLE: Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-10 justify-center flex-1">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`
                    font-orbitron text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 relative py-1
                    ${isActive
                    ? "text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                    : "text-blue-200/60 hover:text-white hover:scale-110"}
                  `}
              >
                {item.name}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-cyan-500 shadow-[0_0_10px_#22d3ee]"></span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* RIGHT: Mobile Menu Toggle / Spacing for desktop */}
        <div className="flex-1 flex justify-end">
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-cyan-400 text-xl p-2 hover:bg-cyan-500/10 rounded-full transition-colors relative z-[101]"
            >
              {isOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
          {/* Subtle Right Spacing on desktop to balance the logo's space if needed, 
              but usually Nav is centered in middle of Logo and empty space. */}
          <div className="hidden lg:block lg:w-0"></div>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      <div className={`
        fixed inset-0 z-[100] bg-[#020617]/98 backdrop-blur-3xl
        transition-all duration-500 ease-in-out
        flex flex-col items-center justify-start pt-32 md:pt-40
        ${isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}
      `}>
        {/* Close Button Positioned Top Right */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-8 right-8 text-cyan-400 text-3xl p-2 hover:rotate-90 transition-transform duration-300"
        >
          <FaTimes />
        </button>

        {/* Navigation Links - Centered Column */}
        <div className="flex flex-col items-center gap-8">
          {navItems.map((item, index) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setIsOpen(false)}
                className={`
                  text-2xl md:text-3xl font-orbitron font-bold uppercase tracking-[0.15em]
                  transition-all duration-300 relative py-2 px-6
                  group overflow-hidden
                  ${isActive
                    ? "text-cyan-400"
                    : "text-white/70 hover:text-white"}
                `}
              >
                {/* Hover Background Effect */}
                <span className={`
                    absolute inset-0 bg-cyan-500/10 -skew-x-12 
                    transition-transform duration-300 origin-left
                    ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}
                 `}></span>

                <span className="relative z-10">{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Footer Info - Optional, can be kept at bottom or removed. Keeping minimal at bottom for now. */}
        <div className="absolute bottom-10 flex flex-col items-center gap-3">
          <div className="h-[1px] w-12 bg-white/20 mb-2"></div>
          <span className="font-mono text-[10px] text-blue-200/40 tracking-widest uppercase">
            System Online // v2.4.0
          </span>
        </div>
      </div>
    </header >
  );
}