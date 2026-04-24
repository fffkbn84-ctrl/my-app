import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: 'var(--bg)',
          elev: 'var(--bg-elev)',
          subtle: 'var(--bg-subtle)',
        },
        card: {
          DEFAULT: 'var(--card)',
          warm: 'var(--card-warm)',
          hover: 'var(--card-hover)',
        },
        text: {
          DEFAULT: 'var(--text)',
          deep: 'var(--text-deep)',
          mid: 'var(--text-mid)',
          light: 'var(--text-light)',
          faint: 'var(--text-faint)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          deep: 'var(--accent-deep)',
          dim: 'var(--accent-dim)',
          pale: 'var(--accent-pale)',
        },
        border: {
          DEFAULT: 'var(--border)',
          mid: 'var(--border-mid)',
          strong: 'var(--border-strong)',
        },
        success: {
          DEFAULT: 'var(--success)',
          pale: 'var(--success-pale)',
        },
        warning: {
          DEFAULT: 'var(--warning)',
          pale: 'var(--warning-pale)',
        },
        danger: {
          DEFAULT: 'var(--danger)',
          pale: 'var(--danger-pale)',
        },
      },
      fontFamily: {
        mincho: ['"Shippori Mincho"', 'serif'],
        body: ['"Hiragino Kaku Gothic ProN"', '"Hiragino Sans"', 'system-ui', 'sans-serif'],
        dm: ['"DM Sans"', 'sans-serif'],
      },
      aspectRatio: {
        '9/16': '9 / 16',
      },
    },
  },
  plugins: [],
}

export default config
