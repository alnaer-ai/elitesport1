import type { NextConfig } from "next";

const SANITY_PROJECT_ID =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID || "";
const SANITY_DATASET =
  process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET || "";
const SANITY_API_VERSION =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ||
  process.env.SANITY_API_VERSION ||
  "2023-10-01";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_SANITY_PROJECT_ID: SANITY_PROJECT_ID,
    NEXT_PUBLIC_SANITY_DATASET: SANITY_DATASET,
    NEXT_PUBLIC_SANITY_API_VERSION: SANITY_API_VERSION,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
