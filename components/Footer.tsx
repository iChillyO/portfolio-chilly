"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  FaGithub, FaLinkedin, FaTwitter, FaDiscord, FaInstagram, FaYoutube,
  FaTwitch, FaGoogle, FaExternalLinkAlt
} from "react-icons/fa";

interface SocialLink { platform: string; url: string; }

const getIcon = (platform: string) => {
  const p = platform.toLowerCase();
  if (p.includes("discord")) return <FaDiscord size={14} />;
  if (p.includes("twitter") || p.includes("x")) return <FaTwitter size={14} />;
  if (p.includes("instagram")) return <FaInstagram size={14} />;
  if (p.includes("google") || p.includes("mail")) return <FaGoogle size={13} />;
  if (p.includes("github")) return <FaGithub size={14} />;
  if (p.includes("linkedin")) return <FaLinkedin size={14} />;
  if (p.includes("youtube")) return <FaYoutube size={14} />;
  if (p.includes("twitch")) return <FaTwitch size={14} />;
  return <FaExternalLinkAlt size={12} />;
};

export default function Footer() {
  const year = new Date().getFullYear();
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  // Fetch dynamic social links from the same source the dashboard manages
  useEffect(() => {
    fetch('/api/profile')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.socialLinks) {
          setSocialLinks(data.data.socialLinks);
        }
      })
      .catch(() => {/* silent fail - footer just shows nothing */});
  }, []);

  // Same links as the Navbar so everything is consistent
  const links = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Projects", path: "/projects" },
    { name: "Skills", path: "/skills" },
    { name: "Pricing", path: "/pricing" },
    { name: "Contact", path: "/protocols" },
    { name: "Work Queue", path: "/work-queue" },
  ];

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
            <h4 className="text-[10px] font-medium text-pearl/30 uppercase tracking-widest">Pages</h4>
            <div className="grid grid-cols-2 gap-1.5">
              {links.map(l => <Link key={l.path} href={l.path} className="text-xs text-pearl/40 hover:text-cerulean transition-colors">{l.name}</Link>)}
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="text-[10px] font-medium text-pearl/30 uppercase tracking-widest">Social</h4>
            <div className="flex gap-2 flex-wrap">
              {socialLinks.length > 0 ? (
                socialLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={link.platform}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.03] border border-white/[0.05] text-pearl/40 hover:text-cerulean hover:border-cerulean/30 transition-all"
                  >
                    {getIcon(link.platform)}
                  </a>
                ))
              ) : (
                <span className="text-[11px] text-pearl/25">No links configured.</span>
              )}
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-white/[0.03]">
          <p className="text-[10px] text-pearl/25 text-center sm:text-left">&copy; {year} Sharaf Systems. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
