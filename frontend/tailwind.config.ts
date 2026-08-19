import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#14213D",
        surface: "#F5F7FB",
        border: "#E3E7F0",
        primary: {
          DEFAULT: "#2F5FF6",
          hover: "#2149D1",
          light: "#EAF0FF",
        },
        sale: "#D64545",
        rating: "#F2A93B",
      },
      fontFamily: {
        display: ["var(--font-sora)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        card: "12px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(20, 33, 61, 0.06), 0 1px 12px rgba(20, 33, 61, 0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
