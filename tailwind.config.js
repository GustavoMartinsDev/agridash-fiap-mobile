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
      },
    },
  },
  plugins: [],
};
