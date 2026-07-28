/**
 * Everything editable about this site lives here: identity, every URL, the
 * prose, the project list and the footer. Pages read from this file and hold no
 * copy of their own, so changing content never means touching a component.
 *
 * Prose is written as arrays of segments rather than plain strings so sentences
 * can carry inline links without moving the copy back into JSX:
 *
 *   "plain text"                    → text
 *   { text: "Sapient", href: ... }  → a link
 *   { stars: true }                 → the live star count for `flagship.repo`
 */
export type Segment =
  | string
  | { text: string; href: string }
  | { stars: true };

export const links = {
  site: "https://saidev.codes",
  github: "https://github.com/SkidGod4444",
  x: "https://l.devwtf.in/x",
  linkedin: "https://dub.sh/saidev-linkedin",
  email: "mailto:connect.saidev@gmail.com",
  sapient: "https://sapient.openhorizon.so",
  openHorizon: "https://github.com/openhorizon-labs",
  x0gpt: "https://x0-gpt.devwtf.in",
  prexo: "https://prexoai.xyz",
  indexflow: "https://indexflow.site",
} as const;

export const siteConfig = {
  name: "Saidev Dhal",
  role: "Software Engineer",
  url: links.site,
  locale: "en_US",
  location: "New Delhi, India",

  /** Used for the page title suffix, meta description and OG tags. */
  description:
    "Software engineer and OSS builder from New Delhi. I build Sapient at Open Horizon Labs and ship open source as SkidGod.",

  /*
   * Search engines ignore the keywords meta tag, but LLM crawlers and social
   * cards do read it, so it is kept short and honest rather than stuffed.
   */
  keywords: [
    "Saidev Dhal",
    "SkidGod",
    "software engineer",
    "open source",
    "Sapient",
    "Open Horizon Labs",
    "robotics",
    "machine learning",
  ],

  /**
   * Profiles that belong to the same person, for the `sameAs` property of the
   * Person schema. Search engines use this to link a site to known profiles, so
   * every entry must genuinely be the same identity.
   */
  sameAs: [links.github, links.x, links.linkedin],

  avatar: {
    src: "/avatar.jpg",
    /** Shown only if the image fails to load. */
    initials: "SD",
  },

  /** The repo whose live star count `{ stars: true }` renders. */
  flagship: {
    repo: "SkidGod4444/x0-GPT",
    /** Used when the GitHub API is unreachable or rate-limited. */
    fallbackStars: 39,
  },

  /** How many recent posts the home page lists before linking to /writings. */
  writingsOnHome: 3,

  /** The "Now" section — one array per paragraph. */
  now: [
    [
      "I build ",
      { text: "Sapient", href: links.sapient },
      " at ",
      { text: "Open Horizon Labs", href: links.openHorizon },
      ". It makes your hardware think, see, listen and speak, and it is written in Rust.",
    ],
    [
      "I have been shipping open source as ",
      { text: "SkidGod", href: links.github },
      " since I was fourteen — the name started as an insult and I kept it. The largest of those projects, ",
      { text: "x0-GPT", href: `https://github.com/SkidGod4444/x0-GPT` },
      ", has ",
      { stars: true },
      " stars on GitHub. I am always exploring new ideas, particularly in machine learning and robotics.",
    ],
  ] satisfies Segment[][],

  projects: [
    {
      name: "Sapient",
      description: "Make your hardware think, see, listen and speak.",
      href: links.sapient,
    },
    {
      name: "x0-GPT",
      description:
        "Chat with any website or PDF in natural language, free for everyone.",
      href: links.x0gpt,
    },
    {
      name: "Prexo",
      description:
        "AI agents for sales and support, runnable almost entirely for free.",
      href: links.prexo,
    },
    {
      name: "IndexFlow",
      description:
        "Lets Discord communities index their threads and make them searchable.",
      href: links.indexflow,
    },
  ],

  /** The closing sentence in the footer. */
  footer: [
    "Find my code on ",
    { text: "GitHub", href: links.github },
    ". You can also reach me through ",
    { text: "X", href: links.x },
    ", ",
    { text: "LinkedIn", href: links.linkedin },
    ", or ",
    { text: "email", href: links.email },
    ".",
  ] satisfies Segment[],
} as const;
