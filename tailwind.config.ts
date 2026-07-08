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
        brand: {
          cream: "#FFFDF9",
          dark: "#2A0E06",
          orange: {
            light: "#F97316",
            DEFAULT: "#EA580C",
            dark: "#C2410C",
          },
          yellow: {
            light: "#FDE047",
            DEFAULT: "#FACC15",
            dark: "#EAB308",
          },
          brown: {
            light: "#854D0E",
            DEFAULT: "#431407",
            dark: "#1A0500",
          },
        },
      },
      fontFamily: {
        heading: ["var(--font-fredoka)", "sans-serif"],
        body: ["var(--font-nunito-sans)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
