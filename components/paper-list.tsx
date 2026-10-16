import Link from "next/link";
import type { PaperPage } from "@/lib/source";

/** One row per paper, on the same grid as the project and writing rows. */
export function PaperList({ papers }: { papers: PaperPage[] }) {
  return (
    <div className="project-list">
      {papers.map((paper) => (
        <Link className="project-entry" href={paper.url} key={paper.url}>
          <span className="project-entry__title">
            <span className="project-entry__name">{paper.data.title}</span>
            <span className="project-entry__meta">
              {[paper.data.year, paper.data.venue].filter(Boolean).join(" · ")}
            </span>
          </span>
          <span className="project-entry__description">
            {paper.data.description}
          </span>
        </Link>
      ))}
    </div>
  );
}
