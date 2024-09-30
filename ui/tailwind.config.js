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
        'background-panel-button': 'var(--background-panel-button)',
        'foreground': 'var(--foreground)',
        'error': 'var(--error)',
        'muted': 'var(--muted)',
        'status-unknown': 'var(--status-unknown)',
        'status-online': 'var(--status-online)',
        'status-error': 'var(--status-error)',
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
