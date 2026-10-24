import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prisma ships native query engines, so it must stay outside the bundle.
  serverExternalPackages: ["@prisma/client"],
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
