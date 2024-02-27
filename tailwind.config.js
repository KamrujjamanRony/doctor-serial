/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: ["light", {
      mytheme: {
        "primary": "#06B2B6",
        "secondary": "#424242",
        "accent": "#606060",
        "neutral": "#3d4451",
        "base-100": "#ffffff",
      },
    },],
  },
  darkMode: "class",
  plugins: [require("daisyui")]
}