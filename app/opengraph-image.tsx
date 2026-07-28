import { ogContentType, ogSize, renderOgImage } from "@/lib/og";
import { siteConfig } from "@/lib/site-config";

export const alt = `${siteConfig.name} — ${siteConfig.role}`;
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return renderOgImage({
    eyebrow: siteConfig.location,
    title: siteConfig.name,
    subtitle: siteConfig.role,
  });
}
