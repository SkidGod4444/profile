import { siteConfig } from "@/lib/site-config";

/**
 * Renders a JSON-LD block. `<` is escaped because a `</script>` sequence
 * anywhere in the data would otherwise close the tag early and inject markup.
 */
function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

const personId = `${siteConfig.url}/#person`;
const websiteId = `${siteConfig.url}/#website`;
const orgId = `${siteConfig.organization.url}/#organization`;

/**
 * Identity graph for the home page. `@id` lets the other schemas reference this
 * person rather than repeating it, which is what search engines expect.
 */
export function PersonSchema() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          "@id": personId,
          name: siteConfig.name,
          alternateName: "SkidGod",
          url: siteConfig.url,
          image: `${siteConfig.url}${siteConfig.avatar.src}`,
          jobTitle: siteConfig.role,
          description: siteConfig.description,
          sameAs: Object.values(siteConfig.profiles),
          knowsAbout: siteConfig.keywords,
          worksFor: { "@id": orgId },
          // Declared on both sides: Person→founderOf and Organization→founder.
          founderOf: { "@id": orgId },
          address: {
            "@type": "PostalAddress",
            addressLocality: siteConfig.location,
          },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": orgId,
          name: siteConfig.organization.name,
          url: siteConfig.organization.url,
          founder: { "@id": personId },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "@id": websiteId,
          url: siteConfig.url,
          name: `${siteConfig.name} — ${siteConfig.role}`,
          description: siteConfig.description,
          inLanguage: "en",
          publisher: { "@id": personId },
        }}
      />
    </>
  );
}

export function BlogSchema() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Blog",
        "@id": `${siteConfig.url}/writings#blog`,
        url: `${siteConfig.url}/writings`,
        name: `Writing — ${siteConfig.name}`,
        description: `Blog posts and technical write-ups by ${siteConfig.name}.`,
        inLanguage: "en",
        author: { "@id": personId },
        publisher: { "@id": personId },
        isPartOf: { "@id": websiteId },
      }}
    />
  );
}

export function BlogPostingSchema({
  title,
  description,
  date,
  url,
}: {
  title: string;
  description?: string;
  date: string | Date;
  url: string;
}) {
  const absoluteUrl = `${siteConfig.url}${url}`;
  const published = new Date(date).toISOString();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: title,
          description,
          datePublished: published,
          // No edit history is tracked, so modified equals published.
          dateModified: published,
          url: absoluteUrl,
          mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl },
          image: `${absoluteUrl}/opengraph-image`,
          inLanguage: "en",
          author: { "@id": personId },
          publisher: { "@id": personId },
          isPartOf: { "@id": `${siteConfig.url}/writings#blog` },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: siteConfig.name,
              item: siteConfig.url,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Writing",
              item: `${siteConfig.url}/writings`,
            },
            { "@type": "ListItem", position: 3, name: title },
          ],
        }}
      />
    </>
  );
}
