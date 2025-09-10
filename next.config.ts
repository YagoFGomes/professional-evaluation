import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('https://claglobal.com.br/**')],
  },
  /* config options here */
};

export default nextConfig;
