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
                // Reset form or close modal after a delay
                setTimeout(() => {
                    onClose();
                    setStatus("idle");
                    setFormData({
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
                }, 2000);
            } else {
                setStatus("error");
                setErrorMessage("Transmission Failed via Neural Uplink.");
            }
        } catch (error) {
            setStatus("error");
            setErrorMessage("Error in Neural Uplink Synchronization.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Container */}
            <div className="relative w-full max-w-2xl bg-[#0a1128]/95 border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(34,211,238,0.15)] overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-6 border-b border-cyan-500/20 bg-black/20 flex items-center justify-between shrink-0">
                    <div>
                        <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">
                            Initialize Protocol
                        </h2>
                        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs tracking-widest uppercase">
                            <span>{plan.name}</span>
                            <span className="text-white/30">//</span>
                            <span>{plan.level}</span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors p-2"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto p-6 space-y-8 custom-scrollbar">

                    {/* Warning Message */}
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 flex gap-3 items-start">
                        <FaExclamationTriangle className="text-yellow-500 shrink-0 mt-1" />
                        <p className="text-yellow-200/80 text-xs md:text-sm leading-relaxed">
                            Please ensure your DMs are open or that you accept friend requests on Discord to ensure successful communication establishment.
                        </p>
                    </div>

                    <form id="booking-form" onSubmit={handleSubmit} className="space-y-8">

                        {/* 01 // CLIENT IDENTIFICATION */}
                        <div className="space-y-4">
                            <h3 className="text-cyan-500 font-mono text-sm tracking-widest uppercase border-b border-cyan-500/20 pb-2">
                                01 // Client Identification
                            </h3>

                            <div className="space-y-4">
                                {/* Alias */}
                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-gray-400 mb-1">
                                        Alias / Name <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="alias"
                                        required
                                        placeholder="Your Identifier"
                                        value={formData.alias}
                                        onChange={handleChange}
                                        className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-cyan-500/50 focus:outline-none focus:bg-black/50 transition-all font-mono text-sm"
                                    />
                                </div>

                                {/* Contact Fields Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-gray-400 mb-1">
                                            Email <span className="text-gray-600">(Optional)</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="client@mail.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-cyan-500/50 focus:outline-none focus:bg-black/50 transition-all font-mono text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-gray-400 mb-1">
                                            Discord <span className="text-gray-600">(Optional)</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="discord"
                                            placeholder="username"
                                            value={formData.discord}
                                            onChange={handleChange}
                                            className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-cyan-500/50 focus:outline-none focus:bg-black/50 transition-all font-mono text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-gray-400 mb-1">
                                            Twitter <span className="text-gray-600">(Optional)</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="twitter"
                                            placeholder="@handle"
                                            value={formData.twitter}
                                            onChange={handleChange}
                                            className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-cyan-500/50 focus:outline-none focus:bg-black/50 transition-all font-mono text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-gray-400 mb-1">
                                            Preferred Channel
                                        </label>
                                        <select
                                            name="preferredChannel"
                                            value={formData.preferredChannel}
                                            onChange={handleChange}
                                            className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-cyan-500/50 focus:outline-none focus:bg-black/50 transition-all font-mono text-sm appearance-none"
                                        >
                                            <option value="email">Email</option>
                                            <option value="discord">Discord</option>
                                            <option value="twitter">Twitter</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 02 // MISSION PARAMETERS */}
                        <div className="space-y-4">
                            <h3 className="text-cyan-500 font-mono text-sm tracking-widest uppercase border-b border-cyan-500/20 pb-2">
                                02 // Mission Parameters
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-gray-400 mb-1">
                                        Project Category
                                    </label>
                                    <input
                                        type="text"
                                        name="projectCategory"
                                        placeholder="name of the category"
                                        value={formData.projectCategory}
                                        onChange={handleChange}
                                        className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-cyan-500/50 focus:outline-none focus:bg-black/50 transition-all font-mono text-sm"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-gray-400 mb-1">
                                            Allocated Budget
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                name="budget"
                                                value={formData.budget}
                                                onChange={handleChange}
                                                className="w-full bg-black/30 border border-white/10 rounded-lg pl-4 pr-8 py-3 text-white placeholder-gray-600 focus:border-cyan-500/50 focus:outline-none focus:bg-black/50 transition-all font-mono text-sm"
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-gray-400 mb-1">
                                            Estimated Timeline
                                        </label>
                                        <input
                                            type="text"
                                            name="timeline"
                                            placeholder="e.g. 2 Weeks, ASAP"
                                            value={formData.timeline}
                                            onChange={handleChange}
                                            className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-cyan-500/50 focus:outline-none focus:bg-black/50 transition-all font-mono text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-end mb-1">
                                        <label className="block text-xs uppercase tracking-widest text-gray-400">
                                            Mission Brief / Description
                                        </label>
                                        <span className="text-[10px] text-gray-600 font-mono">
                                            {formData.missionBrief.length} / 1500 CHARS
                                        </span>
                                    </div>
                                    <textarea
                                        name="missionBrief"
                                        rows={5}
                                        maxLength={1500}
                                        placeholder="Detailed overview of the project requirements..."
                                        value={formData.missionBrief}
                                        onChange={handleChange}
                                        className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-cyan-500/50 focus:outline-none focus:bg-black/50 transition-all font-mono text-sm resize-none"
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                    </form>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-cyan-500/20 bg-black/20 shrink-0">
                    {status === "error" && (
                        <p className="text-red-400 text-xs text-center mb-4 font-mono uppercase tracking-widest">
                            {errorMessage}
                        </p>
                    )}
                    {status === "success" && (
                        <p className="text-cyan-400 text-xs text-center mb-4 font-mono uppercase tracking-widest">
                            Protocol Initialized! (Message Sent)
                        </p>
                    )}

                    <button
                        type="submit"
                        form="booking-form"
                        disabled={status === "sending" || status === "success"}
                        className={`w-full py-4 text-white font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center justify-center gap-3
                            ${status === "sending" ? "bg-cyan-600/50 cursor-not-allowed" : "bg-cyan-600 hover:bg-cyan-500 shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_30px_rgba(34,211,238,0.4)]"}
                            ${status === "success" ? "bg-green-600 shadow-[0_0_20px_rgba(34,197,94,0.2)]" : ""}
                        `}
                    >
                        {status === "sending" ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Transmitting...
                            </>
                        ) : status === "success" ? (
                            "Mission Received"
                        ) : (
                            "Initialize Protocol"
                        )}
                    </button>
                </div>

            </div>
        </div>
    );
}
