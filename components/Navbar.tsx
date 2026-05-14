"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => { setIsOpen(false); }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
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
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      scrolled ? "bg-deep-bg/90 backdrop-blur-xl border-b border-white/[0.04]" : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">

        {/* LOGO */}
        <Link href="/" className="group flex items-center gap-2.5 relative z-[60]">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cerulean to-lilac flex items-center justify-center shadow-lg shadow-cerulean/20">
            <span className="text-white font-bold text-xs">C</span>
          </div>
          <span className="hidden sm:block text-pearl font-display font-bold text-sm tracking-wider uppercase group-hover:text-cerulean transition-colors">
            Chilly
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden lg:flex items-center gap-0.5 bg-white/[0.03] border border-white/[0.05] rounded-full px-1.5 py-1">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-200 ${
                  isActive
                    ? "text-white bg-cerulean/90 shadow-sm shadow-cerulean/30"
                    : "text-pearl/60 hover:text-pearl hover:bg-white/[0.05]"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* DESKTOP CTA */}
        <div className="hidden lg:block">
          <Link
            href="/work-queue"
            className="px-4 py-1.5 text-xs font-medium text-cerulean bg-cerulean/10 hover:bg-cerulean/20 border border-cerulean/20 rounded-full transition-all"
          >
            Work Queue
          </Link>
        </div>

        {/* MOBILE TOGGLE */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden relative z-[60] w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-pearl/70 hover:text-pearl transition-colors"
        >
          {isOpen ? <FaTimes size={14} /> : <FaBars size={14} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      <div className={`fixed inset-0 z-[55] bg-deep-bg/98 backdrop-blur-2xl transition-all duration-400 flex flex-col items-center justify-center ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
      }`}>
        <nav className="flex flex-col items-center gap-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setIsOpen(false)}
                className={`text-xl font-semibold py-2.5 px-6 rounded-xl transition-all ${
                  isActive ? "text-cerulean bg-cerulean/10" : "text-pearl/70 hover:text-pearl hover:bg-white/5"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-8">
          <Link href="/work-queue" onClick={() => setIsOpen(false)} className="px-5 py-2.5 text-sm font-medium text-cerulean bg-cerulean/10 border border-cerulean/20 rounded-full">
            Work Queue
          </Link>
        </div>
      </div>
    </header>
  );
}
