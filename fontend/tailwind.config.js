/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./store/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0a0a0a",
      },
      fontFamily: {
        sans: ["Inter", "Kantumruy Pro", "ui-sans-serif", "system-ui", "sans-serif"],
        khmer: ["Kantumruy Pro", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
