import type { Metadata } from "next";
import Link from "next/link";
import { Backdrop } from "@/components/backdrop";
import { ThemeToggle } from "@/components/theme-toggle";
import { siteConfig } from "@/lib/site-config";
import { getPublishedProjects } from "@/lib/source";

export const metadata: Metadata = {
  title: "Projects",
  description: `Things ${siteConfig.name} has built.`,
  alternates: { canonical: "/projects" },
  openGraph: {
    type: "website",
    url: `${siteConfig.url}/projects`,
    title: `Projects — ${siteConfig.name}`,
    description: `Things ${siteConfig.name} has built.`,
  },
};

export default function ProjectsPage() {
  const projects = getPublishedProjects();

  return (
    <main className="profile" aria-labelledby="projects-title">
      <Backdrop />
      <ThemeToggle />

      <div className="profile__shell">
        <nav className="post-nav">
          <Link href="/">{siteConfig.name}</Link>
        </nav>

        <header className="profile__header">
          <div className="profile__identity">
            <h1 id="projects-title">Projects</h1>
            <p>Things I have built.</p>
          </div>
        </header>

        <section className="profile-section">
          <div className="project-list">
            {projects.map((project) => (
              <Link
                className="project-entry"
                href={project.url}
                key={project.url}
              >
                <span className="project-entry__title">
                  <span className="project-entry__name">
                    {project.data.title}
                  </span>
                  <span className="project-entry__meta">
                    {project.data.year}
                    {project.data.stack.length > 0
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
        </section>
      </div>
    </main>
  );
}
