"use client";

import {
  Check,
  ChevronDown,
  Copy,
  ExternalLink,
  FileText,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/*
 * A single "Open" control offering the page as Markdown, plus handing its
 * Markdown URL to an assistant — the pattern Fumadocs uses for its docs.
 *
 * Built here rather than imported from `fumadocs-ui`, which is deliberately not
 * installed: it ships an entire docs theme and its own palette. Underneath, each
 * option is just a prefilled query string against the raw Markdown route.
 */

type Props = {
  /** Same-origin path used to fetch and to link the Markdown. */
  rawPath: string;
  /**
   * Public absolute URL of that Markdown, handed to the assistant.
   *
   * Passed from the server rather than read off `window.location`: deriving it
   * client-side only would differ from the server render and break hydration,
   * and a localhost URL is useless to an assistant.
   */
  shareUrl: string;
  title: string;
};

function buildTargets(url: string, title: string) {
  const prompt = `Read ${url} — it is the article "${title}" in Markdown. Summarise it, then I have questions.`;

  return [
    {
      name: "ChatGPT",
      href: `https://chatgpt.com/?${new URLSearchParams({ hints: "search", prompt })}`,
    },
    {
      name: "Claude",
      href: `https://claude.ai/new?${new URLSearchParams({ q: prompt })}`,
    },
    {
      name: "Cursor",
      href: `https://cursor.com/link/prompt?${new URLSearchParams({ text: prompt })}`,
    },
    {
      name: "Scira",
      href: `https://scira.ai/?${new URLSearchParams({ q: prompt })}`,
    },
  ];
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

  return (
    <div className="ai-actions">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="ai-actions__trigger" variant="outline">
            <Sparkles aria-hidden="true" />
            <span className="tool-label">Ask about this</span>
            <ChevronDown aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="ai-actions__menu">
          <DropdownMenuItem onSelect={(event) => {
            // Keep the menu's focus handling from cancelling the async copy.
            event.preventDefault();
            void copyMarkdown();
          }}>
            {copied ? (
              <Check aria-hidden="true" />
            ) : (
              <Copy aria-hidden="true" />
            )}
            {copied ? "Copied" : "Copy as Markdown"}
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <a href={rawPath} target="_blank" rel="noreferrer">
              <FileText aria-hidden="true" />
              View as Markdown
            </a>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {buildTargets(shareUrl, title).map((target) => (
            <DropdownMenuItem asChild key={target.name}>
              <a href={target.href} target="_blank" rel="noreferrer">
                <ExternalLink aria-hidden="true" />
                Open in {target.name}
              </a>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
