"use client";

import { motion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      // 1. Initial State: Pushed down by 20px, but FULLY VISIBLE (No Opacity fade)
      initial={{ y: 20, opacity: 0 }}
      
      // 2. Animate: Slide up to normal position
      animate={{ y: 0, opacity: 1 }}
      
      // 3. Transition: Very quick and snappy
      transition={{ ease: "easeInOut", duration: 0.5 }}
      
      // IMPORTANT: Added 'bg-deep-bg' to ensure the page has a solid dark background
      // This prevents the "ghost text" flash effect.
      className="w-full bg-deep-bg"
    >
      {children}
    </motion.div>
  );
}