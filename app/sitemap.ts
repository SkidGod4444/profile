import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { getPublishedPosts, getPublishedProjects } from "@/lib/source";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPublishedPosts();
  const projects = getPublishedProjects();

  // The index is only as fresh as its newest post.
  const latestPostDate = posts[0]
    ? new Date(posts[0].data.date)
    : new Date("2026-07-28");

  return [
    {
      url: siteConfig.url,
      lastModified: latestPostDate,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/writings`,
      lastModified: latestPostDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/projects`,
      lastModified: latestPostDate,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    // Only advertised once it has content; see the robots rule on the page.
    ...(siteConfig.talks.length > 0
      ? [
          {
            url: `${siteConfig.url}/talks`,
            lastModified: latestPostDate,
            changeFrequency: "monthly" as const,
            priority: 0.6,
          },
        ]
      : []),
    ...projects.map((project) => ({
      url: `${siteConfig.url}${project.url}`,
      lastModified: latestPostDate,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
    ...posts.map((post) => ({
      url: `${siteConfig.url}${post.url}`,
      lastModified: new Date(post.data.date),
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}
