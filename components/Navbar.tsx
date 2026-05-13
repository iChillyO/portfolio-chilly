"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Track scroll for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    { name: "Skills", path: "/skills" },
    { name: "Pricing", path: "/pricing" },
    { name: "Contact", path: "/protocols" },
  ];

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
      scrolled 
        ? "bg-deep-bg/80 backdrop-blur-xl border-b border-white/[0.06] shadow-lg shadow-black/20" 
        : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">

        {/* LOGO */}
        <Link href="/" className="group flex items-center gap-3 relative z-[60]">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-all duration-300 group-hover:scale-105">
            <span className="text-white font-black text-sm">C</span>
          </div>
          <span className="hidden sm:block text-white font-display font-bold text-sm tracking-wider uppercase group-hover:text-violet-400 transition-colors duration-300">
            Chilly
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden lg:flex items-center gap-1 bg-white/[0.03] border border-white/[0.06] rounded-full px-2 py-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`relative px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 ${
                  isActive
                    ? "text-white bg-violet-600/90 shadow-md shadow-violet-500/20"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.06]"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* DESKTOP CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/work-queue"
            className="px-5 py-2.5 text-xs font-semibold text-violet-400 bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/20 rounded-full transition-all duration-300 hover:-translate-y-0.5"
          >
            Work Queue
          </Link>
        </div>

        {/* MOBILE TOGGLE */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden relative z-[60] w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors"
        >
          {isOpen ? <FaTimes size={16} /> : <FaBars size={16} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      <div className={`fixed inset-0 z-[55] bg-deep-bg/98 backdrop-blur-2xl transition-all duration-500 flex flex-col items-center justify-center ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
      }`}>
        <nav className="flex flex-col items-center gap-2">
          {navItems.map((item, index) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setIsOpen(false)}
                className={`text-2xl md:text-3xl font-bold tracking-tight py-3 px-8 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? "text-violet-400 bg-violet-500/10"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Footer */}
        <div className="absolute bottom-10 flex flex-col items-center gap-3">
          <Link
            href="/work-queue"
            onClick={() => setIsOpen(false)}
            className="px-6 py-3 text-sm font-semibold text-violet-400 bg-violet-500/10 border border-violet-500/20 rounded-full"
          >
            Work Queue
          </Link>
          <span className="text-xs text-slate-600 tracking-wider">&copy; 2026 Sharaf Systems</span>
        </div>
      </div>
    </header>
  );
}
