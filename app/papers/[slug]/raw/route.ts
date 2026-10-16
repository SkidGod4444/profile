import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { markdownHeaders } from "@/lib/markdown";
import { getPublishedPapers } from "@/lib/source";

/*
 * Serves a paper page as plain Markdown: the facts from frontmatter, then the
 * notes. Prerendered at build time, so reading from disk is safe.
 */
export const dynamic = "force-static";

export function generateStaticParams() {
  return getPublishedPapers().map((paper) => ({ slug: paper.slugs[0] }));
}

/** Frontmatter is site metadata, not part of the notes. */
function stripFrontmatter(source: string) {
  return source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "").trimStart();
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const paper = getPublishedPapers().find((page) => page.slugs[0] === slug);

  if (!paper) {
    return new Response("Not found", { status: 404 });
  }

  let body = "";

  try {
    body = stripFrontmatter(
      await readFile(
        join(process.cwd(), "content/papers", `${slug}.mdx`),
        "utf8",
      ),
    );
  } catch {
    // A paper with no notes still has its facts.
  }

  const markdown = [
    `# ${paper.data.title}`,
    "",
    ...(paper.data.description ? [paper.data.description, ""] : []),
    ...(paper.data.authors.length > 0
      ? [`- Authors: ${paper.data.authors.join(", ")}`]
      : []),
    ...(paper.data.venue ? [`- Venue: ${paper.data.venue}`] : []),
    `- Year: ${paper.data.year}`,
    `- Paper: ${paper.data.url}`,
    ...(paper.data.pdf ? [`- PDF: ${paper.data.pdf}`] : []),
    "",
    body,
  ].join("\n");

  return new Response(markdown, { headers: markdownHeaders(paper.url) });
}
