import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "elitesport.online",
      },
    ],
    // Increase timeout for slow/large images from elitesport.online
    minimumCacheTTL: 60,
  },
  // Extend server timeout for image optimization (handles large images)
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
