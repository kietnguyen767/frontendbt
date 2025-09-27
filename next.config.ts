import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // cho phép tất cả domain https
      },
      {
        protocol: "http",
        hostname: "**", // nếu muốn cho phép luôn http
      },
    ],
  },
};

export default nextConfig;