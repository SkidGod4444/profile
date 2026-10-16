import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import {
  getPublishedPapers,
  getPublishedPosts,
  getPublishedProjects,
} from "@/lib/source";

/** Newest of a list of ISO dates, or undefined when nothing carries one. */
function latest(dates: Array<string | Date | undefined>) {
  const times = dates
    .filter((date): date is string | Date => date !== undefined)
    .map((date) => new Date(date).getTime());

  return times.length > 0 ? new Date(Math.max(...times)) : undefined;
}

/*
 * `lastModified` is only emitted where a real date exists. Google reads
 * lastmod to decide what to recrawl, and stops trusting it site-wide once it
 * finds one that is plainly wrong — which stamping every URL with the newest
 * post's date was. Home and talks change without a content edit, so they
 * carry no date at all. `changeFrequency` and `priority` are hints Google
 * ignores; they are kept for crawlers that still read them.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPublishedPosts();
  const projects = getPublishedProjects();
  const papers = getPublishedPapers();
  const base = siteConfig.url;

  return [
    { url: base, changeFrequency: "monthly", priority: 1 },
    {
      url: `${base}/writings`,
      lastModified: latest(posts.map((post) => post.data.updated ?? post.data.date)),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${base}/projects`,
      lastModified: latest(projects.map((project) => project.data.updated)),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${base}/papers`,
      lastModified: latest(papers.map((paper) => paper.data.updated ?? paper.data.date)),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    { url: `${base}/talks`, changeFrequency: "weekly", priority: 0.6 },
    ...projects.map((project) => ({
      url: `${base}${project.url}`,
      lastModified: project.data.updated
        ? new Date(project.data.updated)
        : undefined,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
    ...papers.map((paper) => ({
      url: `${base}${paper.url}`,
      lastModified: new Date(paper.data.updated ?? paper.data.date),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    ...posts.map((post) => ({
      url: `${base}${post.url}`,
      lastModified: new Date(post.data.updated ?? post.data.date),
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}
