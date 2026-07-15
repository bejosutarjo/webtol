import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: {
          950: "#07090d",
          900: "#0b0e14",
          850: "#0f131b",
          800: "#131822",
          700: "#1a212e",
          600: "#242c3b",
          500: "#333d50",
          400: "#4a5568",
        },
        accent: {
          DEFAULT: "#2f8cff",
          50: "#eaf3ff",
          100: "#d3e6ff",
          200: "#a6cbff",
          300: "#78adff",
          400: "#4f92ff",
          500: "#2f8cff",
          600: "#1c6de0",
          700: "#1554b0",
          800: "#123f80",
          900: "#0d2c58",
        },
        success: "#22c55e",
        warning: "#eab308",
        danger: "#ef4444",
        info: "#38bdf8",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(47,140,255,0.15), 0 8px 30px -8px rgba(47,140,255,0.25)",
        panel: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 20px 40px -20px rgba(0,0,0,0.6)",
      },
      backdropBlur: {
        xs: "2px",
      },
      keyframes: {
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      animation: {
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
