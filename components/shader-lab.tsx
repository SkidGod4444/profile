"use client";

import {
  Dithering,
  DotGrid,
  DotOrbit,
  GodRays,
  GrainGradient,
  MeshGradient,
  NeuroNoise,
  PerlinNoise,
  SimplexNoise,
  SmokeRing,
  Spiral,
  StaticMeshGradient,
  Swirl,
  Voronoi,
  Warp,
  Waves,
} from "@paper-design/shaders-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { shaderInk, themeColors } from "@/lib/theme";
import { useTheme } from "./theme-provider";

/*
 * A local audition page: every candidate rendered in the site's own ink and
 * paper so the comparison is fair. Not linked from anywhere — delete this
 * component and app/shader-lab once a shader has been chosen.
 */

type Palette = { ink: string; paper: string; transparent: string };

type Candidate = {
  id: string;
  label: string;
  note: string;
  render: (palette: Palette) => ReactNode;
};

const shared = { width: "100%", height: "100%", minPixelRatio: 1 } as const;

const candidates: ReadonlyArray<Candidate> = [
  {
    id: "dithering-simplex",
    label: "Dithering · simplex",
    note: "What the site ships today — soft cloudy grain.",
    render: ({ ink, transparent }) => (
      <Dithering
        {...shared}
        colorBack={transparent}
        colorFront={ink}
        shape="simplex"
        type="4x4"
        size={1.65}
        scale={0.92}
        speed={0.46}
      />
    ),
  },
  {
    id: "dithering-warp",
    label: "Dithering · warp",
    note: "Same dots, marbled flowing streaks.",
    render: ({ ink, transparent }) => (
      <Dithering
        {...shared}
        colorBack={transparent}
        colorFront={ink}
        shape="warp"
        type="4x4"
        size={1.65}
        scale={0.8}
        speed={0.4}
      />
    ),
  },
  {
    id: "dithering-swirl",
    label: "Dithering · swirl",
    note: "Slow rotating spiral of dots.",
    render: ({ ink, transparent }) => (
      <Dithering
        {...shared}
        colorBack={transparent}
        colorFront={ink}
        shape="swirl"
        type="4x4"
        size={1.6}
        scale={0.7}
        speed={0.3}
      />
    ),
  },
  {
    id: "dithering-ripple",
    label: "Dithering · ripple",
    note: "Concentric wave rings.",
    render: ({ ink, transparent }) => (
      <Dithering
        {...shared}
        colorBack={transparent}
        colorFront={ink}
        shape="ripple"
        type="4x4"
        size={1.7}
        scale={0.9}
        speed={0.25}
      />
    ),
  },
  {
    id: "dithering-sphere",
    label: "Dithering · sphere",
    note: "Domed radial falloff, no CSS mask needed.",
    render: ({ ink, transparent }) => (
      <Dithering
        {...shared}
        colorBack={transparent}
        colorFront={ink}
        shape="sphere"
        type="8x8"
        size={1.8}
        scale={0.95}
        speed={0.5}
      />
    ),
  },
  {
    id: "dithering-8x8",
    label: "Dithering · 8×8 Bayer",
    note: "Simplex again, finer ordered-dither matrix.",
    render: ({ ink, transparent }) => (
      <Dithering
        {...shared}
        colorBack={transparent}
        colorFront={ink}
        shape="simplex"
        type="8x8"
        size={1.4}
        scale={0.92}
        speed={0.46}
      />
    ),
  },
  {
    id: "grain-gradient",
    label: "GrainGradient",
    note: "Grainy field, no dot grid.",
    render: ({ ink, paper }) => (
      <GrainGradient
        {...shared}
        colorBack={paper}
        colors={[ink]}
        softness={0.7}
        intensity={0.3}
        noise={0.4}
        speed={0.4}
      />
    ),
  },
  {
    id: "neuro-noise",
    label: "NeuroNoise",
    note: "Fine filament structures.",
    render: ({ ink, paper }) => (
      <NeuroNoise
        {...shared}
        colorBack={paper}
        colorMid={ink}
        colorFront={ink}
        scale={0.6}
        speed={0.4}
      />
    ),
  },
  {
    id: "voronoi",
    label: "Voronoi",
    note: "Organic cell mosaic.",
    render: ({ ink, paper }) => (
      <Voronoi
        {...shared}
        colors={[ink, paper]}
        colorGap={paper}
        colorGlow={ink}
        stepsPerColor={2}
        scale={0.7}
        speed={0.3}
      />
    ),
  },
  {
    id: "warp",
    label: "Warp",
    note: "Flowing warped bands.",
    render: ({ ink, paper }) => (
      <Warp {...shared} colors={[paper, ink]} scale={0.8} speed={0.3} />
    ),
  },
  {
    id: "swirl",
    label: "Swirl",
    note: "Continuous rotating vortex.",
    render: ({ ink, paper }) => (
      <Swirl
        {...shared}
        colorBack={paper}
        colors={[ink]}
        scale={0.8}
        speed={0.3}
      />
    ),
  },
  {
    id: "waves",
    label: "Waves",
    note: "Regular line waves — very graphic.",
    render: ({ ink, paper }) => (
      <Waves {...shared} colorBack={paper} colorFront={ink} scale={0.8} />
    ),
  },
  {
    id: "simplex-noise",
    label: "SimplexNoise",
    note: "Raw noise, no dithering.",
    render: ({ ink, paper }) => (
      <SimplexNoise {...shared} colors={[paper, ink]} scale={0.8} speed={0.3} />
    ),
  },
  {
    id: "perlin-noise",
    label: "PerlinNoise",
    note: "Softer, cloudier noise.",
    render: ({ ink, paper }) => (
      <PerlinNoise {...shared} colorBack={paper} colorFront={ink} speed={0.3} />
    ),
  },
  {
    id: "dot-grid",
    label: "DotGrid",
    note: "Static regular dot lattice.",
    render: ({ ink, paper }) => (
      <DotGrid
        {...shared}
        colorBack={paper}
        colorFill={ink}
        colorStroke={paper}
        size={1.5}
      />
    ),
  },
  {
    id: "dot-orbit",
    label: "DotOrbit",
    note: "Dots orbiting their grid positions.",
    render: ({ ink, paper }) => (
      <DotOrbit {...shared} colorBack={paper} colors={[ink]} speed={0.3} />
    ),
  },
  {
    id: "smoke-ring",
    label: "SmokeRing",
    note: "Soft torus of smoke.",
    render: ({ ink, paper }) => (
      <SmokeRing {...shared} colorBack={paper} colors={[ink]} speed={0.4} />
    ),
  },
  {
    id: "god-rays",
    label: "GodRays",
    note: "Rays from an off-screen point.",
    render: ({ ink, paper }) => (
      <GodRays
        {...shared}
        colorBack={paper}
        colorBloom={ink}
        colors={[ink]}
        speed={0.3}
      />
    ),
  },
  {
    id: "spiral",
    label: "Spiral",
    note: "Hard spiral bands.",
    render: ({ ink, paper }) => (
      <Spiral
        {...shared}
        colorBack={paper}
        colorFront={ink}
        scale={0.7}
        speed={0.2}
      />
    ),
  },
  {
    id: "mesh-gradient",
    label: "MeshGradient",
    note: "Slow drifting colour mesh.",
    render: ({ ink, paper }) => (
      <MeshGradient {...shared} colors={[paper, ink]} speed={0.3} />
    ),
  },
  {
    id: "static-mesh-gradient",
    label: "StaticMeshGradient",
    note: "Same mesh, no motion at all.",
    render: ({ ink, paper }) => (
      <StaticMeshGradient {...shared} colors={[paper, ink]} />
    ),
  },
];

