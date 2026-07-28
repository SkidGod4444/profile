"use client";

import { Check, Copy, Sparkles } from "lucide-react";
import { useState } from "react";

/*
 * "Open with AI" actions for a post, in the pattern Fumadocs uses for its docs
 * — copy the page as Markdown, or hand its Markdown URL to an assistant.
 *
 * Built here rather than imported from `fumadocs-ui`, which is deliberately not
 * installed: it ships a whole docs theme. The mechanism is just the raw
 * Markdown route plus two prefilled query strings.
 */

type Props = {
  /** Same-origin path used to fetch the Markdown for copying. */
  rawPath: string;
  /**
   * Public absolute URL of that same Markdown, handed to the assistant.
   *
   * Passed in from the server rather than derived from `window.location`:
   * deriving it on the client only would differ from the server render and
   * break hydration, and a localhost URL is useless to an assistant anyway.
   */
  shareUrl: string;
  title: string;
};

function prompt(url: string, title: string) {
  return `Read ${url} — it is the article "${title}" in Markdown. Summarise it, then I have questions.`;
}

export function AiActions({ rawPath, shareUrl, title }: Props) {
  const [copied, setCopied] = useState(false);

  async function copyMarkdown() {
    try {
      const response = await fetch(rawPath);

      if (!response.ok) {
        return;
      }

      await navigator.clipboard.writeText(await response.text());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard is unavailable over plain HTTP and in some browsers.
    }
  }

  const query = encodeURIComponent(prompt(shareUrl, title));

  return (
    <div className="ai-actions">
      <button
        className="ai-actions__item"
        type="button"
        onClick={copyMarkdown}
        aria-label="Copy this page as Markdown"
      >
        {copied ? (
          <Check aria-hidden="true" />
        ) : (
          <Copy aria-hidden="true" />
        )}
        {copied ? "Copied" : "Copy as Markdown"}
      </button>

      <a
        className="ai-actions__item"
        href={`https://claude.ai/new?q=${query}`}
        target="_blank"
        rel="noreferrer"
      >
        <Sparkles aria-hidden="true" />
        Open in Claude
      </a>

      <a
        className="ai-actions__item"
        href={`https://chatgpt.com/?q=${query}`}
        target="_blank"
        rel="noreferrer"
      >
        <Sparkles aria-hidden="true" />
        Open in ChatGPT
      </a>
    </div>
  );
}
