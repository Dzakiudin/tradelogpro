/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Inter"', 'sans-serif'],
                headline: ['"Space Grotesk"', 'sans-serif'],
                label: ['"Inter"', 'sans-serif'],
                mono: ['"JetBrains Mono"', 'monospace'],
            },
            colors: {
                background: '#050505',
                surface: '#0e0e0e',
                'surface-light': '#1a1a1a', 
                'surface-container-low': '#131313',
                'surface-container': '#1a1a1a',
                'surface-container-highest': '#262626',
                primary: '#00e5ff',
                'primary-dark': '#00b3cc', 
                secondary: '#ccff00', 
                success: '#ccff00', 
                danger: '#ff0055',    
                warning: '#f59e0b',
                text: {
                    main: '#fcfcfc',
                    muted: '#808080',
                }
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'glass': 'linear-gradient(135deg, rgba(38, 38, 38, 0.4) 0%, rgba(38, 38, 38, 0.1) 100%)',
                'glass-hover': 'linear-gradient(135deg, rgba(38, 38, 38, 0.6) 0%, rgba(38, 38, 38, 0.2) 100%)',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideInBottom: {
                    '0%': { transform: 'translateY(100%)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-out forwards',
                'slide-up': 'slideUp 0.5s ease-out forwards',
                'slide-in-bottom': 'slideInBottom 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
        },
    },
    plugins: [],
}
