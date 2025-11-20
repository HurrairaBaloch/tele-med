/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary color scheme - easily customizable
        primary: {
          50: '#E6F4F9',
          100: '#CCE9F3',
          200: '#99D3E7',
          300: '#66BDDB',
          400: '#33A7CF',
          500: '#0077B6', // Main primary color
          600: '#006092',
          700: '#00486D',
          800: '#003049',
          900: '#001824',
        },
        secondary: {
          50: '#E6F7FB',
          100: '#CCEFF7',
          200: '#99DFEF',
          300: '#66CFE7',
          400: '#33BFDF',
          500: '#00B4D8', // Main secondary color
          600: '#0090AD',
          700: '#006C82',
          800: '#004856',
          900: '#00242B',
        },
        accent: {
          50: '#F0FAFD',
          100: '#E1F5FB',
          200: '#C3EBF7',
          300: '#A5E1F3',
          400: '#87D7EF',
          500: '#90E0EF', // Main accent color
          600: '#73B3BF',
          700: '#56868F',
          800: '#3A5A60',
          900: '#1D2D30',
        },
        // Neutral colors
        neutral: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        // Status colors
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
      },
      fontFamily: {
        sans: ['PT Sans', 'Barlow', 'sans-serif'],
        body: ['PT Sans', 'Barlow', 'sans-serif'],
        heading: ['Outfit', 'Barlow', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
        barlow: ['Barlow', 'sans-serif'],
        'pt-sans': ['PT Sans', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

