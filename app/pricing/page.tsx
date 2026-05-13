"use client";
import React, { useState, useEffect } from "react";
import { FaCheck, FaRocket, FaGem, FaCrown, FaStar } from "react-icons/fa";
import BookingModal from "@/components/BookingModal";

interface Plan {
  name: string;
  price: string;
  level: string;
  features: string[];
}

const planStyles: { [key: string]: { icon: React.ReactNode; accent: string; btnClass: string; borderClass: string; popular?: boolean } } = {
  Scout: {
    icon: <FaRocket className="text-sky-400" />,
    accent: "text-sky-400",
    btnClass: "bg-white/5 hover:bg-white/10 border border-white/[0.08] text-white",
    borderClass: "border-white/[0.08] hover:border-sky-500/30",
  },
  Vanguard: {
    icon: <FaGem className="text-violet-400" />,
    accent: "text-violet-400",
    btnClass: "bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-500/20",
    borderClass: "border-violet-500/30 shadow-[0_0_40px_rgba(139,92,246,0.1)]",
    popular: true,
  },
  Titan: {
    icon: <FaCrown className="text-amber-400" />,
    accent: "text-amber-400",
    btnClass: "bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/20",
    borderClass: "border-amber-500/20 hover:border-amber-500/40",
  },
};

export default function Pricing() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePlan, setActivePlan] = useState<Plan | null>(null);

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const res = await fetch('/api/profile');
        const contentType = res.headers.get("content-type");

        if (!res.ok || !contentType || !contentType.includes("application/json")) {
          const errorText = await res.text();
          throw new Error(`Fetch failed with status ${res.status}: ${errorText.substring(0, 100)}`);
        }

        const data = await res.json();
        if (data.success) {
          setPlans(data.data.pricing);
        }
      } catch (err) {
        console.error("Failed to fetch pricing:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPricing();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen w-full bg-deep-bg flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-deep-bg font-sans select-none overflow-x-hidden relative text-white pt-28 md:pt-36 pb-16">

      {/* Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto section-padding relative z-10">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-3">Pricing</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white mb-4">
            Service <span className="text-gradient-primary">Plans</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Choose a plan that fits your project scope and budget.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {plans.map((plan, i) => {
            const style = planStyles[plan.name] || planStyles.Scout;
            return (
              <div
                key={i}
                className={`relative glass-card p-6 md:p-8 flex flex-col transition-all duration-500 hover:-translate-y-1 ${style.borderClass}`}
              >
                {/* Popular Badge */}
                {style.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="flex items-center gap-1.5 px-4 py-1.5 bg-violet-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg shadow-violet-500/30">
                      <FaStar size={8} /> Most Popular
                    </div>
                  </div>
                )}

                {/* Icon & Level */}
                <div className="flex items-center justify-between mb-6">
                  <div className="text-2xl">{style.icon}</div>
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 bg-white/5 px-3 py-1 rounded-full border border-white/[0.06]">
                    {plan.level}
                  </span>
                </div>

                {/* Plan Name & Price */}
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <div className={`text-3xl md:text-4xl font-black mb-8 ${style.accent}`}>
                  {plan.price}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                      <FaCheck size={12} className="text-green-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                {/* Button */}
                <button
                  onClick={() => setActivePlan(plan)}
                  className={`w-full py-3.5 rounded-xl font-semibold transition-all duration-300 text-sm ${style.btnClass}`}
                >
                  Get Started
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <BookingModal
        isOpen={activePlan !== null}
        onClose={() => setActivePlan(null)}
        plan={activePlan}
      />
    </main>
  );
}
