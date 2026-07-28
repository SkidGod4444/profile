/**
 * Everything editable about this site lives here except the long-form content:
 * identity, every URL, the "Now" prose and the footer. Posts live in
 * content/writings and projects in content/projects, because a write-up is
 * prose and does not belong in a TypeScript file.
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

/**
 * Links shown on the page. Social ones go through the owner's own shortener so
 * clicks stay measurable; the canonical profile URLs live in `profiles` below
 * and are what the structured data advertises.
 */
export const links = {
  site: "https://saidev.codes",
  github: "https://github.com/SkidGod4444",
  x: "https://ref.saidev.codes/x",
  linkedin: "https://ref.saidev.codes/linkedin",
  email: "mailto:connect.saidev@gmail.com",
  /* Verified: cal.com/saidevdhal resolves to Saidev's booking page. */
  cal: "https://cal.com/saidevdhal",
  /* Shortener slug, which carries a prefilled first message. */
  whatsapp: "https://ref.saidev.codes/wp",
  sapient: "https://sapient.openhorizon.so",
  openHorizon: "https://openhorizon.so",
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
    "Software engineer and OSS builder from New Delhi. I founded OpenHorizon Labs, where I build Sapient, and ship open source as SkidGod.",

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
    "OpenHorizon Labs",
    "robotics",
    "machine learning",
  ],

  /**
   * Canonical profile URLs for the `sameAs` property of the Person schema.
   * These must be the real profiles, not the shortener or an intent endpoint —
   * search engines use them to tie this site to known accounts, and a redirect
   * or a follow-dialog URL is a weaker signal than the profile itself.
   */
  profiles: {
    github: "https://github.com/SkidGod4444",
    x: "https://x.com/SaidevDhal",
    linkedin: "https://www.linkedin.com/in/saidevdhal",
  },

  /** Used for `twitter:creator`; must include the leading @. */
  twitterHandle: "@SaidevDhal",

  avatar: {
    src: "/avatar.jpg",
    /** Shown only if the image fails to load. */
    initials: "SD",
  },

  /** Founded by the site owner; surfaced in the Person/Organization schema. */
  organization: {
    name: "OpenHorizon Labs",
    url: links.openHorizon,
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
      "I founded ",
      { text: "OpenHorizon Labs", href: links.openHorizon },
      ", where I build ",
      { text: "Sapient", href: links.sapient },
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
