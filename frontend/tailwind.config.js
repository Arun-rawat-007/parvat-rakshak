/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkbg: "#0B0F19",
        darkcard: "#111827",
        borderdark: "#1F2937",
        hazardRed: "#EF4444",
        hazardOrange: "#F97316",
        hazardYellow: "#FACC15",
        safeGreen: "#10B981",
        accentBlue: "#38BDF8"
      }
    },
  },
  plugins: [],
}