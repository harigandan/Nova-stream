import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "media.api-sports.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "v3.football.api-sports.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.cricapi.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cricketdata.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "tse2.mm.bing.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.olympics.com",
        pathname: "/**",
      },
    ],
  },
  env: {
    NEXT_PUBLIC_API_SPORTS_KEY: process.env.NEXT_PUBLIC_API_SPORTS_KEY,
    NEXT_PUBLIC_CRICAPI_KEY: process.env.NEXT_PUBLIC_CRICAPI_KEY,
  },
  webpack: (config) => {
    // Keep existing experiments
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true, // allows loading .wasm in Next.js
    };

    // 🔹 Add alias for @/*
    config.resolve.alias["@"] = path.resolve(__dirname, "src");

    return config;
  },
};

export default nextConfig;
