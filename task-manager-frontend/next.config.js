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
    // Enable server-side rendering
    experimental: {
        appDir: false,
    },
    // Enable runtime features
    unstable_runtimeJS: true,
    unstable_JsPreload: false,
    // Configure for Render
    distDir: '.next',
    poweredByHeader: false,
    generateEtags: true,
    compress: true,
    // Disable static optimization for pages that use client-side features
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
}

module.exports = withPWA(nextConfig); 