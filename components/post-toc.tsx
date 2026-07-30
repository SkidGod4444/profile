"use client";

import { ChevronDown, List } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type TocItem = { url: string; depth: number; title: React.ReactNode };

/*
 * Contents panel, sized to match the Ask AI button beside it.
 *
 * The list opens as an overlay rather than expanding inline, so the sticky row
 * keeps a constant height whether it is open or shut. A rail down the left of
 * the list carries an indicator that follows whichever heading is currently on
 * screen.
 */
export function PostToc({ items }: { items: TocItem[] }) {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [marker, setMarker] = useState<{ top: number; height: number } | null>(
    null,
  );
  const listRef = useRef<HTMLOListElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  /* Scroll-spy: the last heading to cross the top of the viewport wins. */
  useEffect(() => {
    const ids = items.map((item) => item.url.replace(/^#/, ""));
    const headings = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (headings.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      // Bias the band toward the top so the marker tracks what you are reading,
      // not what is merely on screen.
      { rootMargin: "-72px 0px -60% 0px", threshold: 0 },
    );

    for (const heading of headings) {
      observer.observe(heading);
    }

    return () => observer.disconnect();
  }, [items]);

  /* Move the marker to the active row. Measured, so it survives wrapping. */
  useEffect(() => {
    const list = listRef.current;

    if (!list || !activeId) {
      return;
    }

    const row = list.querySelector<HTMLElement>(
      `[data-id="${CSS.escape(activeId)}"]`,
    );

    if (row) {
      setMarker({ top: row.offsetTop, height: row.offsetHeight });
    }
  }, [activeId, open, items]);

  /* Click-away and Escape, since this is an overlay rather than a disclosure. */
  useEffect(() => {
    if (!open) {
      return;
    }

    const onPointerDown = (event: PointerEvent) => {
      if (!panelRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="post-toc" ref={panelRef}>
      <button
        className="post-toc__button"
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <List aria-hidden="true" />
        <span className="tool-label">On this page</span>
        <span className="post-toc__count">{items.length}</span>
        <ChevronDown aria-hidden="true" />
      </button>

      {open && (
        <div className="post-toc__panel">
          <ol className="post-toc__list" ref={listRef}>
            <span
              aria-hidden="true"
              className="post-toc__marker"
              style={
                marker
                  ? {
                      opacity: 1,
                      transform: `translateY(${marker.top}px)`,
                      height: `${marker.height}px`,
                    }
                  : { opacity: 0 }
              }
            />
            {items.map((item) => {
              const id = item.url.replace(/^#/, "");

              return (
                <li
                  className="post-toc__item"
                  data-active={id === activeId}
                  data-depth={item.depth}
                  data-id={id}
                  key={item.url}
                >
                  <a href={item.url} onClick={() => setOpen(false)}>
                    {item.title}
                  </a>
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </div>
  );
}
