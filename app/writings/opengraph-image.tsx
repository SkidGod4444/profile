import { ogContentType, ogSize, renderOgImage } from "@/lib/og";
import { siteConfig } from "@/lib/site-config";

export const alt = `Writing — ${siteConfig.name}`;
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return renderOgImage({
    eyebrow: siteConfig.name,
    title: "Writing",
    subtitle: "Essays and technical write-ups",
    footerRight: siteConfig.role,
  });
}
