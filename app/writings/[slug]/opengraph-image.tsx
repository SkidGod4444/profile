import { notFound } from "next/navigation";
import { ogContentType, ogSize, renderOgImage } from "@/lib/og";
import { siteConfig } from "@/lib/site-config";
import { blog, formatPostDate, getPublishedPosts } from "@/lib/source";

export const alt = "Post";
export const size = ogSize;
export const contentType = ogContentType;

/* Pre-renders one card per post at build time instead of on first request. */
export function generateStaticParams() {
  return getPublishedPosts().map((post) => ({ slug: post.slugs[0] }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blog.getPage([slug]);

  if (!post) {
    notFound();
  }

  return renderOgImage({
    eyebrow: `${siteConfig.name} · ${formatPostDate(post.data.date)}`,
    title: post.data.title,
    subtitle: post.data.description,
    footerRight: siteConfig.role,
  });
}
