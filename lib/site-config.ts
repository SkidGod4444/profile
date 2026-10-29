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
  /*
   * Vercel serves the site on www and 308s the bare domain to it. The
   * canonical host has to be the one that answers 200, or every canonical
   * tag and sitemap entry points at a redirect and Google picks its own.
   * To make the bare domain primary instead, flip the redirect in Vercel's
   * domain settings and change this one line.
   */
  site: "https://www.saidev.codes",
  github: "https://github.com/SkidGod4444",
  /* Verified to resolve to github.com/SkidGod4444. Used for display; the
     canonical URL in `profiles` is what the structured data advertises. */
  githubShort: "https://git.new/skidgod",
  x: "https://ref.saidev.codes/x",
  linkedin: "https://ref.saidev.codes/linkedin",
  email: "mailto:connect.saidev@gmail.com",
  /* Verified: cal.com/saidevdhal resolves to Saidev's booking page. */
  cal: "https://cal.com/saidevdhal",
  /* Shortener slug, which carries a prefilled first message. */
  whatsapp: "https://ref.saidev.codes/wp",
  sapient: "https://sapient.openhorizon.so",
  openHorizon: "https://openhorizon.so",
  botcortex: "https://openhorizon.so/products/botcortex",
  /* OpenHorizon's latest paper, the one the "Now" section quotes. */
  ohPaper: "https://openhorizon.so/research/async-chunking-edge-cpus",
  x0gpt: "https://x0-gpt.devwtf.in",
  prexo: "https://prexoai.xyz",
  indexflow: "https://indexflow.site",
  ellenox: "https://www.ellenox.com",
  buildspace: "https://buildspace.so",
  iitm: "https://www.iitm.ac.in",
  bserc: "https://bserc.in",
} as const;

export const siteConfig = {
  name: "Saidev Dhal",
  role: "Software Engineer",
  url: links.site,
  locale: "en_US",
  location: "New Delhi, India",

  /** Used for the page title suffix, meta description and OG tags. */
  description:
    "Software engineer from New Delhi. I founded OpenHorizon Labs, a robotics research company, and I ship open source as SkidGod.",

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
   * Subjects for the Person schema's `knowsAbout`. Topics only — names and
   * handles belong in `keywords`, not here.
   */
  expertise: [
    "software engineering",
    "open source",
    "robotics",
    "physical AI",
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

  /**
   * Plain text links at the top of the page. Labelled with their own path, so
   * the label and the destination can never drift apart.
   */
  nav: [
    { label: "/writings", href: "/writings" },
    { label: "/projects", href: "/projects" },
    { label: "/papers", href: "/papers" },
    { label: "/talks", href: "/talks" },
  ],

  /**
   * Public events, read live from Luma. `calendar` is the personal calendar
   * behind luma.com/user/<username>. Luma has no username-to-calendar lookup,
   * so it is pinned here: it is `calendar.api_id` in any of the user's event
   * payloads (api.lu.ma/url?url=<event slug>).
   */
  luma: {
    username: "itsdev",
    profile: "https://luma.com/user/itsdev",
    calendar: "cal-Cs4OOxep0sG0UHD",
  },

  /**
   * Talks that are not on Luma, newest first, each pointing at proof — a
   * recording, a write-up, a photo set or a certificate.
   */
  talks: [] as ReadonlyArray<{
    title: string;
    event: string;
    href: string;
    /** ISO date. */
    date: string;
    note?: string;
  }>,

  /**
   * A line under each section heading. Kept to a handful of words — these are
   * labels that orient a reader, not summaries of what follows.
   */
  sections: {
    now: "What I'm doing right now",
    past: "How I got here",
    writing: "Essays and technical write-ups",
    projects: "Things I've built",
  },

  /** How many recent posts the home page lists before linking to /writings. */
  writingsOnHome: 3,

  /*
   * The "Now" section — one array per paragraph. Written in the rhythm the
   * refine-writing skill describes: mostly one sentence per paragraph, short
   * lines, plain words. Every fact here comes from Saidev's own copy and
   * posts, or from what openhorizon.so says publicly — keep the two in step.
   */
  now: [
    [
      "I founded ",
      { text: "OpenHorizon Labs", href: links.openHorizon },
      ". It's a robotics research company.",
    ],
    [
      "We study how robots learn from people, remember their mistakes and act safely in the real world.",
    ],
    ["Then we turn that work into software that runs on your own hardware."],
    [
      { text: "BotCortex", href: links.botcortex },
      " lets you teach a robot by typing.",
    ],
    [
      "The skill runs on the robot at 20 Hz. Zero model calls. Inside bounds the model can't loosen.",
    ],
    [
      { text: "Sapient", href: links.sapient },
      " started as a side project. I wanted a robot that could hear me, think and talk back, with no uplink.",
    ],
    ["So I wrote my own inference engine. In Rust."],
    [
      "Now it's one 8 MB download. 27.7 tokens a second on a Jetson AGX Thor, and it still runs on a Raspberry Pi 5.",
    ],
    [
      "Our latest ",
      { text: "paper", href: links.ohPaper },
      " found that on a Raspberry Pi 5, fewer stalls didn't mean more completed tasks.",
    ],
    [
      "I ship open source as ",
      { text: "SkidGod", href: links.github },
      ". The biggest project, ",
      { text: "x0-GPT", href: `https://github.com/SkidGod4444/x0-GPT` },
      ", has ",
      { stars: true },
      " stars on GitHub.",
    ],
    ["I also freelance, and I'm taking on new work."],
    [
      "Need a full-stack SaaS? Web, app, AI, or all three. I can build the whole thing. ",
      { text: "Let's talk", href: links.whatsapp },
      ".",
    ],
  ] satisfies Segment[][],

  /*
   * The "Past" section, told as prose rather than a list of roles — same
   * segment format as `now`, so links sit inside the sentences.
   *
   * Chronological on purpose: read forwards it explains how he got to the
   * company described in `now`. Dates and titles come from his LinkedIn.
   */
  past: [
    ["I go by SkidGod because I was one."],
    [
      "A skid is someone who runs on other people's code. At fourteen, that was me. Lifting Discord bots and shipping them as my own.",
    ],
    ["It started as an insult. I kept it."],
    ["What I wanted was the founder tag in those servers."],
    ["So I learned discord.py and built my own bot instead."],
    [
      "That's where my tech career started. I stayed because it turned out I found it genuinely interesting.",
    ],
    [
      "In 2024 I was at ",
      { text: "Ellenox", href: links.ellenox },
      ", running hackathons and tech support and managing a Discord community of 2,000+ members.",
    ],
    [
      "Same year, I spent my nights and weekends in ",
      { text: "buildspace", href: links.buildspace },
      "'s S5 cohort.",
    ],
    [
      "In January 2025 I joined ",
      { text: "IIT Madras", href: links.iitm },
      " as technical lead. Nine months of product and strategy, building the MVP with the engineering team and a professor.",
    ],
    [
      "After that, two months at ",
      { text: "Bharat Space Education Research Centre", href: links.bserc },
      " as a def-space tech intern. Aircraft design and robotics.",
    ],
    ["Then I started my own thing."],
  ] satisfies Segment[][],

  /** The closing sentence in the footer. */
  footer: [
    "My code's on ",
    { text: "GitHub", href: links.githubShort },
    ". I'm on ",
    { text: "X", href: links.x },
    " and ",
    { text: "LinkedIn", href: links.linkedin },
    ". Want to talk? ",
    { text: "WhatsApp", href: links.whatsapp },
    " me, or ",
    { text: "email", href: links.email },
    " if that's easier.",
  ] satisfies Segment[],
} as const;
