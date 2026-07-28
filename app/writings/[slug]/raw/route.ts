import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getPublishedPosts } from "@/lib/source";

/*
 * Serves a post as plain Markdown, for LLMs and for the "copy as Markdown"
 * action. Prerendered at build time, so reading from disk is safe — nothing
 * here touches the filesystem at request time.
 *
 * The posts are plain Markdown with no MDX components wired in, so the source
 * file is already the clean output; there is nothing to strip but frontmatter.
 */
export const dynamic = "force-static";

export function generateStaticParams() {
  return getPublishedPosts().map((post) => ({ slug: post.slugs[0] }));
}

/** Frontmatter is metadata for the site, not part of the article. */
function stripFrontmatter(source: string) {
  return source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "").trimStart();
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const post = getPublishedPosts().find((page) => page.slugs[0] === slug);

  if (!post) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const source = await readFile(
      join(process.cwd(), "content/writings", `${slug}.mdx`),
      "utf8",
    );

    const body = `# ${post.data.title}\n\n${stripFrontmatter(source)}`;

    return new Response(body, {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Cache-Control": "public, max-age=0, s-maxage=3600",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
