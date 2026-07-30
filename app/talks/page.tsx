import type { Metadata } from "next";
import Link from "next/link";
import { Backdrop } from "@/components/backdrop";
import { ThemeToggle } from "@/components/theme-toggle";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Talks",
  description: `Talks and workshops by ${siteConfig.name}.`,
  alternates: { canonical: "/talks" },
  openGraph: {
    type: "website",
    url: `${siteConfig.url}/talks`,
    title: `Talks — ${siteConfig.name}`,
    description: `Talks and workshops by ${siteConfig.name}.`,
  },
  /*
   * Nothing is listed yet, so keep it out of the index until it has content —
   * an empty page ranking for your name is worse than no page.
   */
  robots: siteConfig.talks.length > 0 ? undefined : { index: false, follow: true },
};

export default function TalksPage() {
  const { talks } = siteConfig;

  return (
    <main className="profile" aria-labelledby="talks-title">
      <Backdrop />
      <ThemeToggle />

      <div className="profile__shell">
        <nav className="post-nav">
          <Link href="/">{siteConfig.name}</Link>
        </nav>

        <header className="profile__header">
          <div className="profile__identity">
            <h1 id="talks-title">Talks</h1>
            <p>Talks and workshops.</p>
          </div>
        </header>

        <section className="profile-section">
          {talks.length === 0 ? (
            <div className="profile-section__body">
              <p>Nothing listed here yet.</p>
            </div>
          ) : (
            <div className="project-list">
              {talks.map((talk) => (
                <a
                  className="project-entry"
                  href={talk.href}
                  key={talk.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="project-entry__title">
                    <span className="project-entry__name">{talk.title}</span>
                    <span className="project-entry__meta">
                      {talk.date} · {talk.event}
                    </span>
                  </span>
                  <span className="project-entry__description">
                    {talk.note ?? "See the proof"}
                  </span>
                </a>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
