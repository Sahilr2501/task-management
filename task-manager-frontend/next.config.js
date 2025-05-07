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
    // Configure for static export
    output: 'export',
    // Disable image optimization during export
    images: {
        unoptimized: true,
    },
    // Disable static optimization for pages that use client-side features
    experimental: {
        // This will make all pages use client-side rendering
        appDir: false,
    },
    // Ensure client-side features work
    unstable_runtimeJS: true,
    unstable_JsPreload: false,
    // Configure trailing slashes for static export
    trailingSlash: true,
}

module.exports = withPWA(nextConfig); 