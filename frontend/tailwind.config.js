/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-dark': '#2E2938', // Fundo principal
        'brand-card': '#393246', // Cor dos cards
        'brand-border': '#594F6D', // Borda sutil
        'brand-primary': '#8A6DFF', // Roxo principal
        'brand-primary-hover': '#7a5ce6',
        'brand-secondary': '#4A425A', // Botão "Cancelar"
        'brand-secondary-hover': '#594F6D',
        'brand-green': '#3BFFBC',
        'brand-red': '#FF477E',
        'brand-purple': '#BB92FF',
      }
    },
  },
  plugins: [],
}