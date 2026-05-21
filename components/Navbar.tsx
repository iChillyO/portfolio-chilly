"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { FaBars, FaTimes, FaArrowDown } from "react-icons/fa";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [avatar, setAvatar] = useState<string>("/images/home avatar.png");

  useEffect(() => { setIsOpen(false); }, [pathname]);

  useEffect(() => {
    async function fetchAvatar() {
      try {
        const res = await fetch('/api/profile');
        const contentType = res.headers.get("content-type");
        if (!res.ok || !contentType || !contentType.includes("application/json")) return;
        const data = await res.json();
        if (data.success && data.data?.avatar) setAvatar(data.data.avatar);
      } catch {}
    }
    fetchAvatar();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
  }, [isOpen]);

  const navItems = [
    { name: "Home", path: "/", description: "Back to the beginning" },
    { name: "About", path: "/about", description: "Who I am & what I do" },
    { name: "Projects", path: "/projects", description: "Things I've built" },
    { name: "Skills", path: "/skills", description: "Tools & technologies" },
    { name: "Pricing", path: "/pricing", description: "Rates & packages" },
    { name: "Contact", path: "/protocols", description: "Let's connect" },
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

      {/* MOBILE MENU — Scroll-snap fullscreen */}
      <div className={`fixed inset-0 z-[55] bg-deep-bg/98 backdrop-blur-2xl transition-all duration-400 ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
      }`}>
        {/* Scroll container with snap */}
        <div className="h-full overflow-y-auto snap-y snap-mandatory scrollbar-hide">

          {/* SECTION 1 — Avatar Hero */}
          <section className="snap-start min-h-[100dvh] flex flex-col items-center justify-center px-6 relative">
            {/* Decorative background */}
            <div className="absolute top-[10%] right-[-20%] w-[300px] h-[300px] bg-galaxy/30 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-[10%] left-[-15%] w-[200px] h-[200px] bg-cerulean/5 rounded-full blur-[60px] pointer-events-none" />

            {/* Avatar card */}
            <div className="relative w-48 h-60 sm:w-56 sm:h-72 rounded-2xl overflow-hidden border border-white/[0.08] bg-gradient-to-b from-galaxy/40 to-deep-bg/80 shadow-2xl">
              <Image
                src={avatar}
                alt="Avatar"
                fill
                className="object-cover object-top"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep-bg via-deep-bg/20 to-transparent" />
              {/* Corner accents */}
              <div className="absolute top-2.5 right-2.5 w-5 h-5 border-t border-r border-gold/40 rounded-tr-md" />
              <div className="absolute bottom-2.5 left-2.5 w-5 h-5 border-b border-l border-gold/40 rounded-bl-md" />
            </div>

            {/* Name & tagline */}
            <div className="mt-5 text-center space-y-1.5">
              <h2 className="text-2xl font-bold text-pearl tracking-tight">Chilly</h2>
              <p className="text-xs text-pearl/40">Developer &middot; Designer &middot; Creator</p>
            </div>

            {/* Scroll hint */}
            <div className="absolute bottom-8 flex flex-col items-center gap-1.5 text-pearl/30">
              <span className="text-[10px] uppercase tracking-widest">Swipe up</span>
              <FaArrowDown className="text-cerulean/60 animate-bounce text-xs" />
            </div>
          </section>

          {/* SECTION 2 — Navigation Links */}
          <section className="snap-start min-h-[100dvh] flex flex-col items-center justify-center px-6 relative">
            <div className="absolute top-[20%] left-[-10%] w-[250px] h-[250px] bg-lilac/10 rounded-full blur-[70px] pointer-events-none" />

            <p className="text-[10px] uppercase tracking-[0.2em] text-pearl/30 mb-6">Navigate</p>

            <nav className="w-full max-w-xs space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`group flex items-center justify-between w-full px-5 py-4 rounded-xl border transition-all duration-200 ${
                      isActive
                        ? "bg-cerulean/10 border-cerulean/30 shadow-md shadow-cerulean/10"
                        : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.12]"
                    }`}
                  >
                    <div className="space-y-0.5">
                      <span className={`block text-base font-semibold ${
                        isActive ? "text-cerulean" : "text-pearl/80 group-hover:text-pearl"
                      }`}>
                        {item.name}
                      </span>
                      <span className="block text-[11px] text-pearl/30">{item.description}</span>
                    </div>
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] transition-all ${
                      isActive
                        ? "bg-cerulean/20 text-cerulean"
                        : "bg-white/[0.04] text-pearl/30 group-hover:text-pearl/60"
                    }`}>
                      →
                    </div>
                  </Link>
                );
              })}
            </nav>

            {/* Scroll hint */}
            <div className="absolute bottom-8 flex flex-col items-center gap-1.5 text-pearl/30">
              <span className="text-[10px] uppercase tracking-widest">More</span>
              <FaArrowDown className="text-cerulean/60 animate-bounce text-xs" />
            </div>
          </section>

          {/* SECTION 3 — CTA */}
          <section className="snap-start min-h-[100dvh] flex flex-col items-center justify-center px-6 relative">
            <div className="absolute bottom-[15%] right-[-10%] w-[200px] h-[200px] bg-galaxy/20 rounded-full blur-[60px] pointer-events-none" />

            <div className="text-center space-y-5">
              <div className="w-14 h-14 mx-auto rounded-xl bg-cerulean/10 border border-cerulean/20 flex items-center justify-center">
                <span className="text-cerulean text-xl">🚀</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-pearl">Ready to collaborate?</h3>
                <p className="text-sm text-pearl/40 max-w-[260px] mx-auto leading-relaxed">
                  Check out the work queue or get in touch — let&apos;s build something great together.
                </p>
              </div>
              <div className="flex flex-col items-center gap-3 pt-2">
                <Link
                  href="/work-queue"
                  onClick={() => setIsOpen(false)}
                  className="w-full max-w-[220px] py-3 text-sm font-medium text-deep-bg bg-cerulean hover:bg-cerulean/90 rounded-xl transition-all shadow-lg shadow-cerulean/20 text-center"
                >
                  Work Queue
                </Link>
                <Link
                  href="/protocols"
                  onClick={() => setIsOpen(false)}
                  className="w-full max-w-[220px] py-3 text-sm font-medium text-pearl/70 hover:text-pearl bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.06] rounded-xl transition-all text-center"
                >
                  Contact Me
                </Link>
              </div>
            </div>

            {/* Footer note */}
            <div className="absolute bottom-8 text-[10px] text-pearl/20 font-mono">
              &copy; {new Date().getFullYear()} Sharaf Systems
            </div>
          </section>

        </div>
      </div>
    </header>
  );
}
