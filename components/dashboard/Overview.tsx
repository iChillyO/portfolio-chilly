import { FaShieldAlt, FaDatabase, FaGlobe, FaExternalLinkAlt, FaImages, FaTags, FaListUl, FaCogs } from "react-icons/fa";
import { ProfileData } from "@/types";

interface OverviewProps {
  identity: ProfileData | null;
  setActiveTab: (tab: string) => void;
}

export default function Overview({ identity, setActiveTab }: OverviewProps) {
  if (!identity) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }

  const stats = [
    { label: "Status", value: "Online", icon: <FaShieldAlt />, color: "text-green-400" },
    { label: "Database", value: "Connected", icon: <FaDatabase />, color: "text-violet-400" },
    { label: "Public Site", value: "Live", icon: <FaGlobe />, color: "text-sky-400" },
    { label: "Projects", value: `${identity.workQueue?.length || 0} active`, icon: <FaListUl />, color: "text-amber-400" },
  ];

  const quickLinks = [
    { label: "Projects", tab: "projects", icon: <FaImages /> },
    { label: "Identity", tab: "identity", icon: <FaShieldAlt /> },
    { label: "Skills", tab: "skills", icon: <FaCogs /> },
    { label: "Pricing", tab: "pricing", icon: <FaTags /> },
    { label: "Work Queue", tab: "workQueue", icon: <FaListUl /> },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 hover:border-violet-500/20 transition-all">
            <div className={`text-lg mb-3 ${stat.color}`}>{stat.icon}</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">{stat.label}</div>
            <div className="text-sm font-semibold text-white">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {quickLinks.map((link, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(link.tab)}
              className="flex flex-col items-center gap-2 p-4 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:border-violet-500/30 hover:bg-violet-500/5 text-slate-400 hover:text-violet-400 transition-all group"
            >
              <span className="text-lg">{link.icon}</span>
              <span className="text-[10px] font-medium tracking-wide">{link.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Profile Summary</h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Alias</span>
              <span className="text-white font-medium">{identity.alias}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Designation</span>
              <span className="text-white font-medium">{identity.designation}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Status Mode</span>
              <span className="text-violet-400 font-medium">{identity.statusMode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Last Sync</span>
              <span className="text-slate-300 font-mono text-[10px]">{identity.lastSync ? new Date(identity.lastSync).toLocaleString() : 'Never'}</span>
            </div>
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4">System Info</h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Framework</span>
              <span className="text-white font-medium">Next.js 16</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Database</span>
              <span className="text-white font-medium">MongoDB (Mongoose 9)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Auth</span>
              <span className="text-white font-medium">NextAuth v4</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">CDN</span>
              <span className="text-white font-medium">Cloudinary</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
