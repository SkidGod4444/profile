"use client";

import {
  Dithering,
  GrainGradient,
  NeuroNoise,
} from "@paper-design/shaders-react";
import { useCallback, useState, useSyncExternalStore } from "react";
import { shaderInk } from "@/lib/theme";
import { BackdropFallback } from "./backdrop-fallback";
import { useTheme } from "./theme-provider";

/*
 * Which shader the site actually wears. Change this one line to audition
 * another; /shader-lab renders every candidate side by side. Both presets below
 * are kept so switching back is free.
 */
const activeShader: "grain-gradient" | "neuro-noise" | "dithering" =
  "dithering";

/*
 * A drifting grainy field. `intensity` is the lever that matters: the stock
 * presets sit at 0.5 and read as a poster gradient, while low values keep it a
 * texture. High `noise` is what makes it grain rather than a smooth blend, and
 * `shape: "wave"` drifts without an obvious centre the way `corners` or
 * `sphere` do.
 */
const grainGradientPreset = {
  shape: "wave",
  softness: 0.82,
  noise: 0.5,
  scale: 0.78,
  speed: 0.28,
  rotation: -6,
  offsetX: 0.12,
  offsetY: -0.18,
  light: { intensity: 0.2 },
  dark: { intensity: 0.16 },
} as const;

/*
 * Filament structures rather than a dot grid. Brightness and contrast sit well
 * under the stock preset (0.05 / 0.3) because at full strength the filaments
 * read as lightning rather than texture.
 *
 * The two themes need different numbers, not just a different ink: NeuroNoise
 * *adds* light, which on near-white paper flattens the filaments toward the
 * background, so light mode gets more contrast and less brightness.
 */
const neuroNoisePreset = {
  scale: 0.62,
  speed: 0.32,
  rotation: -8,
  offsetX: 0.16,
  offsetY: -0.2,
  light: { brightness: 0, contrast: 0.34 },
  dark: { brightness: 0.03, contrast: 0.16 },
} as const;

/*
 * Ordered-dither grain. `simplex` is the pattern source — `dots` and `wave`
 * look mechanical at this scale. `type` is the Bayer matrix: 8×8 gives a finer,
 * more even stipple than 4×4, so `size` drops with it to keep the dots small
 * enough to read as texture rather than a visible grid.
 */
const ditheringPreset = {
  shape: "simplex",
  type: "8x8",
  size: 1.4,
  scale: 0.92,
  speed: 0.46,
  rotation: -10,
  offsetX: 0.14,
  offsetY: -0.24,
} as const;

/*
 * The background stays fully transparent so the paper shows through and only
 * the ink is drawn — an opaque `colorBack` would cover the page and turn a
 * subtle texture into a hard two-tone field. Paper Shaders parses rgba() and
 * 8-digit hex, but rejects the keyword `transparent`.
 */
const transparent = "rgba(0, 0, 0, 0)";

const motionQuery = "(prefers-reduced-motion: reduce)";
const compactQuery = "(max-width: 700px)";

/**
 * Subscribes to a media query through `useSyncExternalStore` rather than an
 * effect, so the first render already has the real value instead of setting
 * state immediately after mounting.
 */
function usePreference(query: string) {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const mediaQuery = window.matchMedia(query);

      mediaQuery.addEventListener("change", onStoreChange);

      return () => mediaQuery.removeEventListener("change", onStoreChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/*
 * Safe to touch `document` at module scope here: this component is only ever
 * reached through a `dynamic(..., { ssr: false })` import, so it never runs
 * while prerendering.
 */
function canUseWebGl() {
  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2") ?? canvas.getContext("webgl");

    // Release the throwaway context rather than leaving it to the GC, since
    // browsers cap how many live contexts one page may hold.
    context?.getExtension("WEBGL_lose_context")?.loseContext();

    return context !== null;
  } catch {
    return false;
  }
}

export function BackdropShader() {
  const { theme } = useTheme();
  const reduceMotion = usePreference(motionQuery);
  const compactViewport = usePreference(compactQuery);
  const [supportsWebGl] = useState(canUseWebGl);

  if (!supportsWebGl) {
    return <BackdropFallback />;
  }

  const ink = shaderInk[theme];
  const sizing = {
    width: "100%",
    height: "100%",
    minPixelRatio: 1,
    maxPixelCount: compactViewport ? 400_000 : 800_000,
  } as const;

  return (
    <div className="backdrop__field" aria-hidden="true">
      {activeShader === "grain-gradient" ? (
        <GrainGradient
          {...sizing}
          colorBack={transparent}
          colors={[ink]}
          shape={grainGradientPreset.shape}
          softness={grainGradientPreset.softness}
          intensity={grainGradientPreset[theme].intensity}
          noise={grainGradientPreset.noise}
          scale={grainGradientPreset.scale}
          rotation={grainGradientPreset.rotation}
          offsetX={grainGradientPreset.offsetX}
          offsetY={grainGradientPreset.offsetY}
          speed={reduceMotion ? 0 : grainGradientPreset.speed}
        />
      ) : activeShader === "neuro-noise" ? (
        <NeuroNoise
          {...sizing}
          colorBack={transparent}
          colorMid={ink}
          colorFront={ink}
          brightness={neuroNoisePreset[theme].brightness}
          contrast={neuroNoisePreset[theme].contrast}
          scale={neuroNoisePreset.scale}
          rotation={neuroNoisePreset.rotation}
          offsetX={neuroNoisePreset.offsetX}
          offsetY={neuroNoisePreset.offsetY}
          speed={reduceMotion ? 0 : neuroNoisePreset.speed}
        />
      ) : (
        <Dithering
          {...sizing}
          colorBack={transparent}
          colorFront={ink}
          shape={ditheringPreset.shape}
          type={ditheringPreset.type}
          size={ditheringPreset.size}
          scale={ditheringPreset.scale}
          rotation={ditheringPreset.rotation}
          offsetX={ditheringPreset.offsetX}
          offsetY={ditheringPreset.offsetY}
          speed={reduceMotion ? 0 : ditheringPreset.speed}
        />
      )}
    </div>
  );
}
