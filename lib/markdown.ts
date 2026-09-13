import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { formatLumaWhen, getLumaHostedEvents } from "./luma";
import { siteConfig, type Segment } from "./site-config";
import {
  formatPostDate,
  getPublishedPosts,
  getPublishedProjects,
} from "./source";

/*
 * Renders the site as Markdown for agents and language models.
 *
 * Everything here is derived from the same config and MDX collections the pages
 * render from, so the Markdown mirror cannot drift from the HTML. Used by
 * /index.md, the section .md routes, /llms.txt and /llms-full.txt.
 */

/** Segment prose (`now`, `past`, `footer`) into Markdown with inline links. */
export function segmentsToMarkdown(segments: readonly Segment[]) {
  return segments
    .map((segment) => {
      if (typeof segment === "string") {
        return segment;
      }

      if ("stars" in segment) {
        // The live count is fetched per-request on the page; the Markdown
        // mirror uses the recorded value rather than adding an API call here.
        return String(siteConfig.flagship.fallbackStars);
      }

      return `[${segment.text}](${segment.href})`;
    })
    .join("");
}

function paragraphs(blocks: readonly (readonly Segment[])[]) {
  return blocks.map((block) => segmentsToMarkdown(block)).join("\n\n");
}

export function homeMarkdown() {
  const projects = getPublishedProjects();
  const posts = getPublishedPosts();

  return [
    `# ${siteConfig.name}`,
    "",
    `${siteConfig.role} · ${siteConfig.location}`,
    "",
    "## Now",
    "",
    paragraphs(siteConfig.now),
    "",
    "## Past",
    "",
    paragraphs(siteConfig.past),
    "",
    "## Projects",
    "",
    ...projects.map(
      (project) =>
        `- **${project.data.title}** (${project.data.year}) — ${project.data.description} · [${project.data.url}](${project.data.url}) · [details](${siteConfig.url}${project.url})`,
    ),
    "",
    "## Writing",
    "",
    ...posts.map(
      (post) =>
        `- **${post.data.title}** (${formatPostDate(post.data.date)}) — ${post.data.description ?? ""} · [read](${siteConfig.url}${post.url}/raw)`,
    ),
    "",
    "## Contact",
    "",
    segmentsToMarkdown(siteConfig.footer),
    "",
  ].join("\n");
}

export function projectsMarkdown() {
  const projects = getPublishedProjects();

  return [
    `# Projects — ${siteConfig.name}`,
    "",
    ...projects.flatMap((project) => [
      `## ${project.data.title}`,
      "",
      project.data.description,
      "",
      `- Year: ${project.data.year}`,
      ...(project.data.stack.length > 0
        ? [`- Built with: ${project.data.stack.join(", ")}`]
        : []),
      `- Live: ${project.data.url}`,
      ...(project.data.repo ? [`- Source: ${project.data.repo}`] : []),
      "",
    ]),
  ].join("\n");
}

export async function talksMarkdown() {
  const events = await getLumaHostedEvents();
  const { talks } = siteConfig;

  const lines = [
    ...events.map(
      (event) =>
        `- **${event.name}** — ${formatLumaWhen(event)}${
          event.isOnline ? ", online" : event.city ? `, ${event.city}` : ""
        } · [Luma](${event.url})`,
    ),
    ...talks.map(
      (talk) =>
        `- **${talk.title}** — ${talk.event}, ${talk.date} · [proof](${talk.href})`,
    ),
  ];

  return [
    `# Talks — ${siteConfig.name}`,
    "",
    `Events hosted on Luma: ${siteConfig.luma.profile}`,
    "",
    ...(lines.length === 0 ? ["None listed right now."] : lines),
    "",
  ].join("\n");
}

export function writingsIndexMarkdown() {
  const posts = getPublishedPosts();

  return [
    `# Writing — ${siteConfig.name}`,
    "",
    ...posts.map(
      (post) =>
        `- **${post.data.title}** (${formatPostDate(post.data.date)}) — ${post.data.description ?? ""} · [full text](${siteConfig.url}${post.url}/raw)`,
    ),
    "",
  ].join("\n");
}

/** Frontmatter is site metadata, not part of the prose. */
function stripFrontmatter(source: string) {
  return source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "").trimStart();
}

async function postBody(slug: string) {
  try {
    return stripFrontmatter(
      await readFile(
        join(process.cwd(), "content/writings", `${slug}.mdx`),
        "utf8",
      ),
    );
  } catch {
    return "";
  }
}

/**
 * The whole portfolio in one document, including the full text of every post,
 * so an agent can read everything in a single request instead of crawling.
 */
export async function fullMarkdown() {
  const posts = getPublishedPosts();

  const bodies = await Promise.all(
    posts.map(async (post) => {
      const body = await postBody(post.slugs[0]);

      return [
        `## ${post.data.title}`,
        "",
        `${formatPostDate(post.data.date)} · ${siteConfig.url}${post.url}`,
        "",
        body,
        "",
      ].join("\n");
    }),
  );

  return [
    homeMarkdown(),
    "---",
    "",
    projectsMarkdown(),
    "---",
    "",
    await talksMarkdown(),
    "---",
    "",
    `# Writing — full text`,
    "",
    ...bodies,
  ].join("\n");
}
