import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AiActions } from "@/components/ai-actions";
import { Backdrop } from "@/components/backdrop";
import { PostToc } from "@/components/post-toc";
import { BlogPostingSchema } from "@/components/structured-data";
import { ThemeToggle } from "@/components/theme-toggle";
import { pageMetadata } from "@/lib/seo";
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

  return pageMetadata({
    title: post.data.title,
    description: post.data.description ?? siteConfig.description,
    path: post.url,
    type: "article",
    publishedTime: new Date(post.data.date).toISOString(),
    modifiedTime: new Date(post.data.updated ?? post.data.date).toISOString(),
  });
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
        updated={post.data.updated}
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

          {/* Contents and the AI control share one sticky row, so they pin
              together and stay the same size while reading. */}
          <div className="post-tools">
            {post.data.toc.length > 0 && <PostToc items={post.data.toc} />}

            <AiActions
              rawPath={`${post.url}/raw`}
              shareUrl={`${siteConfig.url}${post.url}/raw`}
              title={post.data.title}
            />
          </div>

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
