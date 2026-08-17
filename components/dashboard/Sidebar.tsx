import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { FaChartLine, FaUserEdit, FaExternalLinkAlt, FaImages, FaFileContract, FaTags, FaListUl, FaBars, FaTimes, FaCogs } from 'react-icons/fa';

interface SidebarProps { activeTab: string; setActiveTab: (tab: string) => void; alias: string; setIsAuthenticated: () => void; }

export default function Sidebar({ activeTab, setActiveTab, alias, setIsAuthenticated }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const click = (tab: string) => { setActiveTab(tab); setIsOpen(false); };

  const Btn = ({ tab, icon, label }: { tab: string; icon: React.ReactNode; label: string }) => (
    <button onClick={() => click(tab)} className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${activeTab === tab ? 'bg-cerulean text-deep-bg shadow-sm shadow-cerulean/30' : 'text-pearl/50 hover:text-pearl hover:bg-white/[0.04]'}`}>{icon} {label}</button>
  );

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden fixed top-4 right-4 z-[60] bg-cerulean text-deep-bg p-2.5 rounded-lg shadow-lg shadow-cerulean/30"><FaBars size={14} /></button>
      {isOpen && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[45] lg:hidden" onClick={() => setIsOpen(false)} />}
      <aside className={`fixed lg:static inset-y-0 left-0 w-56 bg-surface border-r border-white/[0.04] flex flex-col h-full z-50 transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="p-4 border-b border-white/[0.04] shrink-0">
          <Link href="/" className="flex items-center gap-2 group">
            <Image src="/logo.png" alt="Chilly" width={28} height={28} className="w-7 h-7 rounded-lg" />
            <span className="text-pearl font-bold text-xs tracking-wide">Admin</span>
          </Link>
        </div>
        <nav className="flex-1 px-2.5 py-3 space-y-5 overflow-y-auto">
          <div><div className="text-[9px] text-pearl/25 uppercase tracking-widest mb-1.5 px-3.5">Main</div><Btn tab="overview" icon={<FaChartLine />} label="Overview" /></div>
          <div><div className="text-[9px] text-pearl/25 uppercase tracking-widest mb-1.5 px-3.5">Identity</div><div className="space-y-0.5"><Btn tab="identity" icon={<FaUserEdit />} label="Profile" /><Btn tab="social-links" icon={<FaExternalLinkAlt />} label="Socials" /><Btn tab="skills" icon={<FaCogs />} label="Skills" /></div></div>
          <div><div className="text-[9px] text-pearl/25 uppercase tracking-widest mb-1.5 px-3.5">Content</div><div className="space-y-0.5"><Btn tab="projects" icon={<FaImages />} label="Projects" /><Btn tab="protocols" icon={<FaFileContract />} label="Protocols" /><Btn tab="pricing" icon={<FaTags />} label="Pricing" /><Btn tab="workQueue" icon={<FaListUl />} label="Queue" /></div></div>
        </nav>
        <div className="p-3 border-t border-white/[0.04] shrink-0">
          <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.04] mb-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cerulean to-lilac flex items-center justify-center text-white font-bold text-[10px] uppercase">{alias.charAt(0)}</div>
            <div className="min-w-0"><div className="text-[11px] text-pearl font-medium truncate">{alias}</div><div className="text-[9px] text-cerulean">Admin</div></div>
          </div>
          <button onClick={() => setIsAuthenticated()} className="w-full text-[10px] py-2 text-red-400 hover:bg-red-500/10 border border-red-500/15 rounded-lg transition-all font-medium">Sign Out</button>
        </div>
      </aside>
    </>
  );
}
