import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      colors: {
        ink: {
          950: '#05070D',
          900: '#0A0C17',
          850: '#0F1220',
          800: '#141829',
          700: '#1C2038',
          600: '#262B47',
          500: '#343A5E',
        },
        parchment: {
          50: '#FAFAF7',
          100: '#F4F3EC',
          200: '#E9E6D9',
        },
        primary: {
          DEFAULT: '#6366F1',
          hover: '#4F46E5',
          light: '#A5B4FC',
          soft: '#818CF8',
        },
        /* Warm rose accent (replaces yellow/gold) */
        accent: {
          DEFAULT: '#FB7185',
          soft: '#FDA4AF',
          deep: '#BE123C',
        },
        /* Sky tone (replaces emerald/green) */
        sky: {
          DEFAULT: '#38BDF8',
          soft: '#BAE6FD',
          deep: '#0369A1',
        },
        background: '#05070D',
        surface: {
          DEFAULT: '#0F1220',
          elevated: '#141829',
          glass: 'rgba(20, 24, 41, 0.55)',
        },
        border: {
          DEFAULT: '#1F2440',
          soft: '#14182A',
          strong: '#2C335A',
        },
        text: {
          primary: '#D7DBEA',
          secondary: '#8B92B0',
          muted: '#5A6088',
          emphasis: '#FFFFFF',
        },
      },
      backgroundImage: {
        'radial-spotlight':
          'radial-gradient(1000px circle at 50% -10%, rgba(99,102,241,0.18), transparent 55%)',
        'grid-pattern':
          'linear-gradient(rgba(99,102,241,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.08) 1px, transparent 1px)',
        'noise':
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E\")",
      },
      borderRadius: {
        xs: '0.25rem',
        sm: '0.375rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(0,0,0,0.15), 0 8px 24px -12px rgba(99,102,241,0.15)',
        glow: '0 0 0 1px rgba(99,102,241,0.25), 0 10px 40px -10px rgba(99,102,241,0.45)',
        'glow-accent':
          '0 0 0 1px rgba(251,113,133,0.35), 0 10px 40px -10px rgba(251,113,133,0.35)',
        inset: 'inset 0 1px 0 rgba(255,255,255,0.04)',
      },
      letterSpacing: {
        tightest: '-0.04em',
        wider: '0.08em',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        spin_slow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.9)', opacity: '0.6' },
          '100%': { transform: 'scale(1.4)', opacity: '0' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.7s ease-out both',
        'fade-in': 'fade-in 0.6s ease-out both',
        float: 'float 6s ease-in-out infinite',
        'spin-slow': 'spin_slow 60s linear infinite',
        shimmer: 'shimmer 2.5s linear infinite',
        'pulse-ring': 'pulse-ring 2.8s ease-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
