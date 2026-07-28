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

export default defineConfig();