/*
 * Each tile is its own WebGL context and browsers only allow about sixteen at
 * once — mounting all of them at start silently killed the earliest canvases.
 * Tiles therefore only render while near the viewport, and release the context
 * when scrolled away.
 */
function ShaderTile({
  candidate,
  palette,
  onSelect,
}: {
  candidate: Candidate;
  palette: Palette;
  onSelect: () => void;
}) {
  const tileRef = useRef<HTMLButtonElement>(null);
  const [isNearViewport, setIsNearViewport] = useState(false);

  useEffect(() => {
    const tile = tileRef.current;

    if (!tile) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsNearViewport(entry.isIntersecting),
      { rootMargin: "120px" },
    );

    observer.observe(tile);

    return () => observer.disconnect();
  }, []);

  return (
    <button
      className="shader-tile"
      ref={tileRef}
      type="button"
      onClick={onSelect}
    >
      <span className="shader-tile__canvas" aria-hidden="true">
        {isNearViewport ? candidate.render(palette) : null}
      </span>
      <span className="shader-tile__label">{candidate.label}</span>
      <span className="shader-tile__note">{candidate.note}</span>
    </button>
  );
}

export function ShaderLab() {
  const { theme } = useTheme();
  const [focused, setFocused] = useState<string | null>(null);

  const palette: Palette = {
    ink: shaderInk[theme],
    paper: themeColors[theme],
    transparent: "rgba(0, 0, 0, 0)",
  };

  const focusedCandidate = candidates.find(
    (candidate) => candidate.id === focused,
  );

  return (
    <div className="shader-lab">
      <header className="shader-lab__header">
        <h1>Shader lab</h1>
        <p>
          {`${candidates.length} candidates in the site's own ink and paper. `}
          Click a tile to see it full-screen. Toggle the theme to check both
          palettes. Delete <code>app/shader-lab</code> and{" "}
          <code>components/shader-lab*</code> once you have chosen.
        </p>
      </header>

      <div className="shader-lab__grid">
        {candidates.map((candidate) => (
          <ShaderTile
            candidate={candidate}
            key={candidate.id}
            palette={palette}
            onSelect={() => setFocused(candidate.id)}
          />
        ))}
      </div>

      {focusedCandidate && (
        <div className="shader-focus" role="dialog" aria-modal="true">
          <div className="shader-focus__canvas" aria-hidden="true">
            {focusedCandidate.render(palette)}
          </div>
          <div className="shader-focus__bar">
            <div>
              <strong>{focusedCandidate.label}</strong>
              <span>{focusedCandidate.note}</span>
            </div>
            <button type="button" onClick={() => setFocused(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
