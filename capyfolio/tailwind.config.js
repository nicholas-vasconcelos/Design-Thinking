/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: '#FAF7F2',
        textMain: '#182536',
        primary: '#1E3C61',
        secondary: '#1B8243',
        accent: '#FEA402',
        borderSubtle: '#DDE2E6',
        borderInput: '#CBD3DA',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}