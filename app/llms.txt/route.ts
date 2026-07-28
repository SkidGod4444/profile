import { siteConfig } from "@/lib/site-config";
import { getPublishedPosts, getPublishedProjects } from "@/lib/source";

/*
 * llms.txt — a plain-text index of the site for language models, pointing at
 * the raw Markdown of each post rather than the rendered HTML.
 *
 * Written by hand rather than with `llms()` from fumadocs-core, because that
 * helper builds its index from a docs page tree; this site has two flat
 * collections and a home page, which the tree does not model.
 */
export const dynamic = "force-static";

export function GET() {
  const posts = getPublishedPosts();
  const projects = getPublishedProjects();

  const lines = [
    `# ${siteConfig.name}`,
    "",
    `> ${siteConfig.description}`,
    "",
    "## Writing",
    "",
    ...posts.map(
      (post) =>
        `- [${post.data.title}](${siteConfig.url}${post.url}/raw)${
          post.data.description ? `: ${post.data.description}` : ""
        }`,
    ),
    "",
    "## Projects",
    "",
    ...projects.map(
      (project) =>
        `- [${project.data.title}](${project.data.url}): ${project.data.description}`,
    ),
    "",
    "## Links",
    "",
    `- [Site](${siteConfig.url})`,
    `- [RSS](${siteConfig.url}/feed.xml)`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
