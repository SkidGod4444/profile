/*
 * Reads public Luma events through the same JSON endpoints the Luma site
 * itself calls. No token: everything here is what any visitor to the profile
 * or event page can see. Fetched on the server, cached for an hour, and every
 * failure collapses to `null` or an empty list, so the talks page degrades
 * rather than breaking the build on a network hiccup.
 */
import { siteConfig } from "./site-config";

export const lumaRevalidate = 3600;

export type LumaEvent = {
  name: string;
  url: string;
  startAt: string;
  endAt: string;
  timezone: string;
  /** Square thumbnail from Luma's image CDN, already resized. */
  cover: string | null;
  city: string | null;
  country: string | null;
  isOnline: boolean;
  hosts: string[];
  guestCount: number | null;
  isFree: boolean;
  soldOut: boolean;
  requireApproval: boolean;
  /** Plain-text paragraphs of the event description, in order. */
  description: string[];
};

type ProseNode = {
  type?: string;
  text?: string;
  content?: ProseNode[];
};

/** Flattens the ProseMirror document Luma stores descriptions in. */
function paragraphs(doc: ProseNode | undefined): string[] {
  if (!doc?.content) {
    return [];
  }

  return doc.content
    .filter((node) => node.type === "paragraph")
    .map((node) => (node.content ?? []).map((leaf) => leaf.text ?? "").join(""))
    .map((text) => text.trim())
    .filter(Boolean);
}

/** Luma keeps whatever spacing the organiser typed; titles read better tidy. */
function tidy(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

const cdn = "https://images.lumacdn.com/";

/** Luma's CDN resizes on the fly; ask for a small square rather than the
    original, which can be a multi-megabyte PNG. */
function thumbnail(cover: unknown, size: number) {
  if (typeof cover !== "string" || !cover.startsWith(cdn)) {
    return null;
  }

  const path = cover.slice(cdn.length);

  return `${cdn}cdn-cgi/image/format=auto,fit=cover,dpr=2,anim=false,background=white,quality=80,width=${size},height=${size}/${path}`;
}

type LumaPayload = {
  kind?: string;
  data?: {
    guest_count?: number;
    sold_out?: boolean;
    description_mirror?: ProseNode;
    ticket_info?: { is_free?: boolean; require_approval?: boolean };
    hosts?: { name?: string }[];
    event?: {
      name?: string;
      url?: string;
      start_at?: string;
      end_at?: string;
      timezone?: string;
      cover_url?: string;
      location_type?: string;
      geo_address_info?: { city?: string; country?: string };
    };
  };
};

export async function getLumaEvent(slug: string): Promise<LumaEvent | null> {
  try {
    const response = await fetch(
      `https://api.lu.ma/url?${new URLSearchParams({ url: slug })}`,
      {
        headers: { Accept: "application/json" },
        next: { revalidate: lumaRevalidate },
        signal: AbortSignal.timeout(10_000),
      },
    );

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as LumaPayload;
    const data = payload.data;
    const event = data?.event;

    if (
      payload.kind !== "event" ||
      !data ||
      !event?.name ||
      !event.start_at ||
      !event.end_at
    ) {
      return null;
    }

    return {
      name: tidy(event.name),
      url: `https://luma.com/${event.url ?? slug}`,
      startAt: event.start_at,
      endAt: event.end_at,
      timezone: event.timezone ?? "UTC",
      cover: thumbnail(event.cover_url, 320),
      city: event.geo_address_info?.city ?? null,
      country: event.geo_address_info?.country ?? null,
          // Luma also has "meet", "zoom" and friends; only "offline" is a venue.
      isOnline: event.location_type !== "offline",
      hosts: (data.hosts ?? [])
        .map((host) => host.name)
        .filter((name): name is string => Boolean(name)),
      guestCount:
        typeof data.guest_count === "number" ? data.guest_count : null,
      isFree: data.ticket_info?.is_free ?? false,
      soldOut: data.sold_out ?? false,
      requireApproval: data.ticket_info?.require_approval ?? false,
      description: paragraphs(data.description_mirror),
    };
  } catch {
    return null;
  }
}

/** "Tue 15 Sep 2026 · 1:30–3:30 pm IST", in the event's own time zone. */
export function formatLumaWhen(event: LumaEvent) {
  const start = new Date(event.startAt);
  const end = new Date(event.endAt);
  const timeZone = event.timezone;

  const day = new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone,
  }).format(start);

  const time = new Intl.DateTimeFormat("en-GB", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone,
  });

  /* en-IN names Asia/Kolkata "IST"; other locales spell it as a GMT offset. */
  const zone =
    new Intl.DateTimeFormat("en-IN", { timeZone, timeZoneName: "short" })
      .formatToParts(start)
      .find((part) => part.type === "timeZoneName")?.value ?? "";

  return `${day} · ${time.format(start)}–${time.format(end)} ${zone}`.trim();
}

