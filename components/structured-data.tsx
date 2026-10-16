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
const blogId = `${siteConfig.url}/writings#blog`;
const orgId = `${siteConfig.organization.url}/#organization`;

/*
 * References carry a name and URL alongside the `@id`. Search engines do not
 * follow an `@id` to another page, so a bare `{ "@id" }` author on a post page
 * is an author with no name, and the Article rich result fails validation.
 */
const personRef = {
  "@type": "Person",
  "@id": personId,
  name: siteConfig.name,
  url: siteConfig.url,
};

const websiteRef = {
  "@type": "WebSite",
  "@id": websiteId,
  name: `${siteConfig.name} — ${siteConfig.role}`,
  url: siteConfig.url,
};

const blogRef = {
  "@type": "Blog",
  "@id": blogId,
  name: `Writing — ${siteConfig.name}`,
  url: `${siteConfig.url}/writings`,
};

/**
 * Identity graph for the home page. The Person sits inside a ProfilePage,
 * which is the type Google reads for a personal site about one person; the
 * other schemas reference the person by `@id` rather than repeating it.
 */
export function PersonSchema() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          "@id": `${siteConfig.url}/#profile`,
          url: siteConfig.url,
          name: `${siteConfig.name} — ${siteConfig.role}`,
          inLanguage: "en",
          isPartOf: { "@id": websiteId },
          mainEntity: {
            "@type": "Person",
            "@id": personId,
            name: siteConfig.name,
            alternateName: "SkidGod",
            url: siteConfig.url,
            image: `${siteConfig.url}${siteConfig.avatar.src}`,
            jobTitle: siteConfig.role,
            description: siteConfig.description,
            sameAs: Object.values(siteConfig.profiles),
            knowsAbout: siteConfig.expertise,
            worksFor: { "@id": orgId },
            // Declared on both sides: Person→founderOf and Organization→founder.
            founderOf: { "@id": orgId },
            address: {
              "@type": "PostalAddress",
              addressLocality: siteConfig.location,
            },
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
          founder: personRef,
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
          publisher: personRef,
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
        "@id": blogId,
        url: `${siteConfig.url}/writings`,
        name: `Writing — ${siteConfig.name}`,
        description: `Blog posts and technical write-ups by ${siteConfig.name}.`,
        inLanguage: "en",
        author: personRef,
        publisher: personRef,
        isPartOf: websiteRef,
      }}
    />
  );
}

export function BlogPostingSchema({
  title,
  description,
  date,
  updated,
  url,
}: {
  title: string;
  description?: string;
  date: string | Date;
  updated?: string | Date;
  url: string;
}) {
  const absoluteUrl = `${siteConfig.url}${url}`;
  const published = new Date(date).toISOString();
  const modified = new Date(updated ?? date).toISOString();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: title,
          description,
          datePublished: published,
          dateModified: modified,
          url: absoluteUrl,
          mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl },
          image: `${absoluteUrl}/opengraph-image`,
          inLanguage: "en",
          author: personRef,
          publisher: personRef,
          isPartOf: blogRef,
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

export function ProjectSchema({
  title,
  description,
  url,
  liveUrl,
  repo,
  stack,
  year,
  updated,
}: {
  title: string;
  description?: string;
  url: string;
  liveUrl: string;
  repo?: string;
  stack: string[];
  year: string;
  updated?: string | Date;
}) {
  const absoluteUrl = `${siteConfig.url}${url}`;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareSourceCode",
          name: title,
          description,
          url: liveUrl,
          codeRepository: repo,
          programmingLanguage: stack,
          dateCreated: year,
          dateModified: updated ? new Date(updated).toISOString() : undefined,
          mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl },
          image: `${absoluteUrl}/opengraph-image`,
          inLanguage: "en",
          author: personRef,
          isPartOf: websiteRef,
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
              name: "Projects",
              item: `${siteConfig.url}/projects`,
            },
            { "@type": "ListItem", position: 3, name: title },
          ],
        }}
      />
    </>
  );
}

export function EventSchema({
  name,
  description,
  startDate,
  endDate,
  url,
  image,
  city,
  country,
  isOnline,
  isFree,
}: {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  url: string;
  image?: string | null;
  city?: string | null;
  country?: string | null;
  isOnline: boolean;
  isFree: boolean;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Event",
        name,
        description,
        startDate,
        endDate,
        url,
        image: image ?? undefined,
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: isOnline
          ? "https://schema.org/OnlineEventAttendanceMode"
          : "https://schema.org/OfflineEventAttendanceMode",
        location: isOnline
          ? { "@type": "VirtualLocation", url }
          : {
              "@type": "Place",
              name: city ?? undefined,
              address: {
                "@type": "PostalAddress",
                addressLocality: city ?? undefined,
                addressCountry: country ?? undefined,
              },
            },
        isAccessibleForFree: isFree,
        organizer: personRef,
        performer: personRef,
      }}
    />
  );
}
