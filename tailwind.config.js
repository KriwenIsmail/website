/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./pages/**/*.js", "./components/**/*.js"],
  theme: {
    extend: {
      container: {
        center: true,
        padding: "1rem"
      }
    },
  },
  plugins: [
    ({ addComponents }) => {
      addComponents({
        '.container': {
          '@screen sm': {
            maxWidth: '500px',
          },
          '@screen md': {
            maxWidth: '680px',
          },
          '@screen lg': {
            maxWidth: '900px',
          },
          '@screen xl': {
            maxWidth: '900px',
          },
        }
      })
    }
  ],
}
