/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: ['particle'],
  theme: {
    extend: {
      keyframes: {
        shine: {
          '0%': { backgroundPosition: '200% 0%' },
          '100%': { backgroundPosition: '-200% 0%' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-500px) scale(0.2)' },
          '100%': { transform: 'translateX(0px) scale(1)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(300px)', opacity: '0' },
          '100%': { transform: 'translateY(0px)', opacity: '1' },
        },
        'star-movement-bottom': {
          '0%': { transform: 'translate(0%, 0%)', opacity: '1' },
          '100%': { transform: 'translate(-100%, 0%)', opacity: '0' },
        },
        'star-movement-top': {
          '0%': { transform: 'translate(0%, 0%)', opacity: '1' },
          '100%': { transform: 'translate(100%, 0%)', opacity: '0' },
        },
        spinSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        fillSegment: {
      '0%': { transform: 'scaleX(0)', transformOrigin: 'left' },
      '100%': { transform: 'scaleX(1)', transformOrigin: 'left' },
    },
      },
      animation: {
        shine: 'shine 3.5s linear infinite',
        slideIn: 'slideIn 0.8s ease-in-out forwards',
        slideUp: 'slideUp 0.8s ease-in-out forwards',
        'star-movement-bottom': 'star-movement-bottom 2s linear infinite alternate',
        'star-movement-top': 'star-movement-top 2s linear infinite alternate',
        spinSlow: 'spinSlow 20s linear infinite',
         fillSegment: 'fillSegment 4s linear forwards',
      },
    },
  },
  plugins: [],
};
