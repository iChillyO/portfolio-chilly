"use client";
import React, { useState, useEffect } from "react";
import { FaCheck, FaRocket, FaGem, FaCrown, FaSpinner } from "react-icons/fa";
import BookingModal from "@/components/BookingModal";

interface Plan {
  name: string;
  price: string;
  level: string;
  features: string[];
}

const planStyles: { [key: string]: { icon: React.ReactNode; color: string; btnColor: string } } = {
  Scout: {
    icon: <FaRocket />,
    color: "border-gray-500 text-gray-300",
    btnColor: "bg-gray-700 hover:bg-gray-600"
  },
  Vanguard: {
    icon: <FaGem />,
    color: "border-cyan-500 text-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.15)]",
    btnColor: "bg-cyan-600 hover:bg-cyan-500"
  },
  Titan: {
    icon: <FaCrown />,
    color: "border-yellow-500 text-yellow-400",
    btnColor: "bg-yellow-600 hover:bg-yellow-500"
  }
};

export default function Pricing() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePlan, setActivePlan] = useState<Plan | null>(null);

  const handleCloseModal = () => setActivePlan(null);

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const res = await fetch('/api/profile');
        const data = await res.json();
        if (data.success) {
          setPlans(data.data.pricing);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPricing();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen w-full bg-deep-bg flex items-center justify-center">
        <FaSpinner className="text-cyan-400 text-6xl animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-deep-bg font-sans select-none flex flex-col items-center overflow-x-hidden relative text-white pt-24 md:pt-32 pb-20 px-4">

      {/* Header */}
      <div className="text-center mb-12 md:mb-16">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white uppercase italic tracking-tighter mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          Service <span className="text-cyan-500">Modules</span>
        </h1>
        <p className="text-blue-200/60 font-mono tracking-widest text-[10px] md:text-sm uppercase">
          Select your deployment package
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl w-full">
        {plans.map((plan, i) => {
          const style = planStyles[plan.name] || planStyles.Scout;
          return (
            <div key={i} className={`relative bg-[#0a1128]/80 backdrop-blur-md border rounded-[2rem] p-6 md:p-8 flex flex-col transition-all duration-300 md:hover:-translate-y-2 hover:shadow-2xl ${style.color}`}>

              {/* Icon & Name */}
              <div className="mb-6 flex items-center justify-between">
                <div className="text-2xl md:text-3xl">{style.icon}</div>
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">
                  {plan.level}
                </span>
              </div>

              <h3 className="text-2xl md:text-3xl font-black uppercase italic mb-2">{plan.name}</h3>
              <div className="text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-cyan-400">{plan.price}</div>

              {/* Features */}
              <ul className="space-y-3 md:space-y-4 mb-8 flex-1">
                {plan.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-xs md:text-sm text-gray-300">
                    <FaCheck size={12} className="text-green-400 shrink-0" /> {feat}
                  </li>
                ))}
              </ul>

              {/* Button */}
              <button
                onClick={() => setActivePlan(plan)}
                className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-white transition-all shadow-lg text-xs md:text-sm ${style.btnColor}`}
              >
                Initiate
              </button>
            </div>
          );
        })}
      </div>

      <BookingModal
        isOpen={activePlan !== null}
        onClose={handleCloseModal}
        plan={activePlan}
      />

    </main>
  );
}