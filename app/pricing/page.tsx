"use client";
import React, { useState, useEffect } from "react";
import { FaCheck, FaRocket, FaGem, FaCrown, FaStar } from "react-icons/fa";
import BookingModal from "@/components/BookingModal";

interface Plan { name: string; price: string; level: string; features: string[]; }

const planStyles: { [key: string]: { icon: React.ReactNode; accent: string; btnClass: string; borderClass: string; popular?: boolean } } = {
  Scout: { icon: <FaRocket className="text-cerulean" />, accent: "text-cerulean", btnClass: "bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-pearl", borderClass: "border-white/[0.06] hover:border-cerulean/30" },
  Vanguard: { icon: <FaGem className="text-lilac" />, accent: "text-lilac", btnClass: "bg-cerulean hover:bg-cerulean/90 text-deep-bg shadow-lg shadow-cerulean/20", borderClass: "border-cerulean/30 shadow-[0_0_30px_rgba(92,255,155,0.15)]", popular: true },
  Titan: { icon: <FaCrown className="text-gold" />, accent: "text-gold", btnClass: "bg-gold hover:bg-gold/90 text-deep-bg shadow-lg shadow-gold/20", borderClass: "border-gold/20 hover:border-gold/40" },
};

export default function Pricing() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePlan, setActivePlan] = useState<Plan | null>(null);

  useEffect(() => {
    (async () => {
      try { const res = await fetch('/api/profile'); const data = await res.json(); if (data.success) setPlans(data.data.pricing); }
      catch (err) { console.error(err); } finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <main className="min-h-screen bg-deep-bg flex items-center justify-center"><div className="w-10 h-10 border-2 border-cerulean/30 border-t-cerulean rounded-full animate-spin" /></main>;

  return (
    <main className="min-h-screen bg-deep-bg font-sans select-none overflow-x-hidden relative text-pearl page-top pb-12">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-galaxy/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="max-w-5xl mx-auto section-padding relative z-10">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-pearl">Service <span className="text-gradient-primary">Plans</span></h1>
          <p className="text-pearl/40 text-xs mt-1.5 max-w-sm mx-auto">Choose a plan that fits your project.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {plans.map((plan, i) => {
            const style = planStyles[plan.name] || planStyles.Scout;
            return (
              <div key={i} className={`relative glass-card p-6 flex flex-col transition-all duration-400 hover:-translate-y-1 ${style.borderClass}`}>
                {style.popular && <div className="absolute -top-2.5 left-1/2 -translate-x-1/2"><div className="flex items-center gap-1 px-3 py-1 bg-cerulean text-deep-bg text-[9px] font-bold uppercase tracking-wider rounded-full shadow-md shadow-cerulean/30"><FaStar size={7} /> Popular</div></div>}
                <div className="flex items-center justify-between mb-5"><div className="text-xl">{style.icon}</div><span className="text-[10px] font-medium text-pearl/40 bg-white/[0.04] px-2.5 py-1 rounded-full border border-white/[0.05]">{plan.level}</span></div>
                <h3 className="text-lg font-bold text-pearl mb-1">{plan.name}</h3>
                <div className={`text-2xl font-black mb-6 ${style.accent}`}>{plan.price}</div>
                <ul className="space-y-2.5 mb-6 flex-1">
                  {plan.features.map((feat, idx) => <li key={idx} className="flex items-start gap-2 text-xs text-pearl/60"><FaCheck size={10} className="text-green-400 shrink-0 mt-0.5" /><span>{feat}</span></li>)}
                </ul>
                <button onClick={() => setActivePlan(plan)} className={`w-full py-2.5 rounded-lg font-medium text-sm transition-all ${style.btnClass}`}>Get Started</button>
              </div>
            );
          })}
        </div>
      </div>
      <BookingModal isOpen={activePlan !== null} onClose={() => setActivePlan(null)} plan={activePlan} />
    </main>
  );
}
