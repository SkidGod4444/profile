import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AiActions } from "@/components/ai-actions";
import { Backdrop } from "@/components/backdrop";
import { displayUrl, External, Fact } from "@/components/facts";
import { PostToc } from "@/components/post-toc";
import { ProjectMedia } from "@/components/project-media";
import { ProjectSchema } from "@/components/structured-data";
import { ThemeToggle } from "@/components/theme-toggle";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";
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

  return pageMetadata({
    title: project.data.title,
    description: project.data.description ?? siteConfig.description,
    path: project.url,
  });
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = projects.getPage([slug]);

  if (!project) {
    notFound();
  }

  const Mdx = project.data.body;
  /* Frontmatter alone is a finished page; the write-up only appears once
     there is prose to read, and the sticky tools row only once that prose
     has headings worth a contents list. */
  const hasBody =
    project.data.toc.length > 0 ||
    project.data.structuredData.contents.length > 0;
  const hasToc = project.data.toc.length > 0;

  return (
    <main className="profile profile--reading">
      <ProjectSchema
        title={project.data.title}
        description={project.data.description}
        url={project.url}
        liveUrl={project.data.url}
        repo={project.data.repo}
        stack={project.data.stack}
        year={project.data.year}
        updated={project.data.updated}
      />
      <Backdrop />
      <ThemeToggle />

      <div className="profile__shell">
        <nav className="post-nav">
          <Link href="/projects">Projects</Link>
        </nav>

        <article className="post">
          {/* Without a write-up the header is the whole article, so it drops
              the reading gap it normally leaves before the prose. */}
          <header className={cn("post__header", !hasBody && "mb-0!")}>
            <h1>{project.data.title}</h1>
            <p className="text-[1.0625rem] leading-[1.5] tracking-[-0.018em] text-pretty text-(--ink-muted)">
              {project.data.description}
            </p>

            {/* A banded fact list on the same two columns as a project row,
                its rules running out to the grid lines like every other
                horizontal rule on the site. */}
            <dl className="-mx-(--gutter) mt-[clamp(1.75rem,4vw,2.25rem)] border-t border-(--grid-line)">
              <Fact label="Year">{project.data.year}</Fact>
              {project.data.stack.length > 0 && (
                <Fact label="Built with">{project.data.stack.join(", ")}</Fact>
              )}
              <Fact label="Live">
                <External href={project.data.url}>
                  {displayUrl(project.data.url)}
                </External>
              </Fact>
              {project.data.repo && (
                <Fact label="Source">
                  <External href={project.data.repo}>
                    {project.data.repo.replace("https://github.com/", "")}
                  </External>
                </Fact>
              )}
            </dl>

            <ProjectMedia items={project.data.media} />
          </header>

          {hasBody && (
            <>
              {hasToc && (
                <div className="post-tools">
                  <PostToc items={project.data.toc} />

                  <AiActions
                    rawPath={`${project.url}/raw`}
                    shareUrl={`${siteConfig.url}${project.url}/raw`}
                    title={project.data.title}
                  />
                </div>
              )}

              <div className="prose">
                <Mdx />
              </div>
            </>
          )}
        </article>
      </div>
    </main>
  );
}
