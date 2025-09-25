/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0055A5', // Blue from live site
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#00A3E0', // Lighter blue for hover/accents
          foreground: '#FFFFFF',
        },
        background: {
          DEFAULT: '#F5F6F5', // Light gray background
          dark: '#1F2937', // Dark mode background
        },
        card: {
          DEFAULT: '#FFFFFF',
          dark: '#2D2D2D',
        },
        text: {
          DEFAULT: '#333333', // Dark text for light theme
          dark: '#E5E7EB', // Light text for dark theme
        },
      },
      fontFamily: {
        sans: ['Roboto', 'Arial', 'sans-serif'], // Modern font like live site
      },
    },
  },
  darkMode: 'class',
  plugins: [],
};