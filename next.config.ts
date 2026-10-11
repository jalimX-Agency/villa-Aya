import type { NextConfig } from "next";

const oneYear = "public, max-age=31536000, immutable";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: false,
  images: {
    // Pre-sized static AVIF files, see src/lib/image-loader.ts
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    deviceSizes: [640, 1080, 1600],
    imageSizes: [320, 640],
  },
  async headers() {
    // Static files in /public are otherwise revalidated on every request. Names are versioned via ?v=.
    return [
      { source: "/images/:path*", headers: [{ key: "Cache-Control", value: oneYear }] },
      { source: "/brand/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }] },
    ];
  },
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
