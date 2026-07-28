import type { Metadata } from "next";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export const metadata: Metadata = {
  title: "Lab",
  robots: { index: false, follow: false },
};

/*
 * Working tools, not portfolio content. Every lab route is noindex and listed
 * in robots.ts; nothing on the public site links here.
 */
const labs = [
  {
    href: "/design-lab",
    name: "Design lab",
    note: "Every palette token, the type scale, prose elements and control states, in the active theme.",
  },
  {
    href: "/shader-lab",
    name: "Shader lab",
    note: "All Paper shader candidates in the site's own ink and paper. Click a tile for full-screen.",
  },
];

export default function LabPage() {
  return (
    <main className="lab">
      <ThemeToggle />

      <div className="lab__shell">
        <nav className="post-nav">
          <Link href="/">Saidev Dhal</Link>
        </nav>

        <header className="lab__header">
          <h1>Lab</h1>
          <p>Internal tools for building the site. Not indexed, not linked.</p>
        </header>

        <div className="project-list">
          {labs.map((lab) => (
            <Link className="project-entry" href={lab.href} key={lab.href}>
              <span className="project-entry__title">
                <span className="project-entry__name">{lab.name}</span>
                <span className="project-entry__meta">{lab.href}</span>
              </span>
              <span className="project-entry__description">{lab.note}</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
