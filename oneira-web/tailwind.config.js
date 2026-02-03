/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#ff0084",
                background: {
                    light: "#f8f5f7",
                    dark: "#050510", // Deep cosmic
                    card: "#1a0b12",
                },
                cosmic: {
                    purple: "#8b5cf6",
                    cyan: "#06b6d4",
                    pink: "#ec4899",
                    deep: "#230f19"
                },
                accent: "#ce8dae"
            },
            fontFamily: {
                serif: ['"Tenor Sans"', 'serif'],
                sans: ['"Manrope"', 'sans-serif'],
            },
            animation: {
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'spin-slow': 'spin 12s linear infinite',
                'float': 'float 6s ease-in-out infinite',
            },
        },
    },
    plugins: [],
}
