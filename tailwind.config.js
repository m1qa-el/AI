/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Obsidian Spectrum - Primary Monochrome Palette
        void: '#000000',
        obsidian: '#0D0D0D',
        graphene: '#1A1A1A',
        carbon: '#262626',
        slate: '#404040',
        ash: '#737373',
        silver: '#A3A3A3',
        pearl: '#E5E5E5',
        ghost: '#F5F5F5',
        absolute: '#FFFFFF',

        // Functional Accents (minimal use)
        'neural-pulse': 'rgba(255, 255, 255, 0.1)',
        'data-stream': 'rgba(255, 255, 255, 0.03)',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        'display': 'clamp(3rem, 10vw, 7.5rem)',
        'h1': 'clamp(2.25rem, 6vw, 4.5rem)',
        'h2': 'clamp(1.75rem, 4vw, 3rem)',
        'h3': 'clamp(1.5rem, 3vw, 2.25rem)',
        'h4': 'clamp(1.25rem, 2.5vw, 1.75rem)',
        'body-lg': 'clamp(1.125rem, 2vw, 1.375rem)',
        'body': 'clamp(1rem, 1.5vw, 1.125rem)',
        'small': 'clamp(0.875rem, 1.2vw, 1rem)',
        'micro': 'clamp(0.75rem, 1vw, 0.875rem)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },
      boxShadow: {
        'glow-sm': '0 0 20px rgba(255, 255, 255, 0.1)',
        'glow': '0 0 40px rgba(255, 255, 255, 0.2)',
        'glow-lg': '0 0 60px rgba(255, 255, 255, 0.3)',
        'depth-1': '0 2px 8px rgba(0, 0, 0, 0.4)',
        'depth-2': '0 4px 16px rgba(0, 0, 0, 0.4)',
        'depth-3': '0 8px 24px rgba(0, 0, 0, 0.4)',
        'depth-4': '0 12px 32px rgba(0, 0, 0, 0.4)',
        'depth-5': '0 16px 48px rgba(0, 0, 0, 0.5)',
        'depth-6': '0 24px 80px rgba(0, 0, 0, 0.6)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      transitionTimingFunction: {
        'ai-smooth': 'cubic-bezier(0.4, 0.0, 0.2, 1)',
        'ai-snap': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'ai-glide': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'ai-emerge': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'ai-elastic': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'ai-decisive': 'cubic-bezier(0.2, 0, 0, 1)',
      },
      transitionDuration: {
        '89': '89ms',
        '144': '144ms',
        '233': '233ms',
        '377': '377ms',
        '610': '610ms',
        '987': '987ms',
        '1597': '1597ms',
      },
      screens: {
        'xs': '320px',
        '3xl': '1920px',
      },
    },
  },
  plugins: [],
};
