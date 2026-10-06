import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        feather: "#58CC02", // primary green
        "feather-shadow": "#58A700",
        mask: "#89E219", // progress-bar highlight, accents
        macaw: "#1CB0F6", // secondary CTA, selected state, links, gems
        "macaw-shadow": "#1899D6",
        sky: "#DDF4FF", // selected card background
        "sky-border": "#84D8FF",
        cardinal: "#FF4B4B", // hearts, wrong answer, destructive
        "cardinal-shadow": "#EA2B2B",
        bee: "#FFC800", // XP, completed/gold nodes
        "bee-shadow": "#E5B400",
        fox: "#FF9600", // streak flame
        "fox-shadow": "#CC7900",
        beetle: "#CE82FF", // Legendary, league accents
        "beetle-shadow": "#A568CC",
        snow: "#FFFFFF", // primary background from duolingo.com
        "snow-dark": "#131F24", // dark mode background from duolingo.com
        polar: "#F7F7F7", // subtle backgrounds
        swan: "#E5E5E5", // borders, locked nodes, disabled buttons
        hare: "#AFAFAF", // disabled text, icons
        wolf: "#777777", // secondary text
        eel: "#4B4B4B", // primary text
        "black-text": "#3C3C3C", // duolingo.com black-text
        "correct-bg": "#D7FFB8", // feedback bar correct
        "wrong-bg": "#FFDFE0", // feedback bar wrong
      },
      fontFamily: {
        // We'll set up Nunito via CSS variables in layout
        sans: ["var(--font-nunito)", "sans-serif"],
      },
      letterSpacing: {
        wide: "0.02em",
        wider: "0.05em",
        widest: "0.08em",
      },
      boxShadow: {
        // For standard 3D buttons
        "bottom-4": "0 4px 0 0",
      },
      translate: {
        "4px": "4px",
      },
    },
  },
  plugins: [],
};
export default config;
