import { blogPosts } from "collections/server";
import { loader } from "fumadocs-core/source";
import { toFumadocsSource } from "fumadocs-mdx/runtime/server";

/*
 * `blogPosts` is an array of collection entries, so it takes the standalone
 * `toFumadocsSource(pages, metas)` — the `.toFumadocsSource()` method shown in
 * the install guide only exists on the `defineDocs` wrapper. No meta files
 * here: ordering comes from the frontmatter date, not a meta.json.
 */
export const blog = loader({
  baseUrl: "/writings",
  source: toFumadocsSource(blogPosts, []),
});

export type BlogPage = ReturnType<typeof blog.getPages>[number];

/**
 * Published posts, newest first. Drafts are filtered here rather than at the
 * loader so they stay routable in `next dev` but never get listed or
 * pre-rendered for production.
 */
export function getPublishedPosts() {
  return blog
    .getPages()
    .filter((page) => !page.data.draft)
    .sort(
      (a, b) =>
        new Date(b.data.date).getTime() - new Date(a.data.date).getTime(),
    );
}

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export function formatPostDate(date: string | Date) {
  return dateFormatter.format(new Date(date));
}
