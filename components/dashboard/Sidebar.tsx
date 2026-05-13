import Link from 'next/link';
import { useState } from 'react';
import {
  FaChartLine, FaChevronDown, FaUserEdit, FaExternalLinkAlt,
  FaImages, FaFileContract, FaTags, FaListUl, FaChevronRight,
  FaBars, FaTimes, FaCogs
} from 'react-icons/fa';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  alias: string;
  setIsAuthenticated: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, alias, setIsAuthenticated }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setIsOpen(false);
  };

  const NavButton = ({ tab, icon, label }: { tab: string; icon: React.ReactNode; label: string }) => (
    <button
      onClick={() => handleTabClick(tab)}
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-medium tracking-wide transition-all duration-200 ${
        activeTab === tab
          ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20'
          : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
      }`}
    >
      {icon} {label}
    </button>
  );

  return (
    <>
      {/* MOBILE TOGGLE */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-5 right-5 z-[60] bg-violet-600 text-white p-3 rounded-xl shadow-lg shadow-violet-600/30"
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* OVERLAY */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] lg:hidden" onClick={() => setIsOpen(false)} />
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 w-64 bg-surface border-r border-white/[0.06] flex flex-col h-full z-50 transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        {/* Logo */}
        <div className="p-5 border-b border-white/[0.06] shrink-0">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shadow-md shadow-violet-600/20">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-white font-bold text-sm tracking-wide group-hover:text-violet-400 transition-colors">Admin Panel</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
          {/* Main */}
          <div>
            <div className="text-[10px] text-slate-600 uppercase tracking-widest mb-2 px-4 font-semibold">Main</div>
            <NavButton tab="overview" icon={<FaChartLine />} label="Overview" />
          </div>

          {/* Identity */}
          <div>
            <div className="text-[10px] text-slate-600 uppercase tracking-widest mb-2 px-4 font-semibold">Identity & Brand</div>
            <div className="space-y-1">
              <NavButton tab="identity" icon={<FaUserEdit />} label="Basic Info" />
              <NavButton tab="social-links" icon={<FaExternalLinkAlt />} label="Social Links" />
              <NavButton tab="skills" icon={<FaCogs />} label="Skills" />
            </div>
          </div>

          {/* Content */}
          <div>
            <div className="text-[10px] text-slate-600 uppercase tracking-widest mb-2 px-4 font-semibold">Content</div>
            <div className="space-y-1">
              <NavButton tab="projects" icon={<FaImages />} label="Projects" />
              <NavButton tab="protocols" icon={<FaFileContract />} label="Protocols" />
              <NavButton tab="pricing" icon={<FaTags />} label="Pricing" />
              <NavButton tab="workQueue" icon={<FaListUl />} label="Work Queue" />
            </div>
          </div>
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-white/[0.06] shrink-0">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/[0.04] mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center text-white font-bold text-xs uppercase">
              {alias.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="text-xs text-white font-semibold truncate">{alias}</div>
              <div className="text-[10px] text-violet-400">Administrator</div>
            </div>
          </div>
          <button
            onClick={() => setIsAuthenticated()}
            className="w-full text-xs py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/30 rounded-lg transition-all font-medium tracking-wide"
          >
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
