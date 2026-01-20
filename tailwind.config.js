export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        glass: {
          light: 'rgba(255, 255, 255, 0.05)',
          lighter: 'rgba(255, 255, 255, 0.08)',
        },
      },
      backgroundImage: {
        'gradient-light': 'linear-gradient(135deg, #f7f9fc 0%, #e8f0fb 50%, #dfe9f7 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0f172a 0%, #020617 100%)',
        'gradient-hero': 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
