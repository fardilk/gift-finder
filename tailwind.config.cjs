/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
  content: {
    files: [
      './index.html',
      './src/**/*.{ts,tsx,js,jsx,html}',
    ],
    safelist: [
      'text-3xl',
      'font-bold',
      'mt-4',
      'text-gray-600',
      'p-8',
      'min-h-screen',
      'px-4',
      'py-2',
      'bg-blue-600',
      'text-white',
      'rounded'
    ],
  },
  theme: {
    extend: {},
  },
  plugins: [],
}
