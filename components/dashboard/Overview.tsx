import { FaShieldAlt, FaDatabase, FaGlobe, FaListUl, FaImages, FaTags, FaCogs } from "react-icons/fa";
import { ProfileData } from "@/types";

interface OverviewProps { identity: ProfileData | null; setActiveTab: (tab: string) => void; }

export default function Overview({ identity, setActiveTab }: OverviewProps) {
  if (!identity) return <div className="flex items-center justify-center h-48"><div className="w-10 h-10 border-2 border-cerulean/30 border-t-cerulean rounded-full animate-spin" /></div>;

  const stats = [
    { label: "Database", value: "Connected", color: "text-cerulean" },
    { label: "Site", value: "Live", color: "text-lilac" },
    { label: "Queue", value: `${identity.workQueue?.length || 0} items`, color: "text-gold" },
    { label: "Projects", value: `${identity.experienceLog?.length || 0}`, color: "text-pearl" },
  ];

  const links = [
    { label: "Projects", tab: "projects", icon: <FaImages /> },
    { label: "Profile", tab: "identity", icon: <FaShieldAlt /> },
    { label: "Skills", tab: "skills", icon: <FaCogs /> },
    { label: "Pricing", tab: "pricing", icon: <FaTags /> },
    { label: "Queue", tab: "workQueue", icon: <FaListUl /> },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <div key={i} className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4">
            <div className="text-[10px] text-pearl/30 uppercase tracking-widest mb-1">{s.label}</div>
            <div className={`text-sm font-semibold ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>
      <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-5">
        <h3 className="text-sm font-semibold text-pearl mb-3">Quick Actions</h3>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {links.map((l, i) => (
            <button key={i} onClick={() => setActiveTab(l.tab)} className="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:border-cerulean/20 hover:bg-cerulean/5 text-pearl/40 hover:text-cerulean transition-all">
              <span className="text-base">{l.icon}</span><span className="text-[9px] font-medium">{l.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-pearl mb-3">Profile</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between"><span className="text-pearl/30">Alias</span><span className="text-pearl">{identity.alias}</span></div>
            <div className="flex justify-between"><span className="text-pearl/30">Role</span><span className="text-pearl">{identity.designation}</span></div>
            <div className="flex justify-between"><span className="text-pearl/30">Status</span><span className="text-cerulean">{identity.statusMode}</span></div>
          </div>
        </div>
        <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-pearl mb-3">System</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between"><span className="text-pearl/30">Framework</span><span className="text-pearl">Next.js 16</span></div>
            <div className="flex justify-between"><span className="text-pearl/30">DB</span><span className="text-pearl">MongoDB</span></div>
            <div className="flex justify-between"><span className="text-pearl/30">Last Sync</span><span className="text-pearl font-mono text-[10px]">{identity.lastSync ? new Date(identity.lastSync).toLocaleString() : 'Never'}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
