import { homeMarkdown, markdownHeaders } from "@/lib/markdown";

export const dynamic = "force-static";

export function GET() {
  return new Response(homeMarkdown(), {
    headers: markdownHeaders("/"),
  });
}
