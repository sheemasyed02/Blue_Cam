/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // SERELUNE Brand Colors - Soft & Dreamy Palette
        serelune: {
          50: "#fef7ff",
          100: "#fceeff", 
          200: "#f8d8ff",
          300: "#f3b5ff",
          400: "#eb82ff",
          500: "#dd4fff",
          600: "#c026ff",
          700: "#9f1adb",
          800: "#8318b3",
          900: "#6b1792"
        },
        
        // Soft Pink Tones
        blush: {
          50: "#fff5f7",
          100: "#ffe3e8",
          200: "#ffccd5",
          300: "#ffa3b5",
          400: "#ff708a",
          500: "#ff3d63",
          600: "#ed1650",
          700: "#c80a41",
          800: "#a70c3e",
          900: "#8f0f3c"
        },
        
        // Moonlight Grays with Purple Undertones
        moonlight: {
          50: "#fdfbff",
          100: "#f7f3ff",
          200: "#ede5ff",
          300: "#dcc9ff",
          400: "#c5a3ff",
          500: "#a875ff",
          600: "#8b48ff",
          700: "#7c3aed",
          800: "#6b21c8",
          900: "#581c87"
        },
        
        // Pearl & Cream Tones
        pearl: {
          50: "#fefefe",
          100: "#fdfdfd",
          200: "#f9f9f9",
          300: "#f4f4f4",
          400: "#ececec",
          500: "#e0e0e0",
          600: "#c7c7c7",
          700: "#a3a3a3",
          800: "#7a7a7a",
          900: "#4a4a4a"
        },
        
        // Sunset/Golden Hour
        sunset: {
          50: "#fff9f5",
          100: "#fff1e8",
          200: "#ffe0c7",
          300: "#ffc79b",
          400: "#ffa366",
          500: "#ff8033",
          600: "#f5631f",
          700: "#cc4914",
          800: "#a33917",
          900: "#852f16"
        },
        
        // Lavender Dreams
        lavender: {
          50: "#faf8ff",
          100: "#f3eeFF",
          200: "#e9ddff",
          300: "#d4bfff",
          400: "#b794ff",
          500: "#9966ff",
          600: "#7c3aed",
          700: "#6b21c8",
          800: "#581c87",
          900: "#4c1d95"
        },
        
        // Modern Emerald for Success
        emerald: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b"
        },
        
        // Error/Warning in Rose
        rose: {
          50: "#fff1f2",
          100: "#ffe4e6",
          200: "#fecdd3",
          300: "#fda4af",
          400: "#fb7185",
          500: "#f43f5e",
          600: "#e11d48",
          700: "#be123c",
          800: "#9f1239",
          900: "#881337"
        }
      },
      fontFamily: {
        title: ['"Playfair Display"', 'serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-dreamy': 'radial-gradient(at 20% 80%, rgb(232, 121, 249) 0px, transparent 50%), radial-gradient(at 80% 0%, rgb(255, 119, 198) 0px, transparent 50%), radial-gradient(at 40% 40%, rgb(255, 194, 235) 0px, transparent 50%)',
        'gradient-serelune': 'linear-gradient(135deg, #fef7ff 0%, #fceeff 25%, #f8d8ff 50%, #f3b5ff 75%, #eb82ff 100%)',
        'gradient-moonbeam': 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 50%, transparent 70%)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(232, 121, 249, 0.25)',
        'glow': '0 0 20px rgba(232, 121, 249, 0.4)',
        'blush': '0 0 20px rgba(255, 112, 138, 0.3)',
        'lavender': '0 0 20px rgba(153, 102, 255, 0.3)',
        'dreamy': '0 8px 25px -5px rgba(232, 121, 249, 0.25), 0 10px 10px -5px rgba(255, 119, 198, 0.04)',
        'soft': '0 4px 15px 0 rgba(232, 121, 249, 0.15)',
        'inner-glow': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.15)',
        'serelune': '0 20px 40px -15px rgba(232, 121, 249, 0.3)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'sparkle': 'sparkle 2s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.7' },
          '50%': { opacity: '1' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        sparkle: {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)', opacity: '0.8' },
          '50%': { transform: 'scale(1.1) rotate(180deg)', opacity: '1' },
        },
        glowPulse: {
          '0%': { boxShadow: '0 0 5px rgba(232, 121, 249, 0.4)' },
          '100%': { boxShadow: '0 0 20px rgba(232, 121, 249, 0.8), 0 0 30px rgba(255, 119, 198, 0.4)' },
        },
      },
    },
  },
  plugins: [],
}
