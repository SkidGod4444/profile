# assets

Build-time inputs for the generated social cards in `lib/og.tsx`. None of these
ship to the browser — they are read on the server to produce the card PNGs.

## Fonts

`InterTight-400.ttf`, `InterTight-600.ttf` — Inter Tight, SIL Open Font
License 1.1, from Google Fonts.

Vendored rather than fetched because satori (which backs `next/og`) cannot parse
woff2, and because a build should not depend on the network.

## og-backdrop.png

A single captured frame of the live WebGL backdrop, 1200×630.

Satori cannot run WebGL, so the shader can never render inside a card. This is a
real frame of it rather than an approximation. **Regenerate it whenever
`activeShader` or the palette changes in `components/backdrop-shader.tsx`**, or
the cards will keep showing the old shader.

To regenerate: run the site, open it at 1200×630, hide `.profile__shell` and
`.theme-toggle`, raise `.backdrop` opacity to ~0.55 so the texture reads at card
scale, and screenshot. `/shader-lab` is the quickest way to preview a
replacement before switching `activeShader`.
