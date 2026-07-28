"use client";

import dynamic from "next/dynamic";
import { BackdropFallback } from "./backdrop-fallback";

/*
 * The shader touches WebGL and custom-element registration on import, neither
 * of which exist while prerendering, so it is client-only and never part of the
 * server bundle. Feature detection lives inside that module for the same
 * reason — there it can read `document` without guarding.
 */
const BackdropShader = dynamic(
  () => import("./backdrop-shader").then((module) => module.BackdropShader),
  { ssr: false, loading: () => <BackdropFallback /> },
);

export function Backdrop() {
  return (
    <div className="backdrop">
      <BackdropShader />
    </div>
  );
}
