import Image, { type StaticImageData } from "next/image";

type MediaItem = {
  src: string;
  alt: string;
  caption?: string;
  poster?: string;
  width?: number;
  height?: number;
};

const youtubePattern =
  /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/;

function youtubeId(src: string) {
  return youtubePattern.exec(src)?.[1] ?? null;
}

function isVideoFile(src: string) {
  return /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(src);
}

/** A bare file name, as opposed to a URL or a path under public/. */
function isContentFile(src: string) {
  return !/^(?:[a-z]+:)?\//i.test(src);
}

/* The column is at most 42rem plus two gutters, so nothing wider is needed. */
const sizes = "(max-width: 48rem) 100vw, 48rem";
const frame = "block h-auto w-full border-0";

async function Picture({ item }: { item: MediaItem }) {
  if (isContentFile(item.src)) {
    /* A dynamic import in a Server Component: Next reads the intrinsic size
       and builds a blur placeholder at build time, which a string path cannot
       give it. The folder is fixed so the bundler can glob it. */
    const { default: image }: { default: StaticImageData } = await import(
      `@/content/projects/media/${item.src}`
    );

    return (
      <Image
        className={frame}
        src={image}
        alt={item.alt}
        sizes={sizes}
        placeholder="blur"
      />
    );
  }

  if (item.width && item.height) {
    return (
      <Image
        className={frame}
        src={item.src}
        alt={item.alt}
        width={item.width}
        height={item.height}
        sizes={sizes}
        unoptimized
      />
    );
  }

  /* No size to go on, so the image fills a 16:9 box instead of shifting the
     layout when it arrives. */
  return (
    <div className="relative aspect-video w-full">
      <Image
        className="object-cover"
        src={item.src}
        alt={item.alt}
        sizes={sizes}
        fill
        unoptimized
      />
    </div>
  );
}

function Frame({ item }: { item: MediaItem }) {
  const id = youtubeId(item.src);

  if (id) {
    return (
      <iframe
        className={`${frame} aspect-video`}
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        title={item.alt || "Video"}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    );
  }

  if (isVideoFile(item.src)) {
    return (
      <video
        className={frame}
        src={item.src}
        poster={item.poster}
        title={item.alt || undefined}
        controls
        playsInline
        preload="metadata"
      />
    );
  }

  return <Picture item={item} />;
}

/*
 * Media sits directly under the facts, edge to edge between the vertical
 * rules, each piece closed by the same hairline. No top margin: the facts'
 * bottom rule doubles as the media's top rule.
 */
export function ProjectMedia({ items }: { items: MediaItem[] }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="-mx-(--gutter) grid">
      {items.map((item) => (
        <figure className="border-b border-(--grid-line)" key={item.src}>
          {/* Tinted while a frame loads, so the row has a shape before its
              pixels arrive. */}
          <div className="w-full overflow-hidden bg-(--code-surface)">
            <Frame item={item} />
          </div>
          {item.caption && (
            <figcaption className="px-(--gutter) py-[0.6rem] text-[0.8125rem] leading-[1.45] tracking-[-0.006em] text-(--ink-muted)">
              {item.caption}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}
