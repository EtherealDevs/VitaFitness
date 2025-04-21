/** @type {import('tailwindcss').Config} */
import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

const config: Config = {
    darkMode: ['class'],
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
    ],
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px',
            },
        },
        extend: {
            keyframes: {
                flicker: {
                    '0%, 100%': {
                        opacity: '1',
                        textShadow:
                            '0 0 5px #0ff, 0 0 10px #0ff, 0 0 20px #0ff, 0 0 40px #0ff',
                    },
                    '50%': {
                        opacity: '0.8',
                        textShadow: '0 0 2px #0ff, 0 0 5px #0ff, 0 0 10px #0ff',
                    },
                },
            },
            animation: {
                flicker: 'flicker 1.5s infinite alternate',
            },
            fontFamily: {
                impact: ['Impact', 'system-ui', '-apple-system', 'sans-serif'],
            },
        },
    },
    plugins: [
        plugin(function ({ addUtilities }) {
            addUtilities({
                '.text-shadow-neon-cyan': {
                    textShadow:
                        '0 0 5px #0ff, 0 0 10px #0ff, 0 0 20px #0ff, 0 0 40px #0ff',
                },
                '.text-shadow-neon-green': {
                    textShadow:
                        '0 0 5px #0f0, 0 0 10px #0f0, 0 0 20px #0f0, 0 0 40px #0f0',
                },
                '.text-shadow-neon-purple': {
                    textShadow:
                        '0 0 5px #c0f, 0 0 10px #c0f, 0 0 20px #c0f, 0 0 40px #c0f',
                },
            })
        }),
    ],
}

export default config
