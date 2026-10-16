import type { Metadata } from "next";
import Link from "next/link";
import { Backdrop } from "@/components/backdrop";
import { ProjectList } from "@/components/project-list";
import { ThemeToggle } from "@/components/theme-toggle";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { getPublishedProjects } from "@/lib/source";

export const metadata: Metadata = pageMetadata({
  title: "Projects",
  description: `Things ${siteConfig.name} has built.`,
  path: "/projects",
});

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
          <ProjectList projects={projects} showStack />
        </section>
      </div>
    </main>
  );
}
