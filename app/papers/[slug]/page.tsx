import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AiActions } from "@/components/ai-actions";
import { Backdrop } from "@/components/backdrop";
import { displayUrl, External, Fact } from "@/components/facts";
import { PostToc } from "@/components/post-toc";
import { PaperSchema } from "@/components/structured-data";
import { ThemeToggle } from "@/components/theme-toggle";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { getPublishedPapers, papers } from "@/lib/source";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getPublishedPapers().map((paper) => ({ slug: paper.slugs[0] }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const paper = papers.getPage([slug]);

  if (!paper) {
    return {};
  }

  return pageMetadata({
    title: paper.data.title,
    description: paper.data.description ?? siteConfig.description,
    path: paper.url,
    type: "article",
    publishedTime: new Date(paper.data.date).toISOString(),
    modifiedTime: new Date(paper.data.updated ?? paper.data.date).toISOString(),
  });
}

export default async function PaperPage({ params }: PageProps) {
  const { slug } = await params;
  const paper = papers.getPage([slug]);

  if (!paper) {
    notFound();
  }

  const Mdx = paper.data.body;
  /* Frontmatter alone is a finished page, the same as a project: the notes
     only appear once there is prose, and the tools row once there are
     headings worth a contents list. */
  const hasBody =
    paper.data.toc.length > 0 || paper.data.structuredData.contents.length > 0;
  const hasToc = paper.data.toc.length > 0;

  return (
    <main className="profile profile--reading">
      <PaperSchema
        title={paper.data.title}
        description={paper.data.description}
        url={paper.url}
        paperUrl={paper.data.url}
        authors={paper.data.authors}
        venue={paper.data.venue}
        year={paper.data.year}
        date={paper.data.date}
        updated={paper.data.updated}
      />
      <Backdrop />
      <ThemeToggle />

      <div className="profile__shell">
        <nav className="post-nav">
          <Link href="/papers">Papers</Link>
        </nav>

        <article className="post">
          <header className={cn("post__header", !hasBody && "mb-0!")}>
            <h1>{paper.data.title}</h1>
            {paper.data.description && (
              <p className="text-[1.0625rem] leading-[1.5] tracking-[-0.018em] text-pretty text-(--ink-muted)">
                {paper.data.description}
              </p>
            )}

            <dl className="-mx-(--gutter) mt-[clamp(1.75rem,4vw,2.25rem)] border-t border-(--grid-line)">
              {paper.data.authors.length > 0 && (
                <Fact label="Authors">{paper.data.authors.join(", ")}</Fact>
              )}
              {paper.data.venue && <Fact label="Venue">{paper.data.venue}</Fact>}
              <Fact label="Year">{paper.data.year}</Fact>
              <Fact label="Paper">
                <External href={paper.data.url}>
                  {displayUrl(paper.data.url)}
                </External>
              </Fact>
              {paper.data.pdf && (
                <Fact label="PDF">
                  <External href={paper.data.pdf}>
                    {displayUrl(paper.data.pdf)}
                  </External>
                </Fact>
              )}
            </dl>
          </header>

          {hasBody && (
            <>
              {hasToc && (
                <div className="post-tools">
                  <PostToc items={paper.data.toc} />

                  <AiActions
                    rawPath={`${paper.url}/raw`}
                    shareUrl={`${siteConfig.url}${paper.url}/raw`}
                    title={paper.data.title}
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
