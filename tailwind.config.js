/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F0F7FF',
          100: '#E0EFFF',
          200: '#C0DFFF',
          300: '#90C7FF',
          400: '#60AFFF',
          500: '#4A90E2', // Primary blue
          600: '#3A75D9',
          700: '#2A59B8',
          800: '#1D3C8F',
          900: '#132966',
        },
        secondary: {
          50: '#EDFAF5',
          100: '#D0F2E5',
          200: '#A1E5D0',
          300: '#70D9BC',
          400: '#50C878', // Secondary green
          500: '#3BB873',
          600: '#2A9361',
          700: '#1F7250',
          800: '#155643',
          900: '#0E3A2D',
        },
        accent: {
          50: '#FFF0F0',
          100: '#FFE0E0',
          200: '#FFC0C0',
          300: '#FFA0A0',
          400: '#FF7A7A',
          500: '#FF5252', // Accent red
          600: '#E64545',
          700: '#CC3939',
          800: '#B32C2C',
          900: '#992020',
        },
        emergency: {
          50: '#FFF3F0',
          100: '#FFE5E0',
          200: '#FFB8A8',
          300: '#FF8F7A',
          400: '#FF6B52', // Emergency orange
          500: '#FF4800',
          600: '#E63A00',
          700: '#CC2F00',
          800: '#B32400',
          900: '#991F00',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      spacing: {
        '72': '18rem',
        '80': '20rem',
        '96': '24rem',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};