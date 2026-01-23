import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        quantum: {
          primary: '#6366f1',
          secondary: '#8b5cf6',
          accent: '#06b6d4',
          dark: '#0f0f23',
          darker: '#0a0a1a',
          light: '#e0e7ff',
        },
        photon: {
          red: '#ff6b6b',
          orange: '#ffa500',
          yellow: '#ffd93d',
          green: '#6bcb77',
          blue: '#4d96ff',
          indigo: '#6366f1',
          violet: '#9d4edd',
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'photon-flow': 'photon-flow 3s linear infinite',
        'quantum-spin': 'quantum-spin 4s linear infinite',
        'entangle': 'entangle 2s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(99, 102, 241, 0.8)' },
        },
        'photon-flow': {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
        'quantum-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'entangle': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.2)', opacity: '0.7' },
        },
      },
      backgroundImage: {
        'quantum-gradient': 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #0f0f23 100%)',
        'photon-gradient': 'linear-gradient(90deg, #ff6b6b, #ffa500, #ffd93d, #6bcb77, #4d96ff, #6366f1, #9d4edd)',
      },
    },
  },
  plugins: [],
}
export default config
