/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cricket: {
          pitch: '#1B4D3E',
          grass: '#2E7D32',
          leather: '#8B0000',
          seam: '#E2E8F0',
          gold: '#FFD700',
          dark: '#0B1120',
          card: '#131D33',
          border: '#1E293B',
          accent: '#3B82F6'
        }
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
