/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: { 'sm-semibold': ['0.875rem', { fontWeight: '600' }], },
      colors: {
        'custom-green': 'rgba(18, 96, 44, 1)',
        'border-input': 'rgba(196, 224, 249, 1)',
        'bg-input': 'rgba(240, 247, 254, 1)',
        'color-input': 'rgba(28, 44, 79, 0.65)',
        'color-main': 'rgba(28, 44, 79, 1)',
        't-tulo': 'rgba(40, 76, 154, 1)',
      },
    },
  },
  plugins: [],
}

