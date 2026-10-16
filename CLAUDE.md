# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

Saidev Dhal's personal site: one page, a writing section, project pages, and an
animated WebGL backdrop.

## Commands

Always use **bun**, never npm/yarn/pnpm.

```bash
bun install
bun dev          # http://localhost:3000
bun run build    # typechecks, generates .source, then builds
bun run lint     # eslint
bun start
```

There is no test suite. **`bun run build` is the verification gate**, not
`bun dev` — the backdrop, OG images and MDX codegen all fail in ways dev does
not surface. A clean typecheck alone proves nothing.

Content is prerendered, so verify visual work by loading the running site in a
browser rather than reasoning from the CSS.

## Content architecture

Long-form content is MDX, parsed by **Fumadocs' content layer only**.
`fumadocs-ui` is deliberately not installed: it ships a docs shell with its own
sidebar and palette, and this site renders posts in its own layout. `<Mdx />`
gets no `components` prop, so MDX emits plain `h2`/`p`/`pre` that `.prose` in
`globals.css` styles.

Three collections, all declared in `source.config.ts` and loaded in
`lib/source.ts`:

| Collection     | Files                | Route               | Ordered by         |
| -------------- | -------------------- | ------------------- | ------------------ |
| `blogPosts`    | `content/writings/`  | `/writings/[slug]`  | frontmatter `date` |
| `projectPages` | `content/projects/`  | `/projects/[slug]`  | frontmatter `order` |
| `paperPages`   | `content/papers/`    | `/papers/[slug]`    | frontmatter `date`  |

Things that will bite:

- `.source/` is **generated** at dev/build time and gitignored. After changing
  `source.config.ts`, read the regenerated `.source/server.ts` before writing
  loader code — the exports are **arrays**, so `lib/source.ts` uses the
  standalone `toFumadocsSource(pages, metas)`. The `.toFumadocsSource()` method
  in Fumadocs' install guide only exists on the `defineDocs` wrapper.
- ESLint ignores `.source/`; the generated files carry their own `@ts-nocheck`.
- Project and paper bodies are intentionally optional. Frontmatter alone renders a
  complete page, so a project with no write-up still looks finished.
- Project `media` (frontmatter) renders under the facts. Image files go in
  `content/projects/media/` and are named by file name only: the component
  dynamic-imports them so `next/image` gets real dimensions and a blur
  placeholder. Turbopack needs at least one image in that folder to build
  the import context, which is what `placeholder.png` is for — do not delete
  it. YouTube URLs embed, video files play inline.

`lib/site-config.ts` holds identity, every URL, the "Now" prose and the footer —
but **not** the project list, which lives in MDX. Prose containing inline links
is written as arrays of segments rendered by `components/segments.tsx`, so copy
stays in the config instead of JSX.

## Theming

`data-theme` on `<html>` drives everything. **Dark is the default and is
server-rendered** in `app/layout.tsx`, so the correct palette is in the initial
HTML and survives with JS disabled; the inline bootstrap script only applies an
explicitly stored override. OS `prefers-color-scheme` is deliberately ignored.

Three systems are reconciled onto that one switch:

- shadcn's design tokens are remapped onto the site palette in `:root` and its
  dark variant is repointed from `.dark` to `[data-theme="dark"]`. Because the
  tokens reference `--paper`/`--ink`, they need no dark-mode duplicates.
- Shiki runs with `defaultColor: false`, emitting `--shiki-light`/`--shiki-dark`
  as CSS variables; `globals.css` selects between them on `[data-theme]`. Only
  its syntax colours are used — its theme backgrounds are dropped for
  `--code-surface`.
- `lib/theme.ts` holds the storage key and the `theme-color`/shader palettes. It
  **must not** be a `"use client"` module: a server component importing a const
  from a client module receives a client reference, not the string.

## Layout and CSS

Hand-written CSS with custom properties; Tailwind is present only because
shadcn requires it. Ordering matters — unlayered site CSS beats Tailwind's
layered utilities, which is what lets `.theme-toggle` override shadcn's `Button`.

- **Grid**: `.profile__shell` draws a vertical rule at each column edge via
  `::before`/`::after`, so they inherit the column width by construction.
  `--gutter` is the space between rules and text; rule-bearing blocks break back
  out with `margin-inline: calc(var(--gutter) * -1)` and re-pad their contents,
  so horizontal borders terminate on the vertical lines. The shell is
  `min-height: 100svh` so rules reach the bottom on short pages.
- **Never hand-write `-webkit-backdrop-filter` alongside `backdrop-filter`.**
  Lightning CSS collapses them and keeps only the prefixed one, so the property
  silently never applies. Declare the standard property and let the build prefix.
- `::selection` sets **background only**, never `color`: a selection that sets
  colour flattens every token in a code block, because `::selection` inherits
  from the parent's selection rather than the element's own text colour.
- Tailwind's preflight strips list markers and sets `cursor: default` on
  buttons; `globals.css` restores both.

## Backdrop shader

`components/backdrop-shader.tsx` renders one Paper shader, chosen by the
`activeShader` constant at the top — presets for the alternatives are kept
beside it so switching is one line. `colorBack` is transparent so only ink draws
over the paper; falloff is a CSS mask.

- Loaded through `dynamic(..., { ssr: false })` because it touches WebGL on
  import. `ssr: false` is illegal in a Server Component, hence the client
  wrapper components.
- Paper Shaders parses `rgba()` and 8-digit hex but **rejects** the keyword
  `transparent`.
- Browsers cap live WebGL contexts at roughly sixteen. `/shader-lab` has more
  tiles than that, so tiles mount only while near the viewport.
- Shader ink in `lib/theme.ts` is only *just* warm on purpose — the stone steps
  the text palette uses render as brown when a shader fills large areas.

## Generated routes

`app/opengraph-image.tsx` and its siblings build social cards with `next/og`.
`lib/og.tsx` reads TTFs and a captured shader frame from `assets/` — satori
cannot parse woff2, cannot run WebGL, and renders `radial-gradient` with a hard
edge, so gradients there must be linear. **Regenerate `assets/og-backdrop.png`
whenever `activeShader` or the palette changes**; see `assets/README.md`.

`/api/visits` proxies Vercel's Web Analytics count endpoint server-side because
the token is a secret. It returns `{configured:false}` when unset, and the
footer counter renders nothing rather than a misleading zero.

## Labs

`/lab` indexes `/design-lab` and `/shader-lab`. These are working tools, not
content: keep them `noindex` and add any new lab route to the `disallow` list in
`app/robots.ts`.

## Writing style

When drafting or editing anything in `content/writings/`, use the
`refine-writing` skill in `.claude/skills/`. Never invent technical claims,
opinions or biographical detail in Saidev's first person — that copy is his.
