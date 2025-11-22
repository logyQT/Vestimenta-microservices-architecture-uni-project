/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/index.html", // Update path to index.html
    "./app/**/*.{js,ts,jsx,tsx}", // Update path to match files inside app/
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ["Playfair Display", "serif"],
      },
      colors: {
        gold: {
          400: "#F4E5C3",
          500: "#D4AF37",
          600: "#B8960F",
        },
        dark: {
          900: "#0a0a0a",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
