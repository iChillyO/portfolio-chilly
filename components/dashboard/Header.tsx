import { FaSave, FaSpinner, FaSync } from "react-icons/fa";
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
      case 'overview': return { title: 'Overview', subtitle: 'Dashboard summary and quick actions' };
      case 'identity': return { title: 'Identity', subtitle: 'Manage your profile information' };
      case 'protocols': return { title: 'Protocols', subtitle: 'Terms of service and legal' };
      case 'projects': return { title: 'Projects', subtitle: 'Manage your portfolio work' };
      case 'pricing': return { title: 'Pricing', subtitle: 'Service plans and tiers' };
      case 'workQueue': return { title: 'Work Queue', subtitle: 'Active tasks and operations' };
      case 'skills': return { title: 'Skills', subtitle: 'Manage your tech stack display' };
      case 'social-links': return { title: 'Social Links', subtitle: 'Your public contact links' };
      default: return { title: 'Dashboard', subtitle: 'Control panel' };
    }
  };

  const { title, subtitle } = getTabInfo();

  return (
    <header className="shrink-0 border-b border-white/[0.06] bg-surface/80 backdrop-blur-md px-6 md:px-8 py-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Title */}
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">{title}</h1>
          <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Last sync */}
          <div className="hidden sm:flex items-center gap-2 text-[10px] text-slate-600 font-mono">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            {identity.lastSync ? new Date(identity.lastSync).toLocaleTimeString() : "Not synced"}
          </div>

          {/* Save button (not on overview or projects) */}
          {activeTab !== 'overview' && activeTab !== 'projects' && (
            <button
              onClick={handleSaveIdentity}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-600/50 text-white text-xs font-semibold rounded-lg transition-all shadow-md shadow-violet-600/20 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <FaSpinner className="animate-spin" size={12} />
                  Saving...
                </>
              ) : (
                <>
                  <FaSave size={12} />
                  Save Changes
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Sync message */}
      {syncMessage.message && (
        <div className={`mt-4 px-4 py-2.5 rounded-lg text-xs font-medium flex items-center gap-2 animate-in fade-in duration-300 ${
          syncMessage.type === 'success'
            ? 'bg-green-500/10 border border-green-500/20 text-green-400'
            : 'bg-red-500/10 border border-red-500/20 text-red-400'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${syncMessage.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
          {syncMessage.message}
        </div>
      )}
    </header>
  );
}
