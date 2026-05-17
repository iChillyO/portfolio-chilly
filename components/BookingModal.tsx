"use client";
import React, { useState } from "react";
import { FaTimes, FaExclamationTriangle } from "react-icons/fa";

interface Plan { name: string; level: string; }
interface BookingModalProps { isOpen: boolean; onClose: () => void; plan: Plan | null; }

export default function BookingModal({ isOpen, onClose, plan }: BookingModalProps) {
  const [formData, setFormData] = useState({ alias: "", email: "", discord: "", twitter: "", preferredChannel: "email", projectCategory: "", budget: "500", timeline: "", missionBrief: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen || !plan) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setStatus("sending"); setErrorMessage("");
    try {
      const res = await fetch("/api/booking", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...formData, planName: plan.name, planLevel: plan.level }) });
      if (res.ok) { setStatus("success"); setTimeout(() => { onClose(); setStatus("idle"); setFormData({ alias: "", email: "", discord: "", twitter: "", preferredChannel: "email", projectCategory: "", budget: "500", timeline: "", missionBrief: "" }); }, 2000); }
      else { setStatus("error"); setErrorMessage("Failed to send. Try again."); }
    } catch { setStatus("error"); setErrorMessage("Network error."); }
  };

  const ic = "w-full bg-white/[0.04] border border-white/[0.06] rounded-lg px-3.5 py-2.5 text-sm text-pearl placeholder-pearl/25 focus:border-cerulean/50 focus:outline-none transition-colors";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl glass-card shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="p-5 border-b border-white/[0.05] flex items-center justify-between shrink-0">
          <div><h2 className="text-base font-bold text-pearl">Book a Service</h2><div className="flex items-center gap-1.5 text-cerulean text-[11px] font-medium mt-0.5"><span>{plan.name}</span><span className="text-pearl/20">&bull;</span><span>{plan.level}</span></div></div>
          <button onClick={onClose} className="p-2 rounded-lg bg-white/5 text-pearl/50 hover:text-pearl transition-colors"><FaTimes size={14} /></button>
        </div>
        <div className="overflow-y-auto p-5 space-y-5">
          <div className="bg-gold/5 border border-gold/20 rounded-lg p-3 flex gap-2.5 items-start">
            <FaExclamationTriangle className="text-gold shrink-0 mt-0.5" size={12} />
            <p className="text-pearl/50 text-[11px] leading-relaxed">Please ensure your DMs are open on Discord for communication.</p>
          </div>
          <form id="booking-form" onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-3">
              <h3 className="text-[10px] font-medium text-cerulean uppercase tracking-widest pb-1.5 border-b border-white/[0.04]">Contact</h3>
              <div><label className="text-[11px] text-pearl/40 mb-1 block">Name *</label><input type="text" name="alias" required placeholder="Your name" value={formData.alias} onChange={handleChange} className={ic} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-[11px] text-pearl/40 mb-1 block">Email</label><input type="email" name="email" placeholder="you@mail.com" value={formData.email} onChange={handleChange} className={ic} /></div>
                <div><label className="text-[11px] text-pearl/40 mb-1 block">Discord</label><input type="text" name="discord" placeholder="username" value={formData.discord} onChange={handleChange} className={ic} /></div>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-[10px] font-medium text-cerulean uppercase tracking-widest pb-1.5 border-b border-white/[0.04]">Project</h3>
              <div><label className="text-[11px] text-pearl/40 mb-1 block">Category</label><input type="text" name="projectCategory" placeholder="Website, App..." value={formData.projectCategory} onChange={handleChange} className={ic} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-[11px] text-pearl/40 mb-1 block">Budget</label><input type="number" name="budget" value={formData.budget} onChange={handleChange} className={ic} /></div>
                <div><label className="text-[11px] text-pearl/40 mb-1 block">Timeline</label><input type="text" name="timeline" placeholder="2 weeks" value={formData.timeline} onChange={handleChange} className={ic} /></div>
              </div>
              <div><label className="text-[11px] text-pearl/40 mb-1 block">Description</label><textarea name="missionBrief" rows={3} maxLength={1500} placeholder="Describe your project..." value={formData.missionBrief} onChange={handleChange} className={`${ic} resize-none`} /></div>
            </div>
          </form>
        </div>
        <div className="p-5 border-t border-white/[0.05] shrink-0">
          {status === "error" && <p className="text-red-400 text-[11px] text-center mb-2">{errorMessage}</p>}
          {status === "success" && <p className="text-green-400 text-[11px] text-center mb-2">Sent successfully!</p>}
          <button type="submit" form="booking-form" disabled={status === "sending" || status === "success"} className={`w-full py-2.5 font-medium rounded-lg text-sm flex items-center justify-center gap-2 transition-all ${status === "success" ? "bg-green-600 text-white" : status === "sending" ? "bg-cerulean/50 text-white/70 cursor-not-allowed" : "bg-cerulean hover:bg-cerulean/90 text-deep-bg shadow-md shadow-cerulean/20"}`}>
            {status === "sending" ? <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</> : status === "success" ? "Sent!" : "Submit Request"}
          </button>
        </div>
      </div>
    </div>
  );
}
