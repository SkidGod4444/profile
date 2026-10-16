import type { Metadata } from "next";
import { siteConfig } from "./site-config";

type PageMetadataInput = {
  title: string;
  description: string;
  /** Site-relative path, which becomes the canonical URL. */
  path: string;
  type?: "website" | "article";
  /** ISO dates; only read when `type` is "article". */
  publishedTime?: string;
  modifiedTime?: string;
  /** Use the title as given instead of appending the site name. */
  absoluteTitle?: boolean;
};

/*
 * Per-page metadata built from one place. Next merges metadata shallowly:
 * a page that sets `openGraph` at all replaces the layout's whole object,
 * which silently dropped `og:site_name`, `og:locale`, `twitter:site` and
 * `twitter:creator` on every post and project page. Going through this
 * helper keeps every page's canonical, Open Graph and Twitter tags complete
 * and consistent, so a new route cannot regress them.
 */
export function pageMetadata({
  title,
  description,
  path,
  type = "website",
  publishedTime,
  modifiedTime,
  absoluteTitle = false,
}: PageMetadataInput): Metadata {
  const url = `${siteConfig.url}${path === "/" ? "" : path}`;
  const socialTitle = absoluteTitle ? title : `${title} — ${siteConfig.name}`;

  const shared = {
    url,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    title: socialTitle,
    description,
  };

  const openGraph: Metadata["openGraph"] =
    type === "article"
      ? {
          ...shared,
          type: "article",
          publishedTime,
          modifiedTime,
          // The Open Graph spec wants a profile URL here, not a bare name.
          authors: [siteConfig.url],
        }
      : { ...shared, type: "website" };

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: path,
      types: { "application/rss+xml": `${siteConfig.url}/feed.xml` },
    },
    openGraph,
    twitter: {
      card: "summary_large_image",
      site: siteConfig.twitterHandle,
      creator: siteConfig.twitterHandle,
      title: socialTitle,
      description,
    },
  };
}
