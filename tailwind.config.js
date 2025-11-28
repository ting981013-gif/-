/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'glass': {
          50: 'rgba(255, 255, 255, 0.1)',
          100: 'rgba(255, 255, 255, 0.2)',
          200: 'rgba(255, 255, 255, 0.3)',
        },
        'purple': {
          400: '#a855f7',
          500: '#9333ea',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        }
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'flip': 'flip 0.6s ease-in-out',
        'fadeIn': 'fadeIn 0.5s ease-in-out',
        'slideUp': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        flip: {
          '0%': { transform: 'rotateY(0deg)' },
          '50%': { transform: 'rotateY(90deg)' },
          '100%': { transform: 'rotateY(0deg)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
