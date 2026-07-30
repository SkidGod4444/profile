import { siteConfig } from "@/lib/site-config";
import { getPublishedPosts, getPublishedProjects } from "@/lib/source";

/*
 * llms.txt — a map of every Markdown mirror on the site, so an agent can find
 * what to fetch without parsing HTML.
 *
 * Written by hand rather than with `llms()` from fumadocs-core, which builds its
 * index from a docs page tree this site does not have.
 */
export const dynamic = "force-static";

export function GET() {
  const posts = getPublishedPosts();
  const projects = getPublishedProjects();
  const base = siteConfig.url;

  const lines = [
    `# ${siteConfig.name}`,
    "",
    `> ${siteConfig.description}`,
    "",
    "Every page below is available as plain Markdown. Fetch",
    `${base}/llms-full.txt to read the entire site, including the full text of`,
    "every post, in one request.",
    "",
    "## Whole site",
    "",
    `- [Everything, full text](${base}/llms-full.txt)`,
    `- [Home](${base}/index.md)`,
    "",
    "## Sections",
    "",
    `- [Writing index](${base}/writings.md)`,
    `- [Projects index](${base}/projects.md)`,
    `- [Talks](${base}/talks.md)`,
    "",
    "## Posts",
    "",
    ...posts.map(
      (post) =>
        `- [${post.data.title}](${base}${post.url}/raw)${
          post.data.description ? `: ${post.data.description}` : ""
        }`,
    ),
    "",
    "## Projects",
    "",
    ...projects.map(
      (project) =>
        `- [${project.data.title}](${base}${project.url}/raw): ${project.data.description} (live: ${project.data.url})`,
    ),
    "",
    "## Feeds",
    "",
    `- [RSS](${base}/feed.xml)`,
    `- [Sitemap](${base}/sitemap.xml)`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
