
/** @type {import('tailwindcss').Config} */
export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        // Colors defined to read from CSS variables (allows runtime theme switching).
        charcoal: {
          DEFAULT: 'var(--color-charcoal, #1a1d23)',
          light: 'var(--color-charcoal-light, #21252b)',
          lighter: 'var(--color-charcoal-lighter, #282c34)',
          dark: 'var(--color-charcoal-dark, #16191d)'
        },
        amber: {
          DEFAULT: 'var(--color-amber, #ffb86c)',
          dim: 'var(--color-amber-dim, #cc9356)',
          glow: 'var(--color-amber-glow, rgba(255, 184, 108, 0.15))'
        },
        theme: {
          text: 'var(--c-text)',
          muted: 'var(--c-muted)',
        },
        terminal: {
          green: 'var(--color-terminal-green, #50fa7b)',
          red: 'var(--color-terminal-red, #ff5555)',
          blue: 'var(--color-terminal-blue, #8be9fd)',
          purple: 'var(--color-terminal-purple, #bd93f9)',
          yellow: 'var(--color-terminal-yellow, #f1fa8c)'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-amber': '0 0 10px rgba(255, 184, 108, 0.3)',
        'glow-green': '0 0 10px rgba(80, 250, 123, 0.3)',
      },
      backgroundImage: {
        'scanlines': 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
      }
    },
  },
  plugins: [],
}
