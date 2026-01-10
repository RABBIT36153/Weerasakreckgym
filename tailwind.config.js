/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0a0a0a',
          surface: '#1a1a1a',
          card: '#252525',
          border: '#333333',
        },
        red: {
          primary: '#dc2626',
          hover: '#b91c1c',
          light: '#ef4444',
        },
        gold: {
          DEFAULT: '#facc15',
          light: '#fde047',
          dark: '#eab308',
        }
      }
    },
  },
  plugins: [],
  // Optimize CSS output
  corePlugins: {
    preflight: true,
  }
}

