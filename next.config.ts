import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray lockfile in the home directory makes Turbopack infer the wrong
  // workspace root, so point it at this project explicitly.
  turbopack: {
    root: import.meta.dirname,
  },
};

const withMDX = createMDX();

export default withMDX(nextConfig);
