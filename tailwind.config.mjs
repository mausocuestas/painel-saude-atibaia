/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
  ],
  theme: {
    extend: {
      colors: {primary: "oklch(0.8 0.1081 205.64))", 
        secondary: "oklch(0.88 0.1312 106.94)"},
              }
  },
  plugins: [],
}

