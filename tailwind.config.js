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
        'mygreen-light': '#6EE7B7',
        'mygreen': '#10B981',
        'mygreen-dark': '#047857',
        'env-green-darkest': '#0A1F1E',
        
        'env-blue-light': '#93C5FD',
        'env-blue': '#3B82F6',
        'env-blue-dark': '#1D4ED8',
        
        'env-gray-light': '#F3F4F6',
        'env-gray': '#6B7280',
        'env-gray-dark': '#1F2937',
        'env-gray-darker': '#111827'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
} 