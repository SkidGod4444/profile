# profile

Personal site for [Saidev Dhal](https://github.com/SkidGod4444) — one page and a
writing section over an animated Paper Shaders backdrop.

Built with Next.js 16 (App Router), React 19, shadcn/ui on Tailwind v4,
[`@paper-design/shaders`](https://paper.design), and Fumadocs for the writing.

Type is Inter Tight with JetBrains Mono for code, tracking tightened toward
[farza.com](https://farza.com)'s density (his h1 runs Inter 700 at `-0.042em`).

```bash
bun install
bun dev        # http://localhost:3000
bun run build  # typechecks, then builds
bun start
```

## Editing content

**`lib/site-config.ts` is the only file you need for content.** Name, role,
avatar, every URL, the "Now" prose, the project list and the footer sentence all
live there; the pages hold no copy of their own.

Prose that contains inline links is written as arrays of segments so it can stay
in the config rather than moving back into JSX:

```ts
[
  "I build ",
  { text: "Sapient", href: links.sapient },
  ". It has ",
  { stars: true }, // live star count for flagship.repo
  " stars.",
];
```

`components/segments.tsx` renders those.

## How it fits together

- `app/page.tsx` — the home page, a server component. It fetches the flagship
  repo's star count from the GitHub API (revalidated hourly, falling back to the
  last known value) so the number in the copy stays current on its own.
- `app/layout.tsx` — metadata plus an inline script that resolves the theme
  before first paint, so a dark-mode visitor never sees a flash of light paper.
- `components/backdrop.tsx` — lazy-loads the shader with `ssr: false`. Without a
  WebGL context it falls back to a static CSS dot grid.
- `components/backdrop-shader.tsx` — the live backdrop. `activeShader` at the top
  chooses which one; `Dithering` (simplex, 8×8 Bayer) today, with `GrainGradient`
  and `NeuroNoise` presets kept beside it so switching is one line. `colorBack` is
  transparent so only the ink draws and the paper shows through; the radial
  falloff is a CSS mask on `.backdrop__field`.

  Two dials control how present it is: `--backdrop-opacity` in `globals.css`
  (0.30 light / 0.26 dark, and 0.16 behind long reads) and the shader's own
  `intensity`. Both are deliberately low — the stock GrainGradient presets sit at
  `intensity: 0.5`, which reads as a poster gradient rather than a texture.
- `app/globals.css` — the layout is hand-written CSS with custom properties.
  shadcn's design tokens are remapped onto that palette rather than kept on their
  own neutral ramp, and its dark variant is repointed from `.dark` to
  `[data-theme="dark"]`, so both systems read one switch.

## Palette

A warm neutral (Tailwind's stone family), sampled from
[autosend.com](https://autosend.com): `#fafaf9` paper on `#292524` ink, with the
dark theme built from the same family's dark end (`#0c0a09` / `#fafaf9`) so the
two read as one design.

`--paper` is duplicated once outside the stylesheet, in `lib/theme.ts`, because
`<meta name="theme-color">` has to be set from JS. Keep the two in step.

## Writing

Posts are MDX in `content/writings/`, served at `/writings`. Frontmatter is
validated at build time by `source.config.ts`:

```yaml
---
title: A post
description: One line, shown in the listing.
date: 2026-07-28
draft: false # optional; true keeps it out of the listing and the build
---
```

Only the Fumadocs **content layer** is installed — `fumadocs-mdx` for parsing and
`fumadocs-core` for the page loader and Shiki. `fumadocs-ui` is deliberately
absent: it ships a docs shell with a sidebar and its own palette, and posts here
render in the site's own layout. `<Mdx />` gets no `components` prop, so you get
plain `h2`/`p`/`pre` that `.prose` in `globals.css` styles.

Newest post first, by frontmatter date. The three most recent also appear on the
home page. Each post gets a contents list above the article on small screens
only. `.source/` is generated at `dev`/`build` time and is gitignored.

Code blocks: Shiki runs with `defaultColor: false`, emitting `--shiki-light` and
`--shiki-dark` as CSS variables, and `globals.css` selects between them on
`[data-theme]` — not `.dark` or `prefers-color-scheme`. Only Shiki's syntax
colours are used; its theme backgrounds are dropped, because github-dark's
blue-grey surface clashes with the warm paper. The surface comes from
`--code-surface` instead.

## SEO

- `app/sitemap.ts`, `app/robots.ts` — generated; robots excludes `/shader-lab`.
- `app/feed.xml/route.ts` — RSS, `force-static`, advertised via
  `alternates.types` so readers autodiscover it.
- `app/opengraph-image.tsx` and the two under `app/writings/` — social cards
  generated with `next/og`, one per post, prerendered at build time.
  `lib/og.tsx` holds the shared template; it reads TTFs from `assets/` because
  satori cannot parse woff2 and a build should not need the network. Note that
  satori renders `radial-gradient` with a hard edge, so the card wash is linear.
- `components/structured-data.tsx` — JSON-LD. `Person` + `WebSite` on the home
  page, `Blog` on the index, `BlogPosting` + `BreadcrumbList` on each post. The
  person carries an `@id` the other schemas reference rather than repeat.
- Root metadata sets a title `template`, so child pages supply only their own
  title. `robots.googleBot['max-image-preview'] = 'large'` is what lets Google
  show the full card instead of a thumbnail.

`siteConfig.sameAs` currently points at link shorteners for X and LinkedIn.
Search engines follow them, but canonical profile URLs are stronger signals —
worth replacing when convenient.

## Shader lab

`/shader-lab` renders every Paper shader candidate in the site's own ink and
paper so a background can be picked by eye. Tiles mount their WebGL context only
while near the viewport, because browsers cap live contexts at around sixteen and
the grid has more tiles than that.

It is `noindex` and linked from nowhere. Delete `app/shader-lab/` and
`components/shader-lab*.tsx` when you no longer want it.

## Notes

- The theme storage key lives in `lib/theme.ts`, deliberately outside any
  `"use client"` module — a server component importing a const from a client
  module gets a client reference, not the string.
- Paper Shaders parses `rgba()` and 8-digit hex but not the keyword
  `transparent`, which it rejects at runtime.
- The shader ink in `lib/theme.ts` is *near*-neutral on purpose. The stone steps
  the text palette uses (`#78716c` / `#a8a29e`) are a visible taupe: the backdrop
  hides that at 26–30% opacity, but any shader that fills large areas — as most
  of the `/shader-lab` tiles do — renders it as outright brown.
- NeuroNoise *adds* light, so it needs different `brightness`/`contrast` per
  theme, not just a different ink — on near-white paper added light flattens the
  filaments into the background.
- Inter Tight is loaded with real italics on purpose: `font-synthesis: none`
  means a missing italic face renders `<em>` upright and emphasis silently
  disappears.
- `::selection` sets **background only**, and deliberately never `color`. A
  selection that sets `color` flattens every token in a code block to one shade,
  because `::selection` inherits from the *parent's* selection rather than the
  element's own text colour — so even `color: inherit` there resolves to the
  selection ink, not the syntax colour.
- Tailwind's preflight strips list markers and sets `cursor: default` on buttons;
  `globals.css` puts both back.
- `blogPosts` from `.source/server` is an array, so `lib/source.ts` uses the
  standalone `toFumadocsSource(pages, metas)`. The `.toFumadocsSource()` method
  in the install guide only exists on the `defineDocs` wrapper.
- ESLint ignores `.source/`; the generated files carry their own `@ts-nocheck`.

Design reference: [enesgules.com](https://enesgules.com)
([source](https://github.com/enesgules/website)), which drives a custom
multi-variant fragment shader from project hover. This site uses a stock shader
in a single resting state instead.
