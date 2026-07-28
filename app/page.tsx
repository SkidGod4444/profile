import { CalendarDays, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Backdrop } from "@/components/backdrop";
import { PersonSchema } from "@/components/structured-data";
import { Segments } from "@/components/segments";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { links, siteConfig } from "@/lib/site-config";
import {
  formatPostDate,
  getPublishedPosts,
  getPublishedProjects,
} from "@/lib/source";

const compactNumberFormatter = new Intl.NumberFormat("en", {
  maximumFractionDigits: 0,
  notation: "compact",
});

/**
 * Revalidated hourly so the count stays current without hitting GitHub on every
 * request. Any failure falls back to the last known value rather than blanking.
 */
async function fetchStarCount() {
  const { repo, fallbackStars } = siteConfig.flagship;

  try {
    const response = await fetch(`https://api.github.com/repos/${repo}`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return fallbackStars;
    }

    const repository: unknown = await response.json();

    if (
      typeof repository === "object" &&
      repository !== null &&
      "stargazers_count" in repository &&
      typeof repository.stargazers_count === "number"
    ) {
      return repository.stargazers_count;
    }

    return fallbackStars;
  } catch {
    return fallbackStars;
  }
}

export default async function Page() {
  const starCount = await fetchStarCount();
  const posts = getPublishedPosts();
  const recentPosts = posts.slice(0, siteConfig.writingsOnHome);
  const projects = getPublishedProjects();
  const formattedStars = compactNumberFormatter.format(starCount);

  return (
    <main className="profile" aria-labelledby="page-title">
      <PersonSchema />
      <Backdrop />
      <ThemeToggle />

      <div className="profile__shell">
        <header className="profile__header">
          <div className="profile__who">
            <Avatar className="profile__avatar">
              <AvatarImage src={siteConfig.avatar.src} alt="" />
              <AvatarFallback>{siteConfig.avatar.initials}</AvatarFallback>
            </Avatar>
            <div className="profile__identity">
              <h1 id="page-title">{siteConfig.name}</h1>
              <p>{siteConfig.role}</p>
            </div>
          </div>

          <div className="profile__actions">
            <Button className="profile__action" variant="outline" asChild>
              <a href={links.cal} target="_blank" rel="noreferrer">
                <CalendarDays aria-hidden="true" />
                Schedule a meet
              </a>
            </Button>
            <Button className="profile__action" variant="outline" asChild>
              <a href={links.whatsapp} target="_blank" rel="noreferrer">
                <MessageCircle aria-hidden="true" />
                Let&rsquo;s chat
              </a>
            </Button>
          </div>
        </header>

        <section className="profile-section" aria-labelledby="now-title">
          <h2 id="now-title">Now</h2>
          <div className="profile-section__body">
            {siteConfig.now.map((paragraph, index) => (
              <p key={index}>
                <Segments segments={paragraph} starCount={formattedStars} />
              </p>
            ))}
          </div>
        </section>

        {recentPosts.length > 0 && (
          <section className="profile-section" aria-labelledby="writing-title">
            <h2 id="writing-title">Writing</h2>

            <div className="project-list">
              {recentPosts.map((post) => (
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

            {posts.length > recentPosts.length && (
              <p className="profile-section__more">
                <Link href="/writings">All posts</Link>
              </p>
            )}
          </section>
        )}

        <section className="profile-section" aria-labelledby="projects-title">
          <h2 id="projects-title">Projects</h2>

          {/* Rows go to the project's own page; the live site is linked
              there, alongside the write-up. */}
          <div className="project-list">
            {projects.map((project) => (
              <Link
                className="project-entry"
                href={project.url}
                key={project.url}
              >
                <span className="project-entry__title">
                  <span className="project-entry__name">
                    {project.data.title}
                  </span>
                  <span className="project-entry__meta">
                    {project.data.year}
                  </span>
                </span>
                <span className="project-entry__description">
                  {project.data.description}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <footer className="profile-footer">
          <p className="social-sentence">
            <Segments segments={siteConfig.footer} />
          </p>
        </footer>
      </div>
    </main>
  );
}
