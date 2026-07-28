import { Fragment } from "react";
import type { Segment } from "@/lib/site-config";

/**
 * Renders the segment arrays from `lib/site-config.ts` — plain text, inline
 * links, and the `{ stars: true }` placeholder that the caller fills with the
 * live star count. This is what lets prose with links live in the config file
 * instead of being hard-coded in JSX.
 */
export function Segments({
  segments,
  starCount,
}: {
  segments: readonly Segment[];
  starCount?: string;
}) {
  return (
    <>
      {segments.map((segment, index) => (
        <Fragment key={index}>
          {typeof segment === "string" ? (
            segment
          ) : "stars" in segment ? (
            <span className="star-count">{starCount}</span>
          ) : (
            <a
              href={segment.href}
              {...(segment.href.startsWith("http")
                ? { target: "_blank", rel: "noreferrer" }
                : {})}
            >
              {segment.text}
            </a>
          )}
        </Fragment>
      ))}
    </>
  );
}
