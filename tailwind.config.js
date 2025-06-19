/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cf-primary': '#006494',
        'cf-secondary': '#F5F5F5',
      },
      fontFamily: {
        'cf': ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 