import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // === NEW PALETTE: Mint / Royal Blue / Slate ===
        // Backgrounds (Deep Slate)
        "deep-bg": "#161C2C",
        "surface": "#1E2538",
        "surface-light": "#262E45",

        // Royal Blue (kept under "galaxy" name so existing classes still work)
        "galaxy": "#1E3B8C",
        "royal": "#1E3B8C",

        // Text (Soft Pearl)
        "pearl": "#F4F6F8",

        // Primary accent — Vibrant Mint (kept under "cerulean" name)
        "cerulean": "#5CFF9B",
        "mint": "#5CFF9B",

        // Secondary accent — Antique Gold
        "gold": "#D4B679",

        // Tertiary accent — kept "lilac" pointing to royal blue for any leftover usage
        "lilac": "#1E3B8C",

        "porcelain": "#F4F6F8",
        "silver": "#EAEAEA",
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-orbitron)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'grid-pattern': 'linear-gradient(rgba(92,255,155,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(92,255,155,0.04) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '48px 48px',
      },
      keyframes: {
        reveal: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        reveal: "reveal 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in": "fade-in 0.5s ease-out forwards",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
