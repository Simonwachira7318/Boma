import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  outputFileTracingRoot: __dirname,
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable Next.js Hot Reloading, handled by nodemon for re-compilation
  reactStrictMode: false,
  webpack: (config, { dev }) => {
    if (dev) {
      // Disable webpack's Hot Module Replacement (HMR)
      config.watchOptions = {
        ignored: ['**/*'], // Ignore all file changes
      };
    }
    return config;
  },
  eslint: {
    // Ignore ESLint errors during build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;