type CalendarEntry = {
  guest_count?: number;
  hosts?: { name?: string }[];
  ticket_info?: { is_free?: boolean; require_approval?: boolean };
  event?: NonNullable<LumaPayload["data"]>["event"] & { visibility?: string };
};

type CalendarPage = {
  entries?: CalendarEntry[];
  has_more?: boolean;
  next_cursor?: string;
};

/** One period of the calendar, following the cursor until it runs out. */
async function listCalendar(period: "future" | "past") {
  const entries: CalendarEntry[] = [];
  let cursor: string | undefined;

  // A page cap so a runaway cursor can never hang a build.
  for (let page = 0; page < 10; page += 1) {
    const params = new URLSearchParams({
      calendar_api_id: siteConfig.luma.calendar,
      period,
      pagination_limit: "50",
    });

    if (cursor) {
      params.set("pagination_cursor", cursor);
    }

    const response = await fetch(`https://api.lu.ma/calendar/get-items?${params}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: lumaRevalidate },
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      break;
    }

    const payload = (await response.json()) as CalendarPage;
    entries.push(...(payload.entries ?? []));

    if (!payload.has_more || !payload.next_cursor) {
      break;
    }

    cursor = payload.next_cursor;
  }

  return entries;
}

function fromEntry(entry: CalendarEntry): LumaEvent | null {
  const event = entry.event;

  if (!event?.name || !event.start_at || !event.end_at || !event.url) {
    return null;
  }

  return {
    name: tidy(event.name),
    url: `https://luma.com/${event.url}`,
    startAt: event.start_at,
    endAt: event.end_at,
    timezone: event.timezone ?? "UTC",
    cover: thumbnail(event.cover_url, 320),
    city: event.geo_address_info?.city ?? null,
    country: event.geo_address_info?.country ?? null,
    isOnline: event.location_type !== "offline",
    hosts: (entry.hosts ?? [])
      .map((host) => host.name)
      .filter((name): name is string => Boolean(name)),
    guestCount:
      typeof entry.guest_count === "number" ? entry.guest_count : null,
    isFree: entry.ticket_info?.is_free ?? false,
    soldOut: false,
    requireApproval: entry.ticket_info?.require_approval ?? false,
    description: [],
  };
}

/**
 * Every public event on the profile's calendar, past and future. The calendar
 * listing carries no description, so each event is then read individually;
 * when that read fails the listing's own fields stand.
 */
export async function getLumaHostedEvents(): Promise<LumaEvent[]> {
  try {
    const [future, past] = await Promise.all([
      listCalendar("future"),
      listCalendar("past"),
    ]);

    const listed = [...future, ...past]
      .filter((entry) => entry.event?.visibility === "public")
      .map(fromEntry)
      .filter((event): event is LumaEvent => event !== null);

    return Promise.all(
      listed.map(async (event) => {
        const slug = event.url.slice("https://luma.com/".length);
        const full = await getLumaEvent(slug);

        return full ?? event;
      }),
    );
  } catch {
    return [];
  }
}
