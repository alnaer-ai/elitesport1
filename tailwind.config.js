/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black: "#050609",
          gold: "#C5A35B",
          gray: "#9CA1AF",
          lightBlue: "#6FAFCE",
          deepBlue: "#0B1C30",
          ivory: "#F8F6F1",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "sans-serif",
        ],
        display: [
          '"Playfair Display"',
          "Inter",
          "ui-serif",
          "Georgia",
          "serif",
        ],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1.5rem",
          xl: "2rem",
        },
        screens: {
          sm: "600px",
          md: "768px",
          lg: "1024px",
          xl: "1280px",
          "2xl": "1440px",
        },
      },
      boxShadow: {
        glow: "0 20px 45px rgba(197, 163, 91, 0.2)",
      },
      keyframes: {
        "logo-marquee": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "tier-sheen": {
          "0%": { transform: "translateX(-40%)" },
          "100%": { transform: "translateX(120%)" },
        },
      },
      animation: {
        "logo-marquee": "logo-marquee 40s linear infinite",
        "tier-sheen": "tier-sheen 14s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
