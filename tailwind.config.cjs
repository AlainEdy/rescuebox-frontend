module.exports = {
  content: ['./index.html','./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],    // Agregar Montserrat como fuente principal
        circular: ['Circular Std', 'sans-serif'], // Agregar Circular Std (si la tienes disponible)
      },
    },
  },
  plugins: [],
}