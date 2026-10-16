import { markdownHeaders, talksMarkdown } from "@/lib/markdown";

/* Prerendered, then refreshed hourly as Luma changes — see lib/luma.ts. */
export const revalidate = 3600;

export async function GET() {
  return new Response(await talksMarkdown(), {
    headers: markdownHeaders("/talks"),
  });
}
