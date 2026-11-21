/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#FFF8EF',
        'soft-white': '#FFFEFA',
        'cocoa-ink': '#51443E',
        'muted-text': '#897C72',
        'petal-pink': '#F2C5D2',
        'garden-sage': '#B8CBB0',
        'butter-yellow': '#F5D98E',
        'powder-blue': '#C5D9E8',
        terracotta: '#C9795C',
        lilac: '#D8C9E8',
        olive: '#777D54',
        border: '#E8DED2',
      },
      fontFamily: {
        display: ['var(--font-fredoka)', 'Fredoka', 'sans-serif'],
        body: ['var(--font-dm-sans)', 'DM Sans', 'sans-serif'],
      },
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
        '3xl': '4rem',
      },
      borderRadius: {
        sm: '0.25rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        full: '9999px',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgb(81 68 62 / 0.05)',
        md: '0 4px 6px -1px rgb(81 68 62 / 0.08), 0 2px 4px -2px rgb(81 68 62 / 0.04)',
        lg: '0 10px 15px -3px rgb(81 68 62 / 0.08), 0 4px 6px -4px rgb(81 68 62 / 0.04)',
        xl: '0 20px 25px -5px rgb(81 68 62 / 0.08), 0 8px 10px -6px rgb(81 68 62 / 0.04)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'drift': 'drift 8s ease-in-out infinite',
        'grow': 'grow 0.4s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        drift: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(15px)' },
        },
        grow: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
