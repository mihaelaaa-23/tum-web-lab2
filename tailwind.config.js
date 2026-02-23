/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./src/**/*.{html,js}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#026E82',
        secondary: '#CDB181',
        dark: '#1a1a1a',
        light: '#fdfaf5',
      },
      fontFamily: {
        accent: ['"Playfair Display"', 'serif'],
        heading: ['"Montserrat"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
