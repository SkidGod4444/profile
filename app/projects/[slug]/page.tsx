import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Backdrop } from "@/components/backdrop";
import { ThemeToggle } from "@/components/theme-toggle";
import { siteConfig } from "@/lib/site-config";
import { getPublishedProjects, projects } from "@/lib/source";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getPublishedProjects().map((project) => ({ slug: project.slugs[0] }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.getPage([slug]);

  if (!project) {
    return {};
  }

  return {
    title: project.data.title,
    description: project.data.description,
    alternates: { canonical: project.url },
    openGraph: {
      type: "website",
      url: `${siteConfig.url}${project.url}`,
      title: project.data.title,
      description: project.data.description,
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = projects.getPage([slug]);

  if (!project) {
    notFound();
  }

  const Mdx = project.data.body;

  return (
    <main className="profile profile--reading">
      <Backdrop />
      <ThemeToggle />

      <div className="profile__shell">
        <nav className="post-nav">
          <Link href="/projects">Projects</Link>
        </nav>

        <article className="post">
          <header className="post__header">
            <h1>{project.data.title}</h1>
            <p className="post__lede">{project.data.description}</p>

            <dl className="project-facts">
              <div className="project-facts__row">
                <dt>Year</dt>
                <dd>{project.data.year}</dd>
              </div>
              {project.data.stack.length > 0 && (
                <div className="project-facts__row">
                  <dt>Built with</dt>
                  <dd>{project.data.stack.join(", ")}</dd>
                </div>
              )}
              <div className="project-facts__row">
                <dt>Live</dt>
                <dd>
                  <a href={project.data.url} target="_blank" rel="noreferrer">
                    {project.data.url.replace(/^https?:\/\//, "")}
                  </a>
                </dd>
              </div>
              {project.data.repo && (
                <div className="project-facts__row">
                  <dt>Source</dt>
                  <dd>
                    <a
                      href={project.data.repo}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {project.data.repo.replace("https://github.com/", "")}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </header>

          {/* Optional: a project with no write-up yet still renders as a
              finished page, just the facts above. */}
          <div className="prose">
            <Mdx />
          </div>
        </article>
      </div>
    </main>
  );
}
