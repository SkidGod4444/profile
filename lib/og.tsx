import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { siteConfig } from "./site-config";

/*
 * Shared template for every generated social card. Fonts are read off disk
 * rather than fetched at build time so a build never depends on the network —
 * satori also cannot parse woff2, hence the vendored TTFs in /assets.
 */
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

// The site's dark palette, since dark is the default theme.
const paper = "#0c0a09";
const ink = "#fafaf9";
const muted = "#a8a29e";
const line = "rgba(250,250,249,0.14)";

/*
 * A real frame of the WebGL backdrop, captured at card size and vendored.
 * Satori cannot run WebGL, so the shader itself can never render here — this is
 * the actual thing rather than an approximation of it. Regenerate it if the
 * active shader changes; see the note in assets/README.md.
 */
async function loadBackdrop() {
  const png = await readFile(join(process.cwd(), "assets/og-backdrop.png"));

  return `data:image/png;base64,${png.toString("base64")}`;
}

async function loadFonts() {
  const [regular, semibold] = await Promise.all([
    readFile(join(process.cwd(), "assets/InterTight-400.ttf")),
    readFile(join(process.cwd(), "assets/InterTight-600.ttf")),
  ]);

  return [
    { name: "Inter Tight", data: regular, weight: 400 as const, style: "normal" as const },
    { name: "Inter Tight", data: semibold, weight: 600 as const, style: "normal" as const },
  ];
}

type CardProps = {
  /** Large line. Wraps, so keep it to roughly a dozen words. */
  title: string;
  /** Small line above the title. */
  eyebrow?: string;
  /** Muted line under the title. */
  subtitle?: string;
  /** Right-hand footer slot. Omit when it would repeat the subtitle. */
  footerRight?: string;
};

export async function renderOgImage({
  title,
  eyebrow,
  subtitle,
  footerRight,
}: CardProps) {
  const [fonts, backdrop] = await Promise.all([loadFonts(), loadBackdrop()]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          // Fallback colour; the captured frame paints over it.
          background: paper,
          color: ink,
          fontFamily: "Inter Tight",
          padding: "72px 80px",
        }}
      >
        {/* Painted first so everything after it sits on top. This JSX is
            rendered by satori into a PNG, never by a browser, so next/image
            does not apply here. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={backdrop}
          width={ogSize.width}
          height={ogSize.height}
          alt=""
          style={{ position: "absolute", top: 0, left: 0 }}
        />

        <div style={{ display: "flex", fontSize: 26, color: muted, letterSpacing: -0.5 }}>
          {eyebrow ?? siteConfig.name}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              display: "flex",
              fontSize: title.length > 48 ? 62 : 76,
              fontWeight: 600,
              letterSpacing: -2.6,
              lineHeight: 1.08,
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
          {subtitle ? (
            <div style={{ display: "flex", fontSize: 30, color: muted, letterSpacing: -0.7 }}>
              {subtitle}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 28,
            borderTop: `1px solid ${line}`,
            fontSize: 24,
            color: muted,
            letterSpacing: -0.5,
          }}
        >
          <div style={{ display: "flex" }}>
            {siteConfig.url.replace("https://", "")}
          </div>
          {footerRight ? (
            <div style={{ display: "flex" }}>{footerRight}</div>
          ) : null}
        </div>
      </div>
    ),
    { ...ogSize, fonts },
  );
}
