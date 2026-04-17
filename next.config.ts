import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn-images-1.listennotes.com',
      },
      {
        protocol: 'https',
        hostname: 'i.scdn.co', 
      },
    ],
  },
  transpilePackages: ['three'],
};

export default nextConfig;
