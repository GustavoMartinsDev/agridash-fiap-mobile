/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./App.tsx", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        "farm-green": {
          50: "#e6f2d6", // bg-green-100
          800: "#4e7934", // text-green-800
        },
        "farm-amber": {
          400: "#b2a177", // border-amber-400 (disabled button)
          700: "#7c6f57", // text-amber-700
        },
        "farm-red": {
          600: "#c0392b", // border-red-600
        },
        "bg-primary": "#e3e5e9",
        // Success (Verde)
        success: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
        },
        // Brand (Azul)
        brand: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        // Warning (Amarelo/Laranja)
        warning: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
        // Danger (Vermelho)
        danger: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
        },
        // FIAP (Rosa/Magenta)
        fiap: {
          50: "#fef7f7",
          100: "#fdeaea",
          200: "#fbc7d1",
          300: "#f89eb5",
          400: "#f4749a",
          500: "#f04d82",
          600: "#ed145b",
          700: "#d10e4a",
          800: "#b50c3e",
          900: "#9a0a35",
        },
        // Neutral (Cinza)
        neutral: {
          50: "#f3f4f6",
          100: "#e5e7eb",
          200: "#d1d5db",
          300: "#9ca3af",
          400: "#6b7280",
          500: "#4b5563",
          600: "#374151",
          700: "#27303a",
          800: "#23272f",
          900: "#212529",
        },
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
