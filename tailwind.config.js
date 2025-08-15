/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#f9f6f1",
        gold: "#c5a27c",
        charcoal: "#5a4e3c",
        peach: "#e4c3a1",
      },
      fontFamily: {
        title: ['"Playfair Display"', 'serif'],
        body: ['"Lora"', 'serif'],
      },
    },
  },
  plugins: [],
}
