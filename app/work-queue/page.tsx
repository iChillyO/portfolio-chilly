"use client";
import { useState } from "react";
import { FaTasks, FaClock, FaCheckCircle, FaSpinner, FaPaperPlane, FaCircle } from "react-icons/fa";

// --- DUMMY QUEUE DATA ---
// We use "Redacted" names to look cool and professional
const queueData = [
  { id: "XJ-9", project: "E-Commerce Engine", status: "Processing", progress: 75, type: "Full Stack" },
  { id: "B-22", project: "Portfolio V3", status: "Pending", progress: 0, type: "Frontend" },
  { id: "A-01", project: "SaaS Dashboard", status: "Completed", progress: 100, type: "UI/UX" },
  { id: "C-14", project: "API Integration", status: "Queued", progress: 0, type: "Backend" },
];

export default function WorkQueue() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fake submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      alert("Transmission Sent! Check console.");
      setIsSubmitting(false);
      setFormData({ name: "", email: "", message: "" });
    }, 2000);
  };

  return (
    <main className="h-screen w-full bg-deep-bg bg-space-pattern bg-cover bg-center bg-fixed font-sans select-none flex flex-col items-center overflow-hidden relative">

      {/* BACKGROUND BLURS */}
      <div className="fixed top-0 left-0 w-full h-32 bg-gradient-to-b from-deep-bg via-deep-bg/90 to-transparent pointer-events-none z-10"></div>
      <div className="fixed bottom-0 left-0 w-full h-24 bg-gradient-to-t from-deep-bg via-deep-bg/90 to-transparent pointer-events-none z-10"></div>

      {/* --- HEADER --- */}
      <div className="max-w-7xl w-full relative z-20 shrink-0 px-4 md:px-12 mt-24 mb-8 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
            Work <span className="text-cyan-500">Queue</span>
          </h1>
          <div className="flex items-center gap-2 text-blue-200/60 font-mono text-xs uppercase tracking-widest">
            <span className="animate-pulse text-green-400">●</span> System Status: Online
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-[#0a1128]/80 backdrop-blur-md border border-cyan-500/30 px-6 py-3 rounded-xl flex items-center gap-4 shadow-[0_0_20px_rgba(34,211,238,0.1)]">
           <div className="text-right">
             <div className="text-xs text-blue-200 uppercase tracking-widest">Availability</div>
             <div className="text-cyan-400 font-bold">OPEN FOR COMMISSIONS</div>
           </div>
           <div className="w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee] animate-pulse"></div>
        </div>
      </div>

      {/* --- MAIN CONTENT GRID --- */}
      <div className="flex-1 w-full max-w-7xl px-4 md:px-12 pb-12 overflow-y-auto custom-scrollbar [mask-image:linear-gradient(to_bottom,transparent,black_5%,black_95%,transparent)]">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 pt-4 pb-24">
          
          {/* LEFT: THE QUEUE (Visual List) */}
          <div className="space-y-6">
            <h3 className="text-white font-bold uppercase tracking-widest text-sm flex items-center gap-2 border-b border-white/10 pb-4">
              <FaTasks className="text-cyan-500" /> Current Operations
            </h3>

            {/* Queue List */}
            <div className="space-y-3">
              {queueData.map((item) => (
                <div key={item.id} className="group bg-black/20 border border-white/10 p-4 rounded-xl flex items-center gap-4 hover:border-cyan-500/30 transition-all duration-300">
                  {/* Icon Status */}
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-lg
                    ${item.status === "Processing" ? "bg-blue-500/20 text-blue-400 animate-pulse" : 
                      item.status === "Completed" ? "bg-green-500/20 text-green-400" : 
                      "bg-gray-800/50 text-gray-500"}
                  `}>
                    {item.status === "Processing" ? <FaSpinner className="animate-spin" /> : 
                     item.status === "Completed" ? <FaCheckCircle /> : <FaClock />}
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-white font-bold text-sm">{item.project}</span>
                      <span className="text-xs font-mono text-cyan-500/70">ID: {item.id}</span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${item.status === "Completed" ? "bg-green-500" : "bg-cyan-500"} shadow-[0_0_10px_currentColor] transition-all duration-1000`} 
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="hidden sm:block text-xs font-mono uppercase tracking-widest text-gray-400">
                    {item.status}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 bg-cyan-950/10 border border-cyan-500/10 rounded-xl text-xs text-cyan-200/60 font-mono text-center">
              {/* // DATA REDACTED FOR CLIENT PRIVACY // */}
            </div>
          </div>

          {/* RIGHT: CONTACT TERMINAL (Form) */}
          <div className="relative">
            <div className="sticky top-0 bg-[#0a1128]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
              
              <h3 className="text-white font-bold uppercase tracking-widest text-sm flex items-center gap-2 mb-6">
                <FaPaperPlane className="text-cyan-500" /> Initialize Request
              </h3>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name Input */}
                <div className="group">
                  <label className="block text-xs text-blue-200 uppercase tracking-widest mb-2 group-focus-within:text-cyan-400 transition-colors">
                    Operator Name
                  </label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all"
                    placeholder="ENTER_NAME"
                    required
                  />
                </div>

                {/* Email Input */}
                <div className="group">
                  <label className="block text-xs text-blue-200 uppercase tracking-widest mb-2 group-focus-within:text-cyan-400 transition-colors">
                    Comms Frequency (Email)
                  </label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all"
                    placeholder="ENTER_EMAIL"
                    required
                  />
                </div>

                {/* Message Input */}
                <div className="group">
                  <label className="block text-xs text-blue-200 uppercase tracking-widest mb-2 group-focus-within:text-cyan-400 transition-colors">
                    Mission Brief
                  </label>
                  <textarea 
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    rows={4}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all resize-none custom-scrollbar"
                    placeholder="DESCRIBE_OBJECTIVES..."
                    required
                  />
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl uppercase tracking-widest transition-all duration-300 shadow-[0_0_20px_rgba(8,145,178,0.4)] hover:shadow-[0_0_40px_rgba(34,211,238,0.6)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>Processing <FaSpinner className="animate-spin" /></>
                  ) : (
                    <>Transmit Data <FaPaperPlane /></>
                  )}
                </button>
              </form>

            </div>
          </div>

        </div>
      </div>

    </main>
  );
}