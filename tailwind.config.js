/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    fontFamily: {
      'inter': ['Inter','sans-serif'],
      'display': ['Fredoka One', 'cursive'],
    },
    extend: {
      animation: {
        'spin-fast': 'spin .5s linear infinite'
      }
    },
  },
  plugins: [],
}

