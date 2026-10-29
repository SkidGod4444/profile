import { siteConfig } from "@/lib/site-config";
import { getPublishedPosts } from "@/lib/source";

/** XML has five predefined entities; missing any of them breaks strict readers. */
function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/*
 * The feed only changes when posts do, and posts require a rebuild, so it is
 * prerendered rather than served dynamically on every request.
 */
export const dynamic = "force-static";

export function GET() {
  const posts = getPublishedPosts();
  const updated = posts[0] ? new Date(posts[0].data.date) : new Date(0);

  const items = posts
    .map((post) => {
      const url = `${siteConfig.url}${post.url}`;

      return `    <item>
      <title>${escapeXml(post.data.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${new Date(post.data.date).toUTCString()}</pubDate>
      ${post.data.description ? `<description>${escapeXml(post.data.description)}</description>` : ""}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Writing — ${escapeXml(siteConfig.name)}</title>
    <link>${siteConfig.url}/writings</link>
    <description>${escapeXml(`Essays and technical write-ups by ${siteConfig.name}.`)}</description>
    <language>en</language>
    <lastBuildDate>${updated.toUTCString()}</lastBuildDate>
    <atom:link href="${siteConfig.url}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
