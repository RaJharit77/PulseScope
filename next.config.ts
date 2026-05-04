import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.ytimg.com' },
      { protocol: 'https', hostname: 'yt3.ggpht.com' },
      { protocol: 'https', hostname: 'cdn-images-1.listennotes.com' },
      { protocol: 'https', hostname: 'i.scdn.co' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },

      { protocol: 'https', hostname: 'image.simplecastcdn.com' },
      { protocol: 'https', hostname: 'd3wo5wojvuv7l.cloudfront.net' },
      { protocol: 'https', hostname: 'static.libsyn.com' },
      { protocol: 'https', hostname: 'media.bcast.fm' },
      { protocol: 'https', hostname: 'cdn-images-1.medium.com' },
    ],
    dangerouslyAllowSVG: true,
    minimumCacheTTL: 60,
  },
  transpilePackages: ['three'],
  serverExternalPackages: ['@prisma/client', 'prisma', 'pg', 'bcrypt', '@auth/prisma-adapter'],
};

export default nextConfig;
