/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0F172A',
          primary: '#2563EB',
          accent: '#0EA5E9',
          success: '#10B981',
        }
      }
    },
  },
  plugins: [],
}