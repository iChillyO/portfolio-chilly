import { FaSave, FaSpinner } from "react-icons/fa";
import { ProfileData } from "@/types";

interface HeaderProps { activeTab: string; saving: boolean; handleSaveIdentity: () => void; identity: ProfileData; syncMessage: { message: string; type: "success" | "error" | "" }; }

export default function Header({ activeTab, saving, handleSaveIdentity, identity, syncMessage }: HeaderProps) {
  const info: Record<string, { title: string; sub: string }> = {
    overview: { title: "Overview", sub: "Dashboard summary" }, identity: { title: "Profile", sub: "Your identity info" },
    protocols: { title: "Protocols", sub: "Terms & legal" }, projects: { title: "Projects", sub: "Manage portfolio" },
    pricing: { title: "Pricing", sub: "Service plans" }, workQueue: { title: "Work Queue", sub: "Active tasks" },
    skills: { title: "Skills", sub: "Manage categories & skills on /skills page" }, "social-links": { title: "Socials", sub: "Public links" },
  };
  const { title, sub } = info[activeTab] || { title: "Dashboard", sub: "" };

  return (
    <header className="shrink-0 border-b border-white/[0.04] bg-surface/80 backdrop-blur-md px-5 py-3.5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-lg font-bold text-pearl">{title}</h1><p className="text-[11px] text-pearl/30 mt-0.5">{sub}</p></div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-pearl/25 font-mono"><span className="w-1.5 h-1.5 bg-green-500 rounded-full" />{identity.lastSync ? new Date(identity.lastSync).toLocaleTimeString() : "—"}</div>
          {activeTab !== 'overview' && activeTab !== 'projects' && (
            <button onClick={handleSaveIdentity} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 bg-cerulean hover:bg-cerulean/90 disabled:bg-cerulean/50 text-white text-xs font-medium rounded-lg transition-all shadow-sm shadow-cerulean/20 disabled:cursor-not-allowed">
              {saving ? <FaSpinner className="animate-spin" size={11} /> : <FaSave size={11} />}{saving ? "Saving..." : "Save"}
            </button>
          )}
        </div>
      </div>
      {syncMessage.message && (
        <div className={`mt-3 px-3.5 py-2 rounded-lg text-[11px] font-medium flex items-center gap-2 ${syncMessage.type === 'success' ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${syncMessage.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />{syncMessage.message}
        </div>
      )}
    </header>
  );
}
