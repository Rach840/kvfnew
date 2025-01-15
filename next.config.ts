import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  env: {
    BASE_URL: process.env.BASE_URL,
  },
  images: {
    unoptimized: true,
  },
  /* config options here */
};
module.exports = nextConfig;
export default nextConfig;
