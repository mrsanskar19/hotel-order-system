
/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          '50': '#fef2f2',
          '100': '#fee2e2',
          '500': '#ef4444',
          '600': '#dc2626',
          '700': '#b91c1c',
        },
        secondary: {
          '500': '#8b5cf6',
          '600': '#7c3aed',
          '700': '#6d28d9',
        },
      },
    },
  },
  plugins: [],
};
export default config;
