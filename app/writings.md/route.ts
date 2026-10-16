import { markdownHeaders, writingsIndexMarkdown } from "@/lib/markdown";

export const dynamic = "force-static";

export function GET() {
  return new Response(writingsIndexMarkdown(), {
    headers: markdownHeaders("/writings"),
  });
}
