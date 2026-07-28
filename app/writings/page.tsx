import type { Metadata } from "next";
import Link from "next/link";
import { Backdrop } from "@/components/backdrop";
import { BlogSchema } from "@/components/structured-data";
import { ThemeToggle } from "@/components/theme-toggle";
import { siteConfig } from "@/lib/site-config";
import { formatPostDate, getPublishedPosts } from "@/lib/source";

export const metadata: Metadata = {
  title: "Writing",
  description: `Blog posts and technical write-ups by ${siteConfig.name}.`,
  alternates: {
    canonical: "/writings",
    types: { "application/rss+xml": `${siteConfig.url}/feed.xml` },
  },
  openGraph: {
    type: "website",
    url: `${siteConfig.url}/writings`,
    title: `Writing — ${siteConfig.name}`,
    description: `Blog posts and technical write-ups by ${siteConfig.name}.`,
  },
};

export default function BlogIndexPage() {
  const posts = getPublishedPosts();

  return (
    <main className="profile" aria-labelledby="writing-title">
      <BlogSchema />
      <Backdrop />
      <ThemeToggle />

      <div className="profile__shell">
        <nav className="post-nav">
          <Link href="/">{siteConfig.name}</Link>
        </nav>

        <header className="profile__header">
          <div className="profile__identity">
            <h1 id="writing-title">Writing</h1>
            <p>Blog posts and technical write-ups.</p>
          </div>
        </header>

        <section className="profile-section">
          {posts.length === 0 ? (
            <p>No posts yet.</p>
          ) : (
            <div className="project-list">
              {posts.map((post) => (
                <Link className="project-entry" href={post.url} key={post.url}>
                  <span className="project-entry__title">
                    <span className="project-entry__name">
                      {post.data.title}
                    </span>
                    <time
                      className="project-entry__meta"
                      dateTime={new Date(post.data.date).toISOString()}
                    >
                      {formatPostDate(post.data.date)}
                    </time>
                  </span>
                  <span className="project-entry__description">
                    {post.data.description}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
