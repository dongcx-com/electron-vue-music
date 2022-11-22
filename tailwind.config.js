/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./main.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'media',
  theme: {
    extend: {
      important: true,
      colors: {
        'like': '#ff6a6a',
        'down': '#abafaf',
        'curr': '#1ecc94',
        'sq': '#ff6600',
        'hires': '#ebc270'
      },
      backgroundImage: {
        'optical-disk': "url('/src/assets/images/opticalDisk.png')",
      }
    }
  },
  plugins: [],
}
