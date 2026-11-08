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
          dark: '#0F172A', // Bleu institutionnel très sombre
          primary: '#2563EB', // Bleu vif banque
          accent: '#0EA5E9', // Bleu clair moderne
          success: '#10B981', // Vert validation KYC
        }
      }
    },
  },
  plugins: [],
}