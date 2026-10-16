import type { ReactNode } from "react";

/*
 * The banded fact list under a project or paper title: one row per fact, on
 * the same two columns as a list row, its rules running out to the grid lines
 * like every other horizontal rule on the site.
 */
export function Fact({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="grid grid-cols-[minmax(6.5rem,0.6fr)_1.45fr] gap-4 border-b border-(--grid-line) px-(--gutter) py-[0.7rem] text-[0.9375rem] leading-[1.5] tracking-[-0.012em] sm:grid-cols-[minmax(10.5rem,0.82fr)_1.45fr] sm:gap-[1.35rem]">
      <dt className="text-(--ink-muted)">{label}</dt>
      <dd className="min-w-0 wrap-anywhere text-(--ink) tabular-nums">
        {children}
      </dd>
    </div>
  );
}

/* Underlined like body links, with an outward arrow for leaving the site —
   the same glyph family as the back link's arrow. */
export function External({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      className="underline decoration-(--ink-faint) decoration-1 underline-offset-[0.18em] transition-[text-decoration-color] duration-150 after:text-(--ink-muted) after:content-['_↗'] hover:decoration-(--ink)"
      href={href}
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  );
}

/** Strips the scheme so a URL reads as a name rather than an address. */
export function displayUrl(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}
