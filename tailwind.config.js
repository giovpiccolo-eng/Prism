/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0a0b0f',
        surface: '#13151c',
        border: '#1e2130',
        text: '#e8eaed',
        muted: '#6b7280',
        life: '#22c55e',
        matter: '#f59e0b',
        forces: '#3b82f6',
        nexus: '#8b5cf6',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'Inter', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
    },
  },
  plugins: [],
}
