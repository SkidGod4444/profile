import type { Metadata } from "next";
import { ShaderLabMount } from "@/components/shader-lab-mount";
import { ThemeToggle } from "@/components/theme-toggle";

export const metadata: Metadata = {
  title: "Shader lab",
  robots: { index: false, follow: false },
};

/*
 * Throwaway page for choosing a background shader by eye. Every tile is a live
 * WebGL canvas, so the grid mounts client-side only.
 */
export default function ShaderLabPage() {
  return (
    <>
      <ThemeToggle />
      <ShaderLabMount />
    </>
  );
}
