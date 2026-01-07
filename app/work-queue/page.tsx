"use client";
import { useState, useEffect } from "react";
import { FaTasks, FaClock, FaCheckCircle, FaSpinner } from "react-icons/fa";
import { WorkQueueItem } from "@/types";

export default function WorkQueue() {
  const [workQueue, setWorkQueue] = useState<WorkQueueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchWorkQueue() {
      try {
        const res = await fetch('/api/profile'); // The workQueue is part of the profile
        const data = await res.json();
        if (data.success && data.data.workQueue) {
          setWorkQueue(data.data.workQueue);
        }
      } catch (error) {
        console.error("Failed to load work queue:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchWorkQueue();
  }, []);

  return (
    <main className="min-h-screen w-full bg-deep-bg font-sans select-none flex flex-col items-center overflow-x-hidden relative text-white">


      {/* --- HEADER --- */}
      <div className="max-w-7xl w-full relative z-20 shrink-0 px-4 md:px-12 mt-24 md:mt-32 mb-8 flex flex-col md:flex-row justify-between items-center md:items-end gap-6 text-center md:text-left">
        <div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
            Work <span className="text-cyan-500">Queue</span>
          </h1>
          <div className="flex items-center justify-center md:justify-start gap-2 text-blue-200/60 font-mono text-[10px] md:text-xs uppercase tracking-widest">
            <span className="animate-pulse text-green-400">●</span> System Status: Online
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-[#0a1128]/80 backdrop-blur-md border border-cyan-500/30 px-6 py-3 rounded-xl flex items-center gap-4 shadow-[0_0_20px_rgba(34,211,238,0.1)]">
          <div className="text-right">
            <div className="text-[10px] md:text-xs text-blue-200 uppercase tracking-widest">Availability</div>
            <div className="text-cyan-400 font-bold text-xs md:text-sm">OPEN FOR COMMISSIONS</div>
          </div>
          <div className="w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee] animate-pulse"></div>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="w-full max-w-7xl px-4 md:px-12 pb-12 z-20">
        <div className="pt-4 pb-12 md:pb-24">

          {/* THE QUEUE (Visual List) - Now Full Width */}
          <div className="space-y-6">
            <h3 className="text-white font-bold uppercase tracking-widest text-xs md:text-sm flex items-center gap-2 border-b border-white/10 pb-4">
              <FaTasks className="text-cyan-500" /> Current Operations
            </h3>

            {/* Header Row for Table-like feel */}
            <div className="hidden md:grid grid-cols-[2fr_1fr_1.5fr] gap-4 px-6 py-2 text-[10px] uppercase tracking-[0.2em] text-cyan-500/70 font-mono">
              <span>Project</span>
              <span className="text-center">Status</span>
              <span className="text-right">Progress</span>
            </div>

            {/* Queue List */}
            <div className="space-y-3">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-40 w-full text-cyan-500 gap-4">
                  <FaSpinner className="animate-spin text-3xl" />
                  <span className="font-mono tracking-widest text-xs animate-pulse">LOADING QUEUE...</span>
                </div>
              ) : workQueue.map((item, idx) => (
                <div key={idx} className="group bg-black/20 border border-white/10 p-4 md:p-6 rounded-2xl flex flex-col md:grid md:grid-cols-[2fr_1fr_1.5fr] items-center gap-4 hover:border-cyan-500/30 transition-all duration-300 hover:bg-cyan-500/[0.02] relative overflow-hidden">

                  {/* Glowing line on hover */}
                  <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                  {/* PROJECT Name & Icon */}
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className={`
                      w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0
                      ${item.status === "Processing" ? "bg-cyan-500/10 text-cyan-400 animate-pulse border border-cyan-500/20" :
                        item.status === "Completed" ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                          "bg-slate-800/50 text-slate-500 border border-slate-700/50"}
                    `}>
                      {item.status === "Processing" ? <FaSpinner className="animate-spin" /> :
                        item.status === "Completed" ? <FaCheckCircle /> : <FaClock />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-bold text-sm md:text-base truncate uppercase tracking-tight">
                        {item.project}
                      </div>
                      <div className="text-[9px] font-mono text-cyan-500/50 uppercase tracking-widest mt-0.5">
                        {item.type} // {item.id}
                      </div>
                    </div>
                  </div>

                  {/* STATUS Badge */}
                  <div className="flex justify-center w-full md:w-auto">
                    <div className={`
                      px-4 py-1.5 rounded-full text-[10px] font-mono font-black uppercase tracking-widest border
                      ${item.status === "Processing" ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.1)]" :
                        item.status === "Completed" ? "bg-green-500/10 text-green-400 border-green-500/30" :
                          "bg-slate-800/20 text-slate-500 border-slate-800/50"}
                    `}>
                      {item.status}
                    </div>
                  </div>

                  {/* PROGRESS Bar & Percentage */}
                  <div className="flex flex-col gap-2 w-full">
                    <div className="flex justify-between items-center text-[10px] font-mono text-cyan-500/70 uppercase tracking-widest">
                      <span>Sync Progress</span>
                      <span className="text-white font-bold">{item.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800/50 rounded-full overflow-hidden border border-white/5">
                      <div
                        className={`h-full ${item.status === "Completed" ? "bg-green-500" : "bg-cyan-500"} shadow-[0_0_15px_currentColor] transition-all duration-1000 ease-out`}
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </main>
  );
}