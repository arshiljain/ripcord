/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace']
      },
      colors: {
        terminal: {
          bg: '#18181b',
          fg: '#ffffff',
          dim: '#a1a1aa',
          border: '#27272a',
          hover: '#27272a',
          green: '#22c55e',
          cyan: '#06b6d4',
          yellow: '#eab308'
        }
      }
    }
  },
  plugins: []
}
