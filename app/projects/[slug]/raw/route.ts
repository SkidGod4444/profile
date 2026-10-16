import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { markdownHeaders } from "@/lib/markdown";
import { getPublishedProjects } from "@/lib/source";

/*
 * A project as plain Markdown — parity with /writings/[slug]/raw. Frontmatter
 * becomes a short fact list, then whatever body the MDX file has (currently
 * none of them have one).
 */
export const dynamic = "force-static";

export function generateStaticParams() {
  return getPublishedProjects().map((project) => ({ slug: project.slugs[0] }));
}

function stripFrontmatter(source: string) {
  return source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "").trimStart();
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const project = getPublishedProjects().find(
    (page) => page.slugs[0] === slug,
  );

  if (!project) {
    return new Response("Not found", { status: 404 });
  }

  let body = "";

  try {
    body = stripFrontmatter(
      await readFile(
        join(process.cwd(), "content/projects", `${slug}.mdx`),
        "utf8",
      ),
    );
  } catch {
    // A missing file just means no write-up; the facts below still stand.
  }

  const markdown = [
    `# ${project.data.title}`,
    "",
    project.data.description,
    "",
    `- Year: ${project.data.year}`,
    ...(project.data.stack.length > 0
      ? [`- Built with: ${project.data.stack.join(", ")}`]
      : []),
    `- Live: ${project.data.url}`,
    ...(project.data.repo ? [`- Source: ${project.data.repo}`] : []),
    ...project.data.media.map(
      (item) => `- Media: ${item.src}${item.caption ? ` — ${item.caption}` : ""}`,
    ),
    "",
    body,
  ].join("\n");

  return new Response(markdown, {
    headers: markdownHeaders(project.url),
  });
}
