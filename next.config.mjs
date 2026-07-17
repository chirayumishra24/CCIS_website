/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'ccischool.org' },
      { protocol: 'https', hostname: '*.firebasestorage.app' },
    ],
  },
};

export default nextConfig;
