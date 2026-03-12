/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        blush: { 50: '#fdf6f9', 100: '#fce4ec', 200: '#f8b4c8', 300: '#f48fb1', 400: '#f06292', 500: '#e91e8c' },
        lavender: { 50: '#f8f4ff', 100: '#ede7f6', 200: '#d1b3f5', 300: '#b39ddb', 400: '#9575cd', 500: '#7c4dff' },
        cream: { 50: '#fffdf9', 100: '#fdf8f0', 200: '#faebd7', 300: '#f5deb3', 400: '#deb887' },
        sage: { 100: '#e8f5e9', 200: '#c8e6c9', 300: '#a5d6a7' }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
        script: ['"Dancing Script"', 'cursive']
      },
      borderRadius: { '2xl': '1rem', '3xl': '1.5rem', '4xl': '2rem' },
      boxShadow: {
        soft: '0 4px 20px rgba(248, 180, 200, 0.3)',
        card: '0 2px 15px rgba(0,0,0,0.08)',
        hover: '0 8px 30px rgba(248, 180, 200, 0.4)'
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s infinite',
        'fade-up': 'fadeUp 0.5s ease-out',
        'bounce-soft': 'bounceSoft 1s ease-in-out infinite'
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        fadeUp: { '0%': { opacity: 0, transform: 'translateY(20px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        bounceSoft: { '0%,100%': { transform: 'scale(1)' }, '50%': { transform: 'scale(1.05)' } }
      }
    }
  },
  plugins: []
};
