import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Event covers on /talks come straight from Luma's image CDN.
    remotePatterns: [{ protocol: "https", hostname: "images.lumacdn.com" }],
  },
  // A stray lockfile in the home directory makes Turbopack infer the wrong
  // workspace root, so point it at this project explicitly.
  turbopack: {
    root: import.meta.dirname,
  },
  // Baseline hardening headers; none of them affect how the pages render.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

const withMDX = createMDX();

export default withMDX(nextConfig);
