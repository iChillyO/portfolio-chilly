import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    {
      pattern: /bg-(red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|gray|slate|zinc)-(400|500|600|700)/,
    },
    {
      pattern: /text-(red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|gray|slate|zinc)-(400|500|600|700)/,
    },
  ],
  theme: {
    extend: {
      colors: {
        "deep-bg": "#000000",
        "card-grad-start": "#ffffff",
        "card-grad-end": "#eef2ff",
        "accent-blue": "#4f46e5",
        "text-main": "#1f2937",
        "text-muted": "#6b7280",
      },
      backgroundImage: {},
      // --- NEW ANIMATION LOGIC ---
      keyframes: {
        // Simple fade from transparent to visible
        reveal: {
          "0%": { opacity: "0", filter: "blur(5px)" },
          "100%": { opacity: "1", filter: "blur(0px)" },
        },
      },
      animation: {
        // Runs once ('forwards' keeps it visible at the end)
        reveal: "reveal 0.8s cubic-bezier(0.5, 0, 0, 1) forwards",
      },
    },
  },
  plugins: [],
};
export default config;