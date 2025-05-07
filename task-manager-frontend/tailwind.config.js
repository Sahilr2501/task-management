/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: '#1e293b', // slate-800
                secondary: '#334155', // slate-700
                accent: '#2563eb', // blue-600
                'bg-background': '#0f172a', // slate-900
                card: '#1e293b', // slate-800
                text: '#f1f5f9', // slate-100
            },
        },
    },
    plugins: [],
    corePlugins: {
        preflight: true,
    },
} 