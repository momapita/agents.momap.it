/** @type {import('tailwindcss').Config} */

const plugin = require('tailwindcss/plugin');
export default {
  darkMode: 'selector',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./node_modules/primevue/**/*.{vue,js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'momap': "#E94940",
        'momap1': "#1f2937",
        'totalGray': '#1E1E1E',
        'viking': {
          '50': '#f0fafb',
          '100': '#d9f2f4',
          '200': '#b8e5e9',
          '300': '#7fced7',
          '400': '#4eb5c2',
          '500': '#3398a7',
          '600': '#2d7b8d',
          '700': '#2a6574',
          '800': '#2a5460',
          '900': '#274752',
          '950': '#152d37',
        },
      },
      height: {
        'screen': [
          '100vh','100dvh'
        ]
      },
      minHeight: {
        'screen': [
          '100vh','100dvh'
        ]
      },
      maxHeight: {
        'screen': [
          '100vh','100dvh'
        ]
      },
      gridTemplateColumns: {
        'auto-fill-50': 'repeat(auto-fill, minmax(50px, 1fr))',
        'auto-fill-80': 'repeat(auto-fill, minmax(80px, 1fr))',
        'auto-fill-100': 'repeat(auto-fill, minmax(100px, 1fr))',
        'auto-fill-150': 'repeat(auto-fill, minmax(150px, 1fr))',
        'auto-fill-200': 'repeat(auto-fill, minmax(200px, 1fr))',
        'auto-fill-250': 'repeat(auto-fill, minmax(250px, 1fr))',
        'auto-fill-300': 'repeat(auto-fill, minmax(300px, 1fr))',
        'auto-fill-400': 'repeat(auto-fill, minmax(400px, 1fr))',
        'auto-fill-500': 'repeat(auto-fill, minmax(500px, 1fr))',
        'auto-fill-600': 'repeat(auto-fill, minmax(600px, 1fr))',
        'auto-fill-700': 'repeat(auto-fill, minmax(700px, 1fr))',
        'auto-fill-800': 'repeat(auto-fill, minmax(800px, 1fr))',
      },
      textShadow: {
        xs: '0 0 1px #1f293799',
        sm: '0 1px 2px #1f293799',
        DEFAULT: '0 2px 4px #1f293799',
        lg: '0 8px 16px #1f293799',
      },
    }
  },
  plugins: [
    require('tailwindcss/plugin')(({ addVariant }) => {
      addVariant('search-cancel', '&::-webkit-search-cancel-button');
    }),
    plugin(function({ matchUtilities, theme }) {
      matchUtilities(
        {
          'translate-z': (value) => ({
            '--tw-translate-z': value,
            transform: ` translate3d(var(--tw-translate-x), var(--tw-translate-y), var(--tw-translate-z)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))`,
          }),
          'text-shadow': (value) => ({
            textShadow: value,
          }),
        },
        { values: { ...theme('textShadow'), ...theme('translate') } }
      )
    })
  ]
}