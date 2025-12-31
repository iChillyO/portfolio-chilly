import { FaShieldAlt, FaDatabase, FaMicrochip, FaGlobe, FaExternalLinkAlt, FaSpinner } from "react-icons/fa";
import { ProfileData } from "@/types";

interface OverviewProps {
  identity: ProfileData | null;
  setActiveTab: (tab: string) => void;
}

export default function Overview({ identity, setActiveTab }: OverviewProps) {
  
  if (!identity) {
    return (
      <div className="flex items-center justify-center h-64 w-full text-cyan-500 gap-4">
        <FaSpinner className="animate-spin text-4xl" />
        <span className="font-mono tracking-widest text-sm animate-pulse">LOADING SYSTEM DATA...</span>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
           { icon: <FaShieldAlt />, label: "System Status", val: "OPERATIONAL", sub: identity.statusMode ? identity.statusMode.split(' ')[0] : 'N/A' },
           { icon: <FaDatabase />, label: "Database Link", val: "STABLE", sub: "Connected" },
           { icon: <FaMicrochip />, label: "Neural Core", val: "ACTIVE", sub: "v2.4.0" },
           { icon: <FaGlobe />, label: "Public Traffic", val: "ONLINE", sub: "Port 3000" }
        ].map((card, i) => (
          <div key={i} className="bg-black/40 backdrop-blur border border-cyan-500/10 p-8 rounded hover:border-cyan-500/40 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 text-[10px] text-gray-700 font-bold opacity-30">0{i+1}</div>
            <div className="text-3xl mb-6 text-cyan-400 group-hover:scale-110 transition-transform">{card.icon}</div>
            <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">{card.label}</div>
            <div className="text-2xl font-bold text-white uppercase tracking-wider">{card.val}</div>
            <div className="text-xs font-mono text-gray-500">{card.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-black/40 backdrop-blur border border-cyan-500/10 p-10 rounded">
          <div className="flex items-center gap-4 mb-8 border-b border-white/5 pb-4">
             <h3 className="text-white font-bold uppercase tracking-widest text-lg">System Quick Links</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => setActiveTab('projects')} className="bg-transparent border border-cyan-500/20 hover:bg-cyan-500/10 hover:border-cyan-500/50 text-gray-300 hover:text-white py-6 px-6 rounded text-xs font-bold uppercase tracking-wider text-left flex justify-between items-center group transition-all">
              Edit Portfolio <FaExternalLinkAlt className="opacity-0 group-hover:opacity-100 transition-opacity text-cyan-500"/>
            </button>
            <button onClick={() => setActiveTab('identity')} className="bg-transparent border border-cyan-500/20 hover:bg-cyan-500/10 hover:border-cyan-500/50 text-gray-300 hover:text-white py-6 px-6 rounded text-xs font-bold uppercase tracking-wider text-left flex justify-between items-center group transition-all">
              Update Identity <FaExternalLinkAlt className="opacity-0 group-hover:opacity-100 transition-opacity text-cyan-500"/>
            </button>
          </div>
        </div>
        <div className="bg-black/40 backdrop-blur border border-cyan-500/10 p-10 rounded">
           <div className="flex items-center gap-4 mb-8 border-b border-white/5 pb-4">
             <h3 className="text-white font-bold uppercase tracking-widest text-lg">Database Telemetry</h3>
          </div>
           <div className="space-y-5 text-xs font-mono">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 tracking-widest">DB_VERSION</span>
                <span className="text-green-400 font-bold tracking-widest">MDB_9.0.2_STABLE</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 tracking-widest">LAST_SYNC</span>
                <span className="text-cyan-400 font-bold tracking-widest">{identity.lastSync ? new Date(identity.lastSync).toLocaleTimeString() : 'N/A'}</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}