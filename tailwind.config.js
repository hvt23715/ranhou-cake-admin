import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf4f3',
          100: '#fce7e4',
          200: '#fbd0cb',
          300: '#f6afa6',
          400: '#ee8275',
          500: '#e1584e',
          600: '#cd3f38',
          700: '#ab312e',
          800: '#8e2b2a',
          900: '#762928',
          950: '#3f1112',
        },
        secondary: {
          50: '#fff8ed',
          100: '#ffefd4',
          200: '#ffdba8',
          300: '#ffc170',
          400: '#ff9c37',
          500: '#ff7f11',
          600: '#f06307',
          700: '#c74a08',
          800: '#9e3a0f',
          900: '#7f3210',
          950: '#451706',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [
    typography,
  ],
}
