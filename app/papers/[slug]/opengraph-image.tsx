import { notFound } from "next/navigation";
import { ogContentType, ogSize, renderOgImage } from "@/lib/og";
import { siteConfig } from "@/lib/site-config";
import { getPublishedPapers, papers } from "@/lib/source";

export const alt = "Paper";
export const size = ogSize;
export const contentType = ogContentType;

/* Pre-renders one card per paper at build time instead of on first request. */
export function generateStaticParams() {
  return getPublishedPapers().map((paper) => ({ slug: paper.slugs[0] }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const paper = papers.getPage([slug]);

  if (!paper) {
    notFound();
  }

  return renderOgImage({
    eyebrow: `${siteConfig.name} · Paper`,
    title: paper.data.title,
    subtitle: paper.data.description,
    footerRight: [paper.data.year, paper.data.venue].filter(Boolean).join(" · "),
  });
}
