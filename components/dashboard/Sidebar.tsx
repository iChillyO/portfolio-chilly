import Link from 'next/link';
import { useState } from 'react';
import {
  FaChartLine, FaChevronDown, FaUserEdit, FaExternalLinkAlt,
  FaImages, FaFileContract, FaTags, FaListUl, FaChevronRight,
  FaBars, FaTimes
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
    setIsOpen(false); // Close sidebar after selecting a tab on mobile
  };

  return (
    <>
      {/* MOBILE TOGGLE BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-6 right-6 z-[60] bg-cyan-500 text-black p-3 rounded-full shadow-[0_0_20px_rgba(34,211,238,0.4)]"
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* OVERLAY FOR MOBILE */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 w-64 border-r border-cyan-500/20 bg-[#0a1128]/95 backdrop-blur flex flex-col h-full z-50 transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div className="p-6 border-b border-cyan-500/20 mb-8 shrink-0">
          <Link href="/" className="text-xl font-black italic tracking-tighter text-white">SHARAF<span className="text-cyan-500">_ADMIN</span></Link>
        </div>

        <nav className="flex-1 px-4 space-y-6 overflow-y-auto custom-scrollbar">
          {/* Main Group */}
          <div>
            <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-3 px-2">Main</div>
            <button onClick={() => handleTabClick('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded text-xs font-bold uppercase tracking-wider transition-all border border-transparent ${activeTab === 'overview' ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(34,211,238,0.3)]' : 'hover:border-cyan-500/30 hover:text-white'}`}>
              <FaChartLine /> Overview
            </button>
          </div>

          {/* Identity Group */}
          <div>
            <div className="flex items-center justify-between text-[10px] text-gray-500 uppercase tracking-widest mb-3 px-2 cursor-pointer hover:text-cyan-400">
              <span>Identity & Branding</span><FaChevronDown />
            </div>
            <div className="space-y-2 pl-2">
              <button onClick={() => handleTabClick('identity')} className={`w-full flex items-center gap-3 px-4 py-3 rounded text-xs font-bold uppercase tracking-wider transition-all border ${activeTab === 'identity' ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]' : 'border-transparent text-gray-400 hover:border-cyan-500/30 hover:text-white'}`}>
                <FaUserEdit /> Basic Info
              </button>
              <button onClick={() => handleTabClick('social-links')} className={`w-full flex items-center gap-3 px-4 py-3 rounded text-xs font-bold uppercase tracking-wider transition-all border ${activeTab === 'social-links' ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]' : 'border-transparent text-gray-400 hover:border-cyan-500/30 hover:text-white'}`}>
                <FaExternalLinkAlt /> Social Links
              </button>
            </div>
          </div>

          {/* Work Group */}
          <div>
            <div className="flex items-center justify-between text-[10px] text-gray-500 uppercase tracking-widest mb-3 px-2 cursor-pointer hover:text-cyan-400">
              <span>Work & Data</span><FaChevronRight className="opacity-50" />
            </div>
            <div className="space-y-2 pl-2">
              <button onClick={() => handleTabClick('projects')} className={`w-full flex items-center gap-3 px-4 py-3 rounded text-xs font-bold uppercase tracking-wider transition-all border ${activeTab === 'projects' ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(34,211,238,0.3)]' : 'border-transparent text-gray-400 hover:border-cyan-500/30 hover:text-white'}`}>
                <FaImages /> Portfolio
              </button>
              <button onClick={() => handleTabClick('protocols')} className={`w-full flex items-center gap-3 px-4 py-3 rounded text-xs font-bold uppercase tracking-wider transition-all border border-transparent ${activeTab === 'protocols' ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(34,211,238,0.3)]' : 'hover:border-cyan-500/30 hover:text-white'}`}>
                <FaFileContract /> Protocols
              </button>
              <button onClick={() => handleTabClick('pricing')} className={`w-full flex items-center gap-3 px-4 py-3 rounded text-xs font-bold uppercase tracking-wider transition-all border ${activeTab === 'pricing' ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(34,211,238,0.3)]' : 'border-transparent text-gray-400 hover:border-cyan-500/30 hover:text-white'}`}>
                <FaTags /> Pricing
              </button>
              <button onClick={() => handleTabClick('workQueue')} className={`w-full flex items-center gap-3 px-4 py-3 rounded text-xs font-bold uppercase tracking-wider transition-all border ${activeTab === 'workQueue' ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(34,211,238,0.3)]' : 'border-transparent text-gray-400 hover:border-cyan-500/30 hover:text-white'}`}>
                <FaListUl /> Queue
              </button>
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-cyan-500/20 mt-auto bg-black/20 shrink-0">
          <div className="flex items-center gap-3 p-3 rounded bg-black/40 border border-cyan-500/10 mb-3">
            <div className="w-8 h-8 rounded bg-cyan-500 flex items-center justify-center text-black font-bold uppercase">{alias.charAt(0)}</div>
            <div>
              <div className="text-xs text-white font-bold">{alias}</div>
              <div className="text-[10px] text-cyan-400">System Root</div>
            </div>
          </div>
          <button onClick={() => setIsAuthenticated()} className="w-full border border-red-500/30 text-red-500 text-[10px] py-3 hover:bg-red-500/10 uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
            <FaExternalLinkAlt className="rotate-180" /> Terminate Session
          </button>
        </div>
      </aside>
    </>
  );
}