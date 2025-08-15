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
        // Enhanced vintage palette
        bronze: "#8b6914",
        copper: "#b87333",
        sepia: "#704214",
        vintage: {
          50: "#fdfcfa",
          100: "#f9f6f0",
          200: "#f1ebe0",
          300: "#e4d4c1",
          400: "#d0b893",
          500: "#c5a27c",
          600: "#b8956f",
          700: "#9d7a54",
          800: "#7d6243",
          900: "#5a4e3c"
        }
      },
      fontFamily: {
        title: ['"Playfair Display"', 'serif'],
        body: ['"Lora"', 'serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
