import { FaSave, FaSpinner, FaTerminal, FaFileContract, FaTags, FaListUl, FaChartLine, FaShieldAlt } from "react-icons/fa";
import { ProfileData } from "@/types";
import { ProfileData } from "@/types";

interface HeaderProps {
  activeTab: string;
  saving: boolean;
  handleSaveIdentity: () => void;
  identity: ProfileData;
  syncMessage: { message: string; type: "success" | "error" | "" };
}

export default function Header({ activeTab, saving, handleSaveIdentity, identity, syncMessage }: HeaderProps) {
  const getHeaderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <div className="text-[10px] text-cyan-500 uppercase tracking-[0.3em]">Security Level: Alpha</div>
            </div>
            <h1 className="text-6xl text-white font-bold mb-4">Welcome, <span className="text-cyan-400">{identity.alias}</span></h1>
            <p className="text-xs text-gray-400 max-w-2xl leading-relaxed border-l-2 border-cyan-500/30 pl-4">
              You are currently signed in to manage the account for <span className="text-white font-bold">[{identity.alias}]</span>. 
              Please note that all updates made during this session are automatically logged.
            </p>
          </div>
        );
      case 'identity':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-2 flex justify-between items-end">
            <div>
              <div className="text-[10px] text-cyan-500 uppercase tracking-[0.3em] mb-2 flex items-center gap-2"><FaTerminal /> Control Interface // Identity</div>
              <h1 className="text-6xl text-white font-black italic uppercase tracking-tighter mb-2">IDENTITY</h1>
              <p className="text-xs text-cyan-700 uppercase tracking-[0.4em] font-bold">System Identification & Biometrics</p>
            </div>
            <button onClick={handleSaveIdentity} disabled={saving} className="bg-white hover:bg-cyan-400 text-black font-bold px-8 py-4 rounded-sm uppercase tracking-[0.2em] text-xs flex items-center gap-3 transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] disabled:opacity-50">
              {saving ? <FaSpinner className="animate-spin" /> : <FaSave />} {saving ? "SYNCING..." : "COMMIT SYNC"}
            </button>
          </div>
        );
      case 'commotions':
        return (
            <div className="animate-in fade-in slide-in-from-bottom-2 flex justify-between items-end">
              <div>
                <div className="text-[10px] text-cyan-500 uppercase tracking-[0.3em] mb-2 flex items-center gap-2"><FaFileContract /> Control Interface // Commotions</div>
                <h1 className="text-6xl text-white font-black italic uppercase tracking-tighter mb-2">COMMOTIONS</h1>
                <p className="text-xs text-cyan-700 uppercase tracking-[0.4em] font-bold">Terms of Service & Protocols</p>
              </div>
              <button onClick={handleSaveIdentity} disabled={saving} className="bg-white hover:bg-cyan-400 text-black font-bold px-8 py-4 rounded-sm uppercase tracking-[0.2em] text-xs flex items-center gap-3 transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] disabled:opacity-50">
                  {saving ? <FaSpinner className="animate-spin" /> : <FaSave />} {saving ? "SYNCING..." : "COMMIT SYNC"}
              </button>
            </div>
        );
      case 'pricing':
        return (
            <div className="animate-in fade-in slide-in-from-bottom-2 flex justify-between items-end">
              <div>
                <div className="text-[10px] text-cyan-500 uppercase tracking-[0.3em] mb-2 flex items-center gap-2"><FaTags /> Control Interface // Pricing</div>
                <h1 className="text-6xl text-white font-black italic uppercase tracking-tighter mb-2">PRICING</h1>
                <p className="text-xs text-cyan-700 uppercase tracking-[0.4em] font-bold">Service Modules & Tiers</p>
              </div>
              <button onClick={handleSaveIdentity} disabled={saving} className="bg-white hover:bg-cyan-400 text-black font-bold px-8 py-4 rounded-sm uppercase tracking-[0.2em] text-xs flex items-center gap-3 transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] disabled:opacity-50">
                  {saving ? <FaSpinner className="animate-spin" /> : <FaSave />} {saving ? "SYNCING..." : "COMMIT SYNC"}
              </button>
            </div>
        );
      case 'workQueue':
        return (
            <div className="animate-in fade-in slide-in-from-bottom-2 flex justify-between items-end">
              <div>
                <div className="text-[10px] text-cyan-500 uppercase tracking-[0.3em] mb-2 flex items-center gap-2"><FaListUl /> Control Interface // Work Queue</div>
                <h1 className="text-6xl text-white font-black italic uppercase tracking-tighter mb-2">WORK QUEUE</h1>
                <p className="text-xs text-cyan-700 uppercase tracking-[0.4em] font-bold">Current Operations & Tasks</p>
              </div>
              <button onClick={handleSaveIdentity} disabled={saving} className="bg-white hover:bg-cyan-400 text-black font-bold px-8 py-4 rounded-sm uppercase tracking-[0.2em] text-xs flex items-center gap-3 transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] disabled:opacity-50">
                  {saving ? <FaSpinner className="animate-spin" /> : <FaSave />} {saving ? "SYNCING..." : "COMMIT SYNC"}
              </button>
            </div>
        );
      default:
        return null;
    }
  };

  return (
    <header className="mb-16">
      {getHeaderContent()}
    </header>
  );
}