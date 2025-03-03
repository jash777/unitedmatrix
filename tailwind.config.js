/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'another-form': "url('../assets/image.png')",
      }
    },
    screens: {
      'tablet': '640px',
      'laptop': '1024px',
      'desktop': '1536px',
    }
  },
  plugins: [],
}