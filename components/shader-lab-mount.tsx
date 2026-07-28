"use client";

import dynamic from "next/dynamic";

/*
 * `ssr: false` is only legal inside a Client Component, so the page delegates
 * the client-only import here rather than calling dynamic() itself.
 */
const ShaderLab = dynamic(
  () => import("./shader-lab").then((module) => module.ShaderLab),
  { ssr: false },
);

export function ShaderLabMount() {
  return <ShaderLab />;
}
