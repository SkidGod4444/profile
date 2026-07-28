"use client";

import { useEffect, useState } from "react";

type Visits = { pageviews: number; visitors: number | null };

const formatter = new Intl.NumberFormat("en", {
  maximumFractionDigits: 0,
  notation: "compact",
});

/**
 * Renders the site's view count, or nothing at all.
 *
 * Fetched on the client against the cached `/api/visits` route so the page it
 * sits on stays static. It renders null until a real number arrives, which
 * means it is simply absent locally and before the site is deployed with Web
 * Analytics enabled — rather than showing a zero that looks like a fact.
 */
export function VisitCount() {
  const [visits, setVisits] = useState<Visits | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/visits", { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { configured?: boolean } & Partial<Visits>) => {
        if (data?.configured && typeof data.pageviews === "number") {
          setVisits({
            pageviews: data.pageviews,
            visitors: data.visitors ?? null,
          });
        }
      })
      .catch(() => {
        // Aborted or offline; the counter just stays hidden.
      });

    return () => controller.abort();
  }, []);

  if (!visits) {
    return null;
  }

  return (
    <p className="visit-count">
      <span className="star-count">{formatter.format(visits.pageviews)}</span>{" "}
      {visits.pageviews === 1 ? "view" : "views"}
      {visits.visitors !== null ? (
        <>
          {" · "}
          <span className="star-count">
            {formatter.format(visits.visitors)}
          </span>{" "}
          {visits.visitors === 1 ? "visitor" : "visitors"}
        </>
      ) : null}
    </p>
  );
}
