import { pageSchema } from "fumadocs-core/source/schema";
import { defineCollections, defineConfig } from "fumadocs-mdx/config";
import { z } from "zod";

/*
 * Only the content layer of Fumadocs is used — MDX parsing, frontmatter
 * validation and Shiki highlighting. The `fumadocs-ui` docs theme is
 * deliberately not installed: it brings a sidebar shell and its own palette,
 * and this site renders posts in its own minimal layout instead.
 */
export const blogPosts = defineCollections({
  type: "doc",
  dir: "content/writings",
  schema: pageSchema.extend({
    date: z.string().date().or(z.date()),
    // Lets a post sit in the repo without being listed or routed.
    draft: z.boolean().default(false),
  }),
});

/*
 * Projects are MDX for the same reason posts are: a case study is long-form
 * prose, which does not belong in a TypeScript config. Frontmatter carries the
 * facts; the body is optional, so a project with no write-up yet still renders
 * as a finished page rather than an empty one.
 */
export const projectPages = defineCollections({
  type: "doc",
  dir: "content/projects",
  schema: pageSchema.extend({
    /** Live site or repo. */
    url: z.string().url(),
    repo: z.string().optional(),
    stack: z.array(z.string()).default([]),
    year: z.string(),
    /**
     * Screenshots and demos, shown edge to edge under the facts. The kind is
     * read off `src`: YouTube links embed, .mp4/.webm/.mov play inline,
     * anything else is an image.
     *
     * Image files live in content/projects/media/ and are named by file name
     * alone ("sapient.png"), so Next can read their size and build a blur
     * placeholder at build time. A remote image URL needs `width` and
     * `height`; without them it fills a 16:9 box. Video files go in public/.
     */
    media: z
      .array(
        z.object({
          src: z.string(),
          /** Alt text for images; the accessible title for video. */
          alt: z.string().default(""),
          caption: z.string().optional(),
          /** Still frame shown before a video plays. */
          poster: z.string().optional(),
          width: z.number().optional(),
          height: z.number().optional(),
        }),
      )
      .default([]),
    /** Lower sorts first on the index. */
    order: z.number().default(99),
    draft: z.boolean().default(false),
  }),
});

export default defineConfig();
