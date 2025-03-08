/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['picsum.photos', 'i.pravatar.cc', 'avatars.dicebear.com'],
  },
  // Explicitly set the build system
  experimental: {
    turbo: false, // Disable Turbopack if it's causing issues
  },
};

module.exports = nextConfig; 