import type { Metadata } from "next";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Design lab",
  robots: { index: false, follow: false },
};

/*
 * Every design token rendered at once, in whichever theme is active. This is
 * how you catch a token that reads wrong somewhere it is not usually seen —
 * a warm grey that turns brown at full fill, a surface that vanishes on paper.
 */
const surfaces = [
  { name: "--paper", note: "page background" },
  { name: "--ink", note: "body text" },
  { name: "--ink-muted", note: "secondary text" },
  { name: "--ink-faint", note: "rules and borders" },
  { name: "--control-surface", note: "toggle, TOC panel" },
  { name: "--control-surface-hover", note: "hover state" },
  { name: "--control-ink", note: "control glyphs" },
  { name: "--code-surface", note: "code blocks" },
  { name: "--selection-surface", note: "text selection" },
  { name: "--selection-code-surface", note: "selection over code" },
  { name: "--scrollbar-thumb", note: "scrollbar" },
];

const typeScale = [
  { label: "Post title", cls: "post__header", tag: "h1" },
  { label: "Section heading", cls: "profile-section", tag: "h2" },
  { label: "Prose h2", cls: "prose", tag: "h2" },
  { label: "Prose h3", cls: "prose", tag: "h3" },
];

export default function DesignLabPage() {
  return (
    <main className="lab">
      <ThemeToggle />

      <div className="lab__shell">
        <nav className="post-nav">
          <Link href="/lab">Lab</Link>
        </nav>

        <header className="lab__header">
          <h1>Design lab</h1>
          <p>
            Every token in the active theme. Toggle the theme to check both —
            most palette bugs only show up on one side.
          </p>
        </header>

        <section className="lab__section">
          <h2>Surfaces &amp; ink</h2>
          <div className="swatches">
            {surfaces.map((token) => (
              <div className="swatch" key={token.name}>
                <span
                  className="swatch__chip"
                  style={{ background: `var(${token.name})` }}
                />
                <span className="swatch__meta">
                  <code>{token.name}</code>
                  <span className="swatch__note">{token.note}</span>
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="lab__section">
          <h2>Type scale</h2>
          <div className="lab__stack">
            {typeScale.map((item) => (
              <div className={item.cls} key={item.label}>
                {item.tag === "h1" ? (
                  <h1>{item.label} — Inter Tight</h1>
                ) : item.tag === "h2" ? (
                  <h2>{item.label} — Inter Tight</h2>
                ) : (
                  <h3>{item.label} — Inter Tight</h3>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="lab__section">
          <h2>Prose</h2>
          <div className="prose">
            <p>
              Body copy at the reading size, with <strong>bold</strong>,{" "}
              <em>italic</em>, <code>inline code</code> and a{" "}
              <a href="#prose">link</a>. Select this paragraph to check the
              selection colour.
            </p>
            <blockquote>
              <p>A blockquote, for setting something apart.</p>
            </blockquote>
            <ul>
              <li>An unordered item</li>
              <li>Another one</li>
            </ul>
            <pre>
              <code>{"const preset = { shape: \"simplex\" };"}</code>
            </pre>
          </div>
        </section>

        <section className="lab__section">
          <h2>Controls</h2>
          <div className="lab__row">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            <Button disabled>Disabled</Button>
          </div>
        </section>
      </div>
    </main>
  );
}
