import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Inter_Tight, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { siteConfig } from "@/lib/site-config";
import { themeColors, themeStorageKey } from "@/lib/theme";
import "./globals.css";

const siteUrl = siteConfig.url;

/*
 * These feed `--font-sans` / `--font-mono` in globals.css, which are also what
 * shadcn's `@theme inline` maps Tailwind's font utilities onto — so components
 * and hand-written CSS stay on the same faces. Both ship a real 600, which
 * matters because `font-synthesis: none` would otherwise render headings at 400.
 */
const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  // Real italics are required: `font-synthesis: none` means a missing italic
  // face renders <em> upright, silently dropping emphasis in prose.
  style: ["normal", "italic"],
  variable: "--font-inter-tight",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const siteTitle = `${siteConfig.name} — ${siteConfig.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    // Child pages set only their own title; the site name is appended here.
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": `${siteUrl}/feed.xml` },
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    title: siteTitle,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    site: siteConfig.twitterHandle,
    creator: siteConfig.twitterHandle,
    title: siteTitle,
    description: siteConfig.description,
  },
  /*
   * `max-image-preview: large` is what lets Google show the full social card
   * rather than a thumbnail, and it has to be opted into explicitly.
   */
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: themeColors.dark,
};

/*
 * Dark is the default, so `<html>` below ships with `data-theme="dark"` already
 * set. That means the correct palette is in the server-rendered HTML — no flash
 * before this script runs, and it still holds with JavaScript disabled.
 *
 * All this script does is honour an explicit choice from the toggle. The OS
 * `prefers-color-scheme` setting is deliberately ignored: a light-mode visitor
 * gets dark until they switch, which is the point of a default.
 */
const themeBootstrapScript = `
(function () {
  try {
    var stored = localStorage.getItem(${JSON.stringify(themeStorageKey)});
    if (stored === "light" || stored === "dark") {
      document.documentElement.dataset.theme = stored;
    }
  } catch (error) {
    // Storage can throw in private modes; the rendered default already stands.
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${interTight.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
      </head>
      <body>
        <ThemeProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
        {/* No-ops outside Vercel, so local runs stay clean. */}
        <Analytics />
      </body>
    </html>
  );
}
