import { writingsIndexMarkdown } from "@/lib/markdown";

export const dynamic = "force-static";

export function GET() {
  return new Response(writingsIndexMarkdown(), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
