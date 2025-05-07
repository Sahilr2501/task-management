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
        domains: ['localhost', 'task-management-backend-m1qu.onrender.com'],
    },
    // Enable static optimization
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    // Configure for production
    output: 'standalone',
    distDir: '.next',
    poweredByHeader: false,
    generateEtags: true,
    compress: true,
}

module.exports = withPWA(nextConfig); 