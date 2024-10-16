/** @type {import('tailwindcss').Config} */
const nativewind = require("nativewind/tailwind/native")

module.exports = {
  content: ["./Taskify/**/*.{js}", "./index.js"],
  theme: {
    extend: {},
  },
  plugins: [nativewind()],
}