import { FaSave, FaSpinner, FaTerminal, FaFileContract, FaTags, FaListUl, FaShieldAlt, FaSyncAlt } from "react-icons/fa";
import { ProfileData } from "@/types";

interface HeaderProps {
  activeTab: string;
  saving: boolean;
  handleSaveIdentity: () => void;
  identity: ProfileData;
  syncMessage: { message: string; type: "success" | "error" | "" };
}

export default function Header({ activeTab, saving, handleSaveIdentity, identity, syncMessage }: HeaderProps) {
  const getTabInfo = () => {
    switch (activeTab) {
      case 'overview':
        return { title: 'DASHBOARD OVERVIEW', subtitle: 'System Status & Quick Actions', icon: <FaShieldAlt /> };
      case 'identity':
        return { title: 'IDENTITY MGMT', subtitle: 'Biometric Data & Brand Identity', icon: <FaTerminal /> };
      case 'protocols':
        return { title: 'SYSTEM PROTOCOLS', subtitle: 'Governance & Terms of Service', icon: <FaFileContract /> };
      case 'projects':
        return { title: 'MISSION ARCHIVE', subtitle: 'Field Operations & Portfolio Data', icon: <FaTerminal /> };
      case 'pricing':
        return { title: 'SERVICE MODULES', subtitle: 'Monetization & Tier Mgmt', icon: <FaTags /> };
      case 'workQueue':
        return { title: 'WORK PIPELINE', subtitle: 'Active Operations & Task Sync', icon: <FaListUl /> };
      default:
        return { title: 'CONTROL CENTER', subtitle: 'System Management', icon: <FaShieldAlt /> };
    }
  };

  const { title, subtitle, icon } = getTabInfo();

  return (
    <header className="mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
      {/* TOP UTILITY BAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-cyan-500/10 pb-6 mb-8 gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-cyan-500/5 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-cyan-500/5 translate-y-12 group-hover:translate-y-0 transition-transform duration-500"></div>
            <div className="relative z-10">{icon}</div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[10px] text-cyan-500/70 uppercase tracking-[0.2em] font-bold">Terminal // Secure Uplink</span>
            </div>
            <h2 className="text-white font-medium text-[10px] tracking-widest uppercase">
              Authorized Access: <span className="text-cyan-400 font-bold">{identity.alias}</span>
            </h2>
          </div>
        </div>

        {/* UNIFIED STATUS HUB */}
        <div className="flex flex-wrap items-center gap-x-12 gap-y-4 lg:gap-16">
          <div className="flex flex-col gap-1.5">
            <span className="text-[8px] text-cyan-500/30 uppercase tracking-[0.3em] font-black">System Vitality</span>
            <div className="flex items-center gap-3">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className={`w-1 h-2.5 rounded-sm ${i < 5 ? 'bg-cyan-500/60' : 'bg-cyan-500/10'}`}></div>)}
              </div>
              <span className="text-[9px] text-cyan-400 font-mono tracking-[0.2em] uppercase font-bold">Nominal // Stable</span>
            </div>
          </div>

          <div className="hidden sm:block w-[1px] h-8 bg-cyan-500/10"></div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[8px] text-cyan-500/30 uppercase tracking-[0.3em] font-black">Temporal Drift</span>
            <div className="flex items-center gap-3">
              <div className="bg-cyan-500/10 p-1 rounded-sm">
                <FaSyncAlt className="text-[10px] text-cyan-400 animate-spin-slow" />
              </div>
              <span className="text-[9px] text-cyan-400 font-mono tracking-[0.2em] uppercase font-bold">
                {identity.lastSync ? new Date(identity.lastSync).toLocaleTimeString() : "SYNC REQ"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN TITLE AREA + INTEGRATED ACTION */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
        <div className="relative">
          <div className="absolute -left-4 top-0 bottom-0 w-1 bg-cyan-500 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.5)]"></div>
          <div className="pl-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white italic uppercase tracking-tighter mb-2">
              {title}
            </h1>
            <p className="text-xs md:text-sm text-cyan-700/80 uppercase tracking-[0.3em] font-bold">
              {subtitle}
            </p>
          </div>
        </div>

        {activeTab !== 'overview' && activeTab !== 'projects' && (
          <div className="shrink-0">
            <button
              onClick={handleSaveIdentity}
              disabled={saving}
              className="w-full lg:w-auto min-w-[200px] border border-cyan-500/50 hover:border-cyan-400 bg-cyan-500/5 hover:bg-cyan-500 text-cyan-400 hover:text-black font-black px-8 py-4 rounded-sm text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all group shadow-[0_0_15px_rgba(6,182,212,0.1)] hover:shadow-[0_0_25px_rgba(6,182,212,0.3)] disabled:opacity-50"
            >
              <div className="relative h-4 w-4">
                {saving ? (
                  <FaSpinner className="animate-spin absolute inset-0" />
                ) : (
                  <FaSyncAlt className="group-hover:rotate-180 transition-transform duration-500 absolute inset-0" />
                )}
              </div>
              <span>{saving ? "SYNCING DATA..." : "COMMIT CHANGES"}</span>
            </button>
          </div>
        )}
      </div>

      {/* SYNC MESSAGE POPUP (Optional or integrated) */}
      {syncMessage.message && (
        <div className={`mt-6 p-4 border rounded text-[10px] font-bold uppercase tracking-widest flex items-center gap-3 animate-in zoom-in-95 duration-300 ${syncMessage.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}>
          <div className={`w-2 h-2 rounded-full ${syncMessage.type === 'success' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
          {syncMessage.message}
        </div>
      )}
    </header>
  );
}