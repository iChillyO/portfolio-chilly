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
        const res = await fetch('/api/profile');
        const contentType = res.headers.get("content-type");

        if (!res.ok || !contentType || !contentType.includes("application/json")) {
          const errorText = await res.text();
          throw new Error(`Fetch failed with status ${res.status}: ${errorText.substring(0, 100)}`);
        }

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

  const statusConfig = {
    Processing: {
      color: "text-violet-400",
      bg: "bg-violet-500/10",
      border: "border-violet-500/20",
      barColor: "bg-violet-500",
      icon: <FaSpinner className="animate-spin" />,
    },
    Completed: {
      color: "text-green-400",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
      barColor: "bg-green-500",
      icon: <FaCheckCircle />,
    },
    Queued: {
      color: "text-slate-400",
      bg: "bg-slate-500/10",
      border: "border-slate-500/20",
      barColor: "bg-slate-500",
      icon: <FaClock />,
    },
  };

  return (
    <main className="min-h-screen w-full bg-deep-bg font-sans select-none overflow-x-hidden relative text-white pt-28 md:pt-36 pb-16">

      {/* Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto section-padding relative z-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <p className="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-3">Status Board</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white mb-3">
              Work <span className="text-gradient-primary">Queue</span>
            </h1>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              System Online
            </div>
          </div>

          {/* Availability Badge */}
          <div className="glass-card px-5 py-3 flex items-center gap-3">
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest">Availability</div>
              <div className="text-violet-400 font-semibold text-sm">Open for Commissions</div>
            </div>
            <div className="w-3 h-3 bg-violet-400 rounded-full shadow-[0_0_10px_rgba(139,92,246,0.6)] animate-pulse" />
          </div>
        </div>

        {/* Queue List */}
        <div className="space-y-4">
          {/* Table Header (desktop only) */}
          <div className="hidden md:grid grid-cols-[2fr_1fr_1.5fr] gap-4 px-6 py-2 text-[10px] uppercase tracking-widest text-slate-500 font-medium">
            <span>Project</span>
            <span className="text-center">Status</span>
            <span className="text-right">Progress</span>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-40 gap-4">
              <div className="w-12 h-12 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
              <span className="text-violet-400 font-mono text-sm tracking-widest">Loading queue...</span>
            </div>
          ) : workQueue.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-500 text-lg">No items in the queue.</p>
            </div>
          ) : (
            workQueue.map((item, idx) => {
              const config = statusConfig[item.status as keyof typeof statusConfig] || statusConfig.Queued;
              return (
                <div
                  key={idx}
                  className="group glass-card-hover p-4 md:p-6 flex flex-col md:grid md:grid-cols-[2fr_1fr_1.5fr] items-center gap-4"
                >
                  {/* Project Info */}
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${config.bg} ${config.color} border ${config.border}`}>
                      {config.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-semibold text-sm truncate">{item.project}</div>
                      <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mt-0.5">
                        {item.type} &bull; {item.id}
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex justify-center w-full md:w-auto">
                    <span className={`px-3.5 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${config.bg} ${config.color} ${config.border}`}>
                      {item.status}
                    </span>
                  </div>

                  {/* Progress */}
                  <div className="flex flex-col gap-2 w-full">
                    <div className="flex justify-between text-[10px] font-medium text-slate-500">
                      <span>Progress</span>
                      <span className="text-white">{item.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${config.barColor} rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}
