import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {      keyframes: {
        progress: {
          "0%": { transform: "scaleX(0)" },
          "50%": { transform: "scaleX(0.5)" },
          "100%": { transform: "scaleX(1)" },
        },
        "bounce-subtle": {
          "0%, 100%": { transform: "translateY(0)" },
          "25%": { transform: "translateY(-3px)" },
          "50%": { transform: "translateY(0)" },
          "75%": { transform: "translateY(-2px)" },
        },
      },
      animation: {
        "bounce-subtle": "bounce-subtle 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
