export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary Colors
        indigo: {
          500: '#6366F1',
          600: '#4F46E5',
        },
        // Secondary Colors
        emerald: {
          500: '#10B981',
          600: '#059669',
        },
        // Attention Color
        amber: {
          500: '#F59E0B',
          600: '#D97706',
        },
        // Text Colors for Dark Mode
        slate: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        },
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(135deg, #0F172A 0%, #020617 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
