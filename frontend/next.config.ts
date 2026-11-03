import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // для Docker: сборка с минимальным сервером в .next/standalone
  output: "standalone",
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
