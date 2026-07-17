import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#172853",
          dark: "#0E1A3A",
          light: "#1E3570",
        },
        cream: {
          DEFAULT: "#F5F0E8",
          dark: "#EDE5D5",
          line: "#DDD3BF",
        },
        gold: {
          DEFAULT: "#C49A3C",
          light: "#E8D4A0",
          dark: "#A07D2E",
        },
        ink: {
          DEFAULT: "#1A1A2E",
          muted: "#5A5A6E",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-ibm-plex-mono)", "monospace"],
      },
      borderRadius: {
        none: "0px",
        sm: "4px",
        DEFAULT: "8px",
        lg: "12px",
        xl: "16px",
      },
      boxShadow: {
        "card": "0 1px 3px rgba(23, 40, 83, 0.08), 0 4px 12px rgba(23, 40, 83, 0.04)",
        "card-hover": "0 4px 16px rgba(23, 40, 83, 0.12), 0 8px 32px rgba(23, 40, 83, 0.06)",
        "glow-gold": "0 0 20px rgba(196, 154, 60, 0.25)",
        "glow-navy": "0 0 20px rgba(23, 40, 83, 0.15)",
        "nav": "0 2px 8px rgba(23, 40, 83, 0.1)",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-left": {
          from: { opacity: "0", transform: "translateX(-24px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "fade-in-right": {
          from: { opacity: "0", transform: "translateX(24px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "ken-burns": {
          "0%": { transform: "scale(1) translate(0, 0)" },
          "50%": { transform: "scale(1.08) translate(-1%, -1%)" },
          "100%": { transform: "scale(1) translate(0, 0)" },
        },
        "ticker": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.6s ease-out forwards",
        "fade-in-left": "fade-in-left 0.6s ease-out forwards",
        "fade-in-right": "fade-in-right 0.6s ease-out forwards",
        "scale-in": "scale-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        shimmer: "shimmer 1.5s infinite linear",
        "ken-burns": "ken-burns 12s ease-in-out infinite",
        ticker: "ticker 20s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
