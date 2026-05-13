"use client";
import React, { useState } from "react";
import { FaTimes, FaExclamationTriangle } from "react-icons/fa";

interface Plan {
  name: string;
  level: string;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: Plan | null;
}

export default function BookingModal({ isOpen, onClose, plan }: BookingModalProps) {
  const [formData, setFormData] = useState({
    alias: "",
    email: "",
    discord: "",
    twitter: "",
    preferredChannel: "email",
    projectCategory: "",
    budget: "500",
    timeline: "",
    missionBrief: ""
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen || !plan) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          planName: plan.name,
          planLevel: plan.level
        }),
      });

      if (res.ok) {
        setStatus("success");
        setTimeout(() => {
          onClose();
          setStatus("idle");
          setFormData({
            alias: "", email: "", discord: "", twitter: "",
            preferredChannel: "email", projectCategory: "",
            budget: "500", timeline: "", missionBrief: ""
          });
        }, 2000);
      } else {
        setStatus("error");
        setErrorMessage("Failed to send. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please check your connection.");
    }
  };

  const inputClasses = "w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:border-violet-500/50 focus:outline-none focus:bg-white/[0.05] transition-all text-sm";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl glass-card shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="p-6 border-b border-white/[0.06] flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white">Book a Service</h2>
            <div className="flex items-center gap-2 text-violet-400 text-xs font-medium mt-1">
              <span>{plan.name}</span>
              <span className="text-slate-600">&bull;</span>
              <span>{plan.level}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all">
            <FaTimes size={16} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-6">

          {/* Notice */}
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 flex gap-3 items-start">
            <FaExclamationTriangle className="text-amber-400 shrink-0 mt-0.5" size={14} />
            <p className="text-slate-300 text-xs leading-relaxed">
              Please ensure your DMs are open or that you accept friend requests on Discord for successful communication.
            </p>
          </div>

          <form id="booking-form" onSubmit={handleSubmit} className="space-y-6">

            {/* Section 1: Contact */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-violet-400 uppercase tracking-widest pb-2 border-b border-white/[0.04]">
                Contact Information
              </h3>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Name <span className="text-red-400">*</span></label>
                <input type="text" name="alias" required placeholder="Your name" value={formData.alias} onChange={handleChange} className={inputClasses} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Email</label>
                  <input type="email" name="email" placeholder="you@mail.com" value={formData.email} onChange={handleChange} className={inputClasses} />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Discord</label>
                  <input type="text" name="discord" placeholder="username" value={formData.discord} onChange={handleChange} className={inputClasses} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Twitter</label>
                  <input type="text" name="twitter" placeholder="@handle" value={formData.twitter} onChange={handleChange} className={inputClasses} />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Preferred Channel</label>
                  <select name="preferredChannel" value={formData.preferredChannel} onChange={handleChange} className={inputClasses}>
                    <option value="email">Email</option>
                    <option value="discord">Discord</option>
                    <option value="twitter">Twitter</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Project Details */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-violet-400 uppercase tracking-widest pb-2 border-b border-white/[0.04]">
                Project Details
              </h3>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Category</label>
                <input type="text" name="projectCategory" placeholder="e.g. Website, App, Design" value={formData.projectCategory} onChange={handleChange} className={inputClasses} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Budget</label>
                  <div className="relative">
                    <input type="number" name="budget" value={formData.budget} onChange={handleChange} className={inputClasses} />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">&euro;</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Timeline</label>
                  <input type="text" name="timeline" placeholder="e.g. 2 weeks" value={formData.timeline} onChange={handleChange} className={inputClasses} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="text-xs text-slate-400">Description</label>
                  <span className="text-[10px] text-slate-600">{formData.missionBrief.length}/1500</span>
                </div>
                <textarea
                  name="missionBrief"
                  rows={4}
                  maxLength={1500}
                  placeholder="Describe your project..."
                  value={formData.missionBrief}
                  onChange={handleChange}
                  className={`${inputClasses} resize-none`}
                />
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/[0.06] shrink-0">
          {status === "error" && (
            <p className="text-red-400 text-xs text-center mb-3">{errorMessage}</p>
          )}
          {status === "success" && (
            <p className="text-green-400 text-xs text-center mb-3">Sent successfully!</p>
          )}

          <button
            type="submit"
            form="booking-form"
            disabled={status === "sending" || status === "success"}
            className={`w-full py-3.5 font-semibold rounded-xl transition-all text-sm flex items-center justify-center gap-2 ${
              status === "success"
                ? "bg-green-600 text-white"
                : status === "sending"
                ? "bg-violet-600/50 text-white/70 cursor-not-allowed"
                : "bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-500/20"
            }`}
          >
            {status === "sending" ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending...
              </>
            ) : status === "success" ? (
              "Sent!"
            ) : (
              "Submit Request"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
