import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow local assets from /public/assets/
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 86400,
  },
  // Optimize for production
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
