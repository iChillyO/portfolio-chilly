"use client";
import { useState, useEffect } from "react";
import { FaClock, FaCheckCircle, FaSpinner } from "react-icons/fa";
import { WorkQueueItem } from "@/types";

export default function WorkQueue() {
  const [workQueue, setWorkQueue] = useState<WorkQueueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try { const res = await fetch('/api/profile'); const data = await res.json(); if (data.success && data.data.workQueue) setWorkQueue(data.data.workQueue); }
      catch (error) { console.error(error); } finally { setIsLoading(false); }
    })();
  }, []);

  const statusConfig: Record<string, { color: string; bg: string; border: string; bar: string; icon: React.ReactNode }> = {
    Processing: { color: "text-cerulean", bg: "bg-cerulean/10", border: "border-cerulean/20", bar: "bg-cerulean", icon: <FaSpinner className="animate-spin" /> },
    Completed: { color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20", bar: "bg-green-500", icon: <FaCheckCircle /> },
    Queued: { color: "text-pearl/40", bg: "bg-white/[0.04]", border: "border-white/[0.06]", bar: "bg-pearl/20", icon: <FaClock /> },
  };

  return (
    <main className="min-h-screen bg-deep-bg font-sans select-none overflow-x-hidden relative text-pearl page-top pb-12">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-galaxy/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="max-w-4xl mx-auto section-padding relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-pearl">Work <span className="text-gradient-primary">Queue</span></h1>
            <div className="flex items-center gap-2 text-xs text-pearl/40 mt-1"><span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /> Online</div>
          </div>
          <div className="glass-card px-4 py-2.5 flex items-center gap-2.5">
            <div><div className="text-[10px] text-pearl/40">Availability</div><div className="text-cerulean font-medium text-xs">Open for Commissions</div></div>
            <div className="w-2.5 h-2.5 bg-cerulean rounded-full shadow-[0_0_8px_rgba(74,140,255,0.5)] animate-pulse" />
          </div>
        </div>

        <div className="hidden md:grid grid-cols-[2fr_1fr_1.5fr] gap-4 px-5 py-2 text-[10px] uppercase tracking-widest text-pearl/30 font-medium">
          <span>Project</span><span className="text-center">Status</span><span className="text-right">Progress</span>
        </div>

        <div className="space-y-3 mt-2">
          {isLoading ? <div className="flex items-center justify-center h-32"><div className="w-10 h-10 border-2 border-cerulean/30 border-t-cerulean rounded-full animate-spin" /></div>
          : workQueue.length === 0 ? <div className="text-center py-16 text-pearl/30">No items in the queue.</div>
          : workQueue.map((item, idx) => {
            const cfg = statusConfig[item.status] || statusConfig.Queued;
            return (
              <div key={idx} className="glass-card-hover p-4 flex flex-col md:grid md:grid-cols-[2fr_1fr_1.5fr] items-center gap-3">
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${cfg.bg} ${cfg.color} border ${cfg.border}`}>{cfg.icon}</div>
                  <div className="min-w-0"><div className="text-pearl font-medium text-sm truncate">{item.project}</div><div className="text-[10px] text-pearl/30 font-mono">{item.type} &bull; {item.id}</div></div>
                </div>
                <div className="flex justify-center w-full md:w-auto"><span className={`px-3 py-1 rounded-full text-[10px] font-medium border ${cfg.bg} ${cfg.color} ${cfg.border}`}>{item.status}</span></div>
                <div className="flex flex-col gap-1.5 w-full">
                  <div className="flex justify-between text-[10px] text-pearl/30"><span>Progress</span><span className="text-pearl font-medium">{item.progress}%</span></div>
                  <div className="w-full h-1 bg-white/[0.04] rounded-full overflow-hidden"><div className={`h-full ${cfg.bar} rounded-full transition-all duration-700`} style={{ width: `${item.progress}%` }} /></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
