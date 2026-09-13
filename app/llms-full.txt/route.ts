import { fullMarkdown } from "@/lib/markdown";

/*
 * The entire portfolio, including the full text of every post, in one document.
 * The `llms-full.txt` convention: an agent can read the whole site in a single
 * request rather than crawling page by page.
 */
export const dynamic = "force-static";
/* Embeds the Luma-backed talks list, so it refreshes on the same clock. */
export const revalidate = 3600;

export async function GET() {
  return new Response(await fullMarkdown(), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
