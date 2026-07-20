/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        crimson: { DEFAULT: "#C81E3A", dark: "#9A1730" },
        ink: "#1A1310",
        ivory: "#FBF7F2",
        amber: "#E8A33D",
        pulse: "#1F6F78",
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Inter'", "sans-serif"],
      },
      keyframes: {
        ecg: {
          "0%": { strokeDashoffset: "1000" },
          "100%": { strokeDashoffset: "0" },
        },
      },
      animation: {
        ecg: "ecg 3.5s linear infinite",
      },
    },
  },
  plugins: [],
};
