/** @type {import('tailwindcss').Config} */

import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Roboto', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        'c-neutral-100': '#FAFAFA',
        // ...
        'c-neutral-600': '#858585',
        'c-neutral-700': '#303030',
        'c-neutral-800': '#1E1E1E',
        'c-neutral-900': '#121212',

        // ...
        'c-green-300': '#77deb1',
        'c-green-400': '#40c791',
        'c-green-500': '#21c488',
        'c-green-600': '#108b60',
      },
    },
  },
  plugins: [],
}
