import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          header: '#064e3b', // emerald-900
          action: '#047857', // emerald-700
          bg: '#f8fafc',     // slate-50
          DEFAULT: '#047857', // emerald-700
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857', // primary action button
          800: '#065f46',
          900: '#064e3b', // primary header
          950: '#022c22',
        },
      },
    },
  },
  plugins: [],
};

export default config;
