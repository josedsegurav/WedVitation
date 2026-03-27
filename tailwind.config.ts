import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ── Font families — read from CSS variables set by theme.config.ts
      fontFamily: {
        // Defaults — overridden at runtime by .font-* class rules
        // injected from theme.config.ts via layout.tsx buildThemeCSS()
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        script:  ['Great Vibes', 'cursive'],
        body:    ['Jost', 'system-ui', 'sans-serif'],
      },
      // ── Colours — read from CSS variables
      colors: {
        // Page
        cream:       'var(--color-page-bg)',
        // Accent
        gold:        'var(--color-gold)',
        'gold-light':'var(--color-gold-light)',
        'gold-dark': 'var(--color-gold-dark)',
        // Text
        charcoal:    'var(--color-heading)',
        body:        'var(--color-body)',
        muted:       'var(--color-muted)',
        // Sections
        'dark-bg':   'var(--color-dark-bg)',
      },
      // ── Background images — gradient shorthands
      backgroundImage: {
        'gradient-section': 'var(--gradient-section)',
        'gradient-gold':    'var(--gradient-gold)',
        'gradient-gold-btn':'var(--gradient-gold-btn)',
        'gradient-dark':    'var(--gradient-dark)',
        'gradient-footer':  'var(--gradient-footer)',
      },
      animation: {
        'fade-up':    'fadeUp 0.8s ease forwards',
        'fade-in':    'fadeIn 1s ease forwards',
        'float':      'float 6s ease-in-out infinite',
        'petal-fall': 'petalFall 8s linear infinite',
        'shimmer':    'shimmer 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)'    },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)'   },
          '50%':      { transform: 'translateY(-15px)' },
        },
        petalFall: {
          '0%':   { transform: 'translateY(-20px) rotate(0deg)', opacity: '0' },
          '10%':  { opacity: '1'   },
          '90%':  { opacity: '0.5' },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
        },
        shimmer: {
          '0%, 100%': { opacity: '0.7' },
          '50%':      { opacity: '1'   },
        },
      },
    },
  },
  plugins: [],
}
export default config
