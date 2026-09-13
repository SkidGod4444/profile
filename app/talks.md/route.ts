import { talksMarkdown } from "@/lib/markdown";

/* Prerendered, then refreshed hourly as Luma changes — see lib/luma.ts. */
export const revalidate = 3600;

export async function GET() {
  return new Response(await talksMarkdown(), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
