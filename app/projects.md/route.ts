import { markdownHeaders, projectsMarkdown } from "@/lib/markdown";

export const dynamic = "force-static";

export function GET() {
  return new Response(projectsMarkdown(), {
    headers: markdownHeaders("/projects"),
  });
}
