/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'playfair': ['"Playfair Display"', 'serif'],
        'dm': ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        green: {
          dark: '#0D2318',
          mid: '#1A3B2E',
          accent: '#4CAF7D',
        },
        orange: {
          brand: '#E76F51',
        },
        cream: '#F9F7F3',
      }
    },
  },
  plugins: [],
}