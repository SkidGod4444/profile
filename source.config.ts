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
    /** Lower sorts first on the index. */
    order: z.number().default(99),
    draft: z.boolean().default(false),
  }),
});

export default defineConfig();
