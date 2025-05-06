/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    important: true,
    theme: {
        extend: {
            colors: {
                primary: '#210F37',
                secondary: '#4F1C51',
                accent: '#A55B4B',
                background: '#DCA06D',
            },
        },
    },
    plugins: [],
    corePlugins: {
        preflight: true,
    },
} 