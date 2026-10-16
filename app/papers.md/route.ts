import { markdownHeaders, papersMarkdown } from "@/lib/markdown";

export const dynamic = "force-static";

export function GET() {
  return new Response(papersMarkdown(), { headers: markdownHeaders("/papers") });
}
