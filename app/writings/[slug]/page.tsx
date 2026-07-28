import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Backdrop } from "@/components/backdrop";
import { BlogPostingSchema } from "@/components/structured-data";
import { ThemeToggle } from "@/components/theme-toggle";
import { siteConfig } from "@/lib/site-config";
import { blog, formatPostDate, getPublishedPosts } from "@/lib/source";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getPublishedPosts().map((post) => ({ slug: post.slugs[0] }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blog.getPage([slug]);

  if (!post) {
    return {};
  }

  return {
    title: post.data.title,
    description: post.data.description,
    alternates: { canonical: post.url },
    openGraph: {
      type: "article",
      url: `${siteConfig.url}${post.url}`,
      title: post.data.title,
      description: post.data.description,
      publishedTime: new Date(post.data.date).toISOString(),
      authors: [siteConfig.name],
    },
    twitter: {
      card: "summary_large_image",
      title: post.data.title,
      description: post.data.description,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = blog.getPage([slug]);

  if (!post) {
    notFound();
  }

  const Mdx = post.data.body;

  return (
    /* The backdrop stays, dialled well down — the signature texture without
       sitting behind a long read at full strength. */
    <main className="profile profile--reading">
      <BlogPostingSchema
        title={post.data.title}
        description={post.data.description}
        date={post.data.date}
        url={post.url}
      />
      <Backdrop />
      <ThemeToggle />

      <div className="profile__shell">
        <nav className="post-nav">
          <Link href="/writings">Writing</Link>
        </nav>

        <article className="post">
          <header className="post__header">
            <h1>{post.data.title}</h1>
            <time
              className="post__date"
              dateTime={new Date(post.data.date).toISOString()}
            >
              {formatPostDate(post.data.date)}
            </time>
          </header>

          {/* Small screens have no room for a side rail, so the contents sit
              inline above the article. Hidden on wider viewports by CSS. */}
          {post.data.toc.length > 0 && (
            <nav className="post-toc" aria-labelledby="toc-heading">
              <h2 className="post-toc__heading" id="toc-heading">
                On this page
              </h2>
              <ol className="post-toc__list">
                {post.data.toc.map((item) => (
                  <li
                    className="post-toc__item"
                    data-depth={item.depth}
                    key={item.url}
                  >
                    <a href={item.url}>{item.title}</a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {/* No `components` prop: plain h2/p/pre/code that the site's own
              prose styles handle, rather than the fumadocs-ui theme. */}
          <div className="prose">
            <Mdx />
          </div>
        </article>
      </div>
    </main>
  );
}
