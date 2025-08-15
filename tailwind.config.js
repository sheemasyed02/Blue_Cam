/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#faf8f5",
        gold: "#d4af37",
        charcoal: "#2c2c2c",
        peach: "#f4e4d1",
        // Enhanced vintage modern polished palette
        bronze: "#cd7f32",
        copper: "#b87333",
        sepia: "#8b4513",
        black: "#1a1a1a",
        vintage: {
          50: "#fefdfb",
          100: "#faf8f5",
          200: "#f5f1eb",
          300: "#ede5d8",
          400: "#e0d0ba",
          500: "#d4af37",
          600: "#c19b26",
          700: "#a6841f",
          800: "#8a6d1a",
          900: "#6b5315"
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
