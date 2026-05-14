"use client";
import Link from "next/link";
import { FaGithub, FaLinkedin, FaTwitter, FaDiscord, FaHeart } from "react-icons/fa";

export default function Footer() {
  const year = new Date().getFullYear();
  const links = [{ name: "Home", path: "/" }, { name: "About", path: "/about" }, { name: "Projects", path: "/projects" }, { name: "Pricing", path: "/pricing" }];

  return (
    <footer className="relative w-full border-t border-white/[0.04] bg-deep-bg/90">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cerulean/20 to-transparent" />
      <div className="max-w-6xl mx-auto px-5 md:px-10 py-10 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cerulean to-lilac flex items-center justify-center"><span className="text-white font-bold text-[10px]">C</span></div>
              <span className="text-pearl font-display font-bold text-xs tracking-wider uppercase">Chilly</span>
            </div>
            <p className="text-xs text-pearl/30 leading-relaxed max-w-xs">Creative developer crafting digital experiences.</p>
          </div>
          <div className="space-y-3">
            <h4 className="text-[10px] font-medium text-pearl/30 uppercase tracking-widest">Navigation</h4>
            <div className="grid grid-cols-2 gap-1.5">
              {links.map(l => <Link key={l.path} href={l.path} className="text-xs text-pearl/40 hover:text-cerulean transition-colors">{l.name}</Link>)}
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="text-[10px] font-medium text-pearl/30 uppercase tracking-widest">Social</h4>
            <div className="flex gap-2">
              {[<FaGithub size={14} />, <FaLinkedin size={14} />, <FaTwitter size={14} />, <FaDiscord size={14} />].map((icon, i) => (
                <a key={i} href="#" className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.03] border border-white/[0.05] text-pearl/40 hover:text-cerulean hover:border-cerulean/30 transition-all">{icon}</a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-white/[0.03] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[10px] text-pearl/25">&copy; {year} Sharaf Systems. All rights reserved.</p>
          <p className="text-[10px] text-pearl/25 flex items-center gap-1">Built with <FaHeart className="text-cerulean text-[8px]" /> and caffeine</p>
        </div>
      </div>
    </footer>
  );
}
