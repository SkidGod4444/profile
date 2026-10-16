import type { Metadata } from "next";
import Link from "next/link";
import { Backdrop } from "@/components/backdrop";
import { PaperList } from "@/components/paper-list";
import { ThemeToggle } from "@/components/theme-toggle";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { getPublishedPapers } from "@/lib/source";

export const metadata: Metadata = pageMetadata({
  title: "Papers",
  description: `Research papers ${siteConfig.name} has read, with notes.`,
  path: "/papers",
});

export default function PapersPage() {
  const papers = getPublishedPapers();

  return (
    <main className="profile" aria-labelledby="papers-title">
      <Backdrop />
      <ThemeToggle />

      <div className="profile__shell">
        <nav className="post-nav">
          <Link href="/">{siteConfig.name}</Link>
        </nav>

        <header className="profile__header">
          <div className="profile__identity">
            <h1 id="papers-title">Papers</h1>
            <p>Research papers, with notes.</p>
          </div>
        </header>

        <section className="profile-section">
          {papers.length === 0 ? (
            <div className="profile-section__body">
              <p>Nothing listed right now.</p>
            </div>
          ) : (
            <PaperList papers={papers} />
          )}
        </section>
      </div>
    </main>
  );
}
