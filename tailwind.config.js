/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'space-black': '#0a0a0a',
        'gunmetal': '#2a2a2e',
        'lancer-orange': '#ff6b00',
        'lancer-green': '#00ff41',
        'lancer-blue': '#00d1ff',
      },
      fontFamily: {
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'grid-pattern': 'radial-gradient(circle, #ffffff05 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
}
