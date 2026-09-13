import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Backdrop } from "@/components/backdrop";
import { EventSchema } from "@/components/structured-data";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";
import {
  formatLumaWhen,
  getLumaHostedEvents,
  type LumaEvent,
} from "@/lib/luma";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Talks",
  description: `Talks and workshops by ${siteConfig.name}.`,
  alternates: { canonical: "/talks" },
  openGraph: {
    type: "website",
    url: `${siteConfig.url}/talks`,
    title: `Talks — ${siteConfig.name}`,
    description: `Talks and workshops by ${siteConfig.name}.`,
  },
};

/*
 * Prerendered, then refreshed in the background so the guest count and the
 * upcoming/past split stay current without a deploy. A literal, because Next
 * reads segment config statically and rejects an imported value — keep it in
 * step with `lumaRevalidate` in lib/luma.ts.
 */
export const revalidate = 3600;

type Talk = (typeof siteConfig.talks)[number];
/* A row is either a Luma event or a hand-written talk; both carry a sort key. */
type Entry = {
  id: string;
  talk: Talk | null;
  luma: LumaEvent | null;
  upcoming: boolean;
  sortAt: number;
};

async function loadEntries(): Promise<Entry[]> {
  const now = Date.now();
  const events = await getLumaHostedEvents();
  const day = 24 * 60 * 60 * 1000;

  const fromLuma = events.map<Entry>((luma) => ({
    id: luma.url,
    talk: null,
    luma,
    upcoming: new Date(luma.endAt).getTime() > now,
    sortAt: new Date(luma.startAt).getTime(),
  }));

  /* A static date is a whole day, so it counts as upcoming until it ends. */
  const fromConfig = siteConfig.talks.map<Entry>((talk) => {
    const startAt = new Date(talk.date).getTime();

    return {
      id: talk.href,
      talk,
      luma: null,
      upcoming: startAt + day > now,
      sortAt: startAt,
    };
  });

  return [...fromLuma, ...fromConfig];
}

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

function EventRow({ talk, luma, upcoming }: Entry) {
  const title = luma?.name ?? talk?.title ?? "";
  const when = luma
    ? formatLumaWhen(luma)
    : talk
      ? dateFormatter.format(new Date(talk.date))
      : "";
  const where = luma
    ? luma.isOnline
      ? "Online"
      : [luma.city, luma.country].filter(Boolean).join(", ")
    : (talk?.event ?? "");
  const blurb = luma?.description.slice(0, 2) ?? (talk?.note ? [talk.note] : []);

  const status = luma
    ? [
        luma.isFree ? "Free" : null,
        luma.guestCount ? `${luma.guestCount} ${upcoming ? "going" : "went"}` : null,
        upcoming && luma.soldOut ? "Sold out" : null,
        upcoming && !luma.soldOut && luma.requireApproval ? "Approval required" : null,
      ].filter(Boolean)
    : [];

  return (
    <a
      className="group -mx-(--gutter) grid grid-cols-[5.5rem_1fr] gap-4 border-b border-(--grid-line) px-(--gutter) py-[1.35rem] no-underline sm:grid-cols-[8rem_1fr] sm:gap-[1.35rem]"
      href={luma?.url ?? talk?.href}
      target="_blank"
      rel="noreferrer"
    >
      {/* Square like Luma's own cards; the ring matches the avatar's. */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-(--code-surface) shadow-(--avatar-shadow) after:absolute after:inset-0 after:rounded-lg after:border after:border-(--image-outline) after:content-['']">
        {luma?.cover && (
          <Image
            className="object-cover"
            src={luma.cover}
            alt=""
            fill
            sizes="(max-width: 640px) 5.5rem, 8rem"
          />
        )}
      </div>

      <div className="min-w-0">
        <span className="block text-base leading-[1.4] tracking-[-0.028em] underline decoration-transparent decoration-1 underline-offset-[0.18em] transition-[text-decoration-color] duration-150 group-hover:decoration-(--ink-faint)">
          {title}
        </span>
        <span className="mt-1 block text-[0.8125rem] leading-[1.45] text-(--ink-muted) tabular-nums">
          {when}
          {where ? ` · ${where}` : ""}
        </span>

        {blurb.length > 0 && (
          <div className="mt-3 grid gap-2">
            {blurb.map((text) => (
              <p
                className="text-base leading-[1.58] tracking-[-0.018em] text-pretty text-(--ink-muted)"
                key={text}
              >
                {text}
              </p>
            ))}
          </div>
        )}

        <span className="mt-3 block text-[0.8125rem] leading-[1.45] text-(--ink-muted) tabular-nums">
          {status.map((part) => (
            <span key={part}>{part} · </span>
          ))}
          <span className="text-(--ink) after:text-(--ink-muted) after:content-['_↗']">
            {luma ? (upcoming ? "Register on Luma" : "Event page") : "See the proof"}
          </span>
        </span>
      </div>
    </a>
  );
}

function EventSection({
  id,
  heading,
  note,
  entries,
}: {
  id: string;
  heading: string;
  note: string;
  entries: Entry[];
}) {
  if (entries.length === 0) {
    return null;
  }

  return (
    <section className="profile-section" aria-labelledby={id}>
      <div className="profile-section__head">
        <h2 id={id}>{heading}</h2>
        <p className="profile-section__note">{note}</p>
      </div>

      {entries.map((entry) => (
        <EventRow key={entry.id} {...entry} />
      ))}
    </section>
  );
}

export default async function TalksPage() {
  const entries = await loadEntries();
  /* Soonest first for what is coming up; most recent first for what is done. */
  const upcoming = entries
    .filter((entry) => entry.upcoming)
    .sort((a, b) => a.sortAt - b.sortAt);
  const past = entries
    .filter((entry) => !entry.upcoming)
    .sort((a, b) => b.sortAt - a.sortAt);

  return (
    <main className="profile" aria-labelledby="talks-title">
      {entries.map(
        ({ id, luma }) =>
          luma && (
            <EventSchema
              key={id}
              name={luma.name}
              description={luma.description[0]}
              startDate={luma.startAt}
              endDate={luma.endAt}
              url={luma.url}
              image={luma.cover}
              city={luma.city}
              country={luma.country}
              isOnline={luma.isOnline}
              isFree={luma.isFree}
            />
          ),
      )}
      <Backdrop />
      <ThemeToggle />

      <div className="profile__shell">
        <nav className="post-nav">
          <Link href="/">{siteConfig.name}</Link>
        </nav>

        <header className="profile__header">
          <div className="profile__identity">
            <h1 id="talks-title">Talks</h1>
            <p>Talks, workshops and events I host.</p>
          </div>

          {/* Same frosted control as the home page's call-to-actions. */}
          <div className="profile__actions">
            <Button className="profile__action" variant="outline" asChild>
              <a href={siteConfig.luma.profile} target="_blank" rel="noreferrer">
                <CalendarDays aria-hidden="true" />
                Follow on Luma
              </a>
            </Button>
          </div>
        </header>

        {entries.length === 0 ? (
          <section className="profile-section">
            <div className="profile-section__body">
              <p>Nothing listed right now.</p>
            </div>
          </section>
        ) : (
          <>
            <EventSection
              id="upcoming-title"
              heading="Upcoming"
              note="Where to find me next"
              entries={upcoming}
            />
            <EventSection
              id="past-title"
              heading="Past"
              note="Talks and workshops so far"
              entries={past}
            />
          </>
        )}
      </div>
    </main>
  );
}
