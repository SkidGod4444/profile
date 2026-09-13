import Link from "next/link";
import type { ProjectPage } from "@/lib/source";

type Props = {
  projects: ProjectPage[];
  /** The index shows the stack beside the year; the home page keeps it short. */
  showStack?: boolean;
};

/*
 * One row per project, shared by the home page, the index and the "more"
 * band at the foot of a project page, so all three stay the same grid.
 */
export function ProjectList({ projects, showStack = false }: Props) {
  return (
    <div className="project-list">
      {projects.map((project) => (
        <Link className="project-entry" href={project.url} key={project.url}>
          <span className="project-entry__title">
            <span className="project-entry__name">{project.data.title}</span>
            <span className="project-entry__meta">
              {project.data.year}
              {showStack && project.data.stack.length > 0
                ? ` · ${project.data.stack.join(", ")}`
                : ""}
            </span>
          </span>
          <span className="project-entry__description">
            {project.data.description}
          </span>
        </Link>
      ))}
    </div>
  );
}
