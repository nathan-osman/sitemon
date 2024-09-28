/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './public/index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'background': 'var(--background)',
        'background-panel': 'var(--background-panel)',
        'foreground': 'var(--foreground)',
        'muted': 'var(--muted)',
        'status-unknown': 'var(--status-unknown)',
        'status-green': 'var(--status-green)',
        'status-red': 'var(--status-red)',
      }
    },
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
    },
  },
  plugins: [],
}
