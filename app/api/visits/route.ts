/*
 * Proxies Vercel's Web Analytics count endpoint.
 *
 * This exists as a route rather than a server component so the home page stays
 * statically prerendered — the count is fetched separately, on the client,
 * against this cached endpoint.
 *
 * The token is a secret and must never reach the browser, which is the whole
 * reason for the proxy.
 */

/** Cached at the edge; the number does not need to be to-the-second. */
export const revalidate = 60;

const endpoint = "https://api.vercel.com/v1/query/web-analytics/visits/count";

export async function GET() {
  const token = process.env.VERCEL_TOKEN;
  // Vercel injects VERCEL_PROJECT_ID automatically in its own environments.
  const projectId = process.env.VERCEL_PROJECT_ID;
  // Only set for team-owned projects; omitted for a personal account.
  const teamId = process.env.VERCEL_TEAM_ID;

  if (!token || !projectId) {
    // Unconfigured — locally, or before the token is set. Not an error.
    return Response.json({ configured: false }, { status: 200 });
  }

  const params = new URLSearchParams({ projectId });

  if (teamId) {
    params.set("teamId", teamId);
  }

  try {
    const response = await fetch(`${endpoint}?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate },
    });

    if (!response.ok) {
      return Response.json({ configured: false }, { status: 200 });
    }

    const payload: unknown = await response.json();
    const data =
      typeof payload === "object" && payload !== null && "data" in payload
        ? (payload as { data: { pageviews?: number; visitors?: number } }).data
        : null;

    if (!data || typeof data.pageviews !== "number") {
      return Response.json({ configured: false }, { status: 200 });
    }

    return Response.json({
      configured: true,
      pageviews: data.pageviews,
      visitors: data.visitors ?? null,
    });
  } catch {
    // A failing counter must never take the page down with it.
    return Response.json({ configured: false }, { status: 200 });
  }
}
