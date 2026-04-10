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
        bg: "#F7F4EF",
        surface: "#FFFFFF",
        accent: "#A87C2A",
        ink: "#1A1612",
        muted: "#8C8480",
        border: "#E5E0D8",
      },
      fontFamily: {
        sans: ["Noto Sans JP", "sans-serif"],
        dm: ["DM Sans", "sans-serif"],
        mincho: ["Shippori Mincho", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
