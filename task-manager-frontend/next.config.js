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
    // Disable static optimization for pages that use client-side features
    experimental: {
        // This will make all pages use client-side rendering
        appDir: false,
    },
    // Disable static optimization for specific pages
    unstable_runtimeJS: true,
    unstable_JsPreload: false,
}

module.exports = withPWA(nextConfig); 