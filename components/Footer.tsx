"use client";
import Link from "next/link";
import { FaGithub, FaLinkedin, FaTwitter, FaDiscord, FaHeart } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const links = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Projects", path: "/projects" },
    { name: "Pricing", path: "/pricing" },
  ];

  return (
    <footer className="relative w-full border-t border-white/[0.06] bg-deep-bg/80 backdrop-blur-md">
      {/* Gradient line at top */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
          
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center">
                <span className="text-white font-black text-sm">C</span>
              </div>
              <span className="text-white font-display font-bold text-sm tracking-wider uppercase">
                Chilly
              </span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              Creative developer crafting digital experiences with code and design.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Navigation</h4>
            <div className="grid grid-cols-2 gap-2">
              {links.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className="text-sm text-slate-500 hover:text-violet-400 transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Socials */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Social</h4>
            <div className="flex items-center gap-3">
              {[
                { icon: <FaGithub size={16} />, href: "#" },
                { icon: <FaLinkedin size={16} />, href: "#" },
                { icon: <FaTwitter size={16} />, href: "#" },
                { icon: <FaDiscord size={16} />, href: "#" },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 border border-white/5 text-slate-500 hover:text-violet-400 hover:border-violet-500/30 hover:bg-violet-500/10 transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600 tracking-wide">
            &copy; {currentYear} Sharaf Systems. All rights reserved.
          </p>
          <p className="text-xs text-slate-600 flex items-center gap-1.5">
            Built with <FaHeart className="text-violet-500 text-[10px]" /> and lots of caffeine
          </p>
        </div>
      </div>
    </footer>
  );
}
