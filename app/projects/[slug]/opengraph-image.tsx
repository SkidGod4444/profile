import { notFound } from "next/navigation";
import { ogContentType, ogSize, renderOgImage } from "@/lib/og";
import { siteConfig } from "@/lib/site-config";
import { getPublishedProjects, projects } from "@/lib/source";

export const alt = "Project";
export const size = ogSize;
export const contentType = ogContentType;

/* Pre-renders one card per project at build time instead of on first request. */
export function generateStaticParams() {
  return getPublishedProjects().map((project) => ({ slug: project.slugs[0] }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.getPage([slug]);

  if (!project) {
    notFound();
  }

  const facts = [project.data.year, ...project.data.stack].join(" · ");

  return renderOgImage({
    eyebrow: `${siteConfig.name} · Project`,
    title: project.data.title,
    subtitle: project.data.description,
    footerRight: facts,
  });
}
