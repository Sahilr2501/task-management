const withPWA = require('next-pwa')({
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development'
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    // Configure for Render deployment
    images: {
        domains: ['localhost', 'your-backend-url.onrender.com'],
    },
    // Disable static optimization for pages that use client-side features
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    // Disable static optimization for specific pages
    exportPathMap: async function () {
        return {
            '/': { page: '/' },
            '/dashboard': { page: '/dashboard' },
            '/login': { page: '/login' },
            '/register': { page: '/register' },
            '/signup': { page: '/signup' },
        }
    },
    // Disable static optimization
    staticPageGenerationTimeout: 0,
    // Disable static optimization for all pages
    experimental: {
        appDir: false,
        // Disable static optimization
        optimizeCss: false,
        optimizeImages: false,
        optimizeFonts: false,
    },
    // Enable server-side rendering
    unstable_runtimeJS: true,
    unstable_JsPreload: false,
    // Configure for Render
    distDir: '.next',
    poweredByHeader: false,
    generateEtags: true,
    compress: true,
}

module.exports = withPWA(nextConfig); 