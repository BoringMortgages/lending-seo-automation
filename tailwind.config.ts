import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        boring: {
          // Primary & Text Colors
          'dark-blue': '#0D0D2B',      // Headings & Buttons
          'medium-grey': '#8A8A9E',    // Subheadings & Labels
          white: '#FFFFFF',            // White
          'background-grey': '#F9F9F9', // Background Grey
          
          // Accent & Chart Colors
          'lime-green': '#D4ED3D',     // Wells Fargo
          lavender: '#E3E1FC',         // Stripe
          'bright-yellow': '#FBEB6A',  // NYC Apartment
          'light-pink': '#EBC2E4',     // Vanguard
          'pill-green': '#B3D428',     // Percentage increase
          
          // Legacy colors (keeping for backward compatibility)
          purple: '#8c7fff',
          teal: '#003e32',
          'light-gray': '#eeece7',
          mint: '#c3ddd4',
          'bright-green': '#00f78c',
          'dark-gray': '#7f949f',
          charcoal: '#1c1c1c',
        },
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'heading': ['Anton', 'sans-serif'],
        'serif': ['Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};

export default config;