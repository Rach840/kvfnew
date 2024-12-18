import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },

  output: "export",
  images: {
    unoptimized: true,
  },
  /* config options here */
};
module.exports = nextConfig;
export default nextConfig;
