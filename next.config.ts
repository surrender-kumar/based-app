import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  
  // Completely disable all development indicators
  devIndicators: {
    buildActivity: false
  }
};

export default nextConfig;
