/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F7F4EF",
        "paper-raised": "#FFFFFF",
        ink: "#23302B",
        "ink-soft": "#57645E",
        teal: {
          DEFAULT: "#1F4740",
          dark: "#153330",
          light: "#2E5F55",
        },
        clay: {
          DEFAULT: "#C1694F",
          soft: "#E8D9CE",
        },
        line: "#DCD5C8",
      },
      fontFamily: {
        display: ["'Source Serif 4'", "Georgia", "serif"],
        body: ["'Public Sans'", "system-ui", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      borderRadius: {
        sm: "3px",
        DEFAULT: "6px",
        lg: "10px",
      },
    },
  },
  plugins: [],
};
