"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTheme } from "./theme-provider";

/**
 * Both glyphs are always present in the markup and CSS reveals one based on
 * `[data-theme]`, so the button renders correctly on the server and never
 * mismatches during hydration.
 */
export function ThemeToggle() {
  const { toggleTheme } = useTheme();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          className="theme-toggle"
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label="Toggle color theme"
        >
          <Moon className="theme-toggle__icon theme-toggle__icon--moon" />
          <Sun className="theme-toggle__icon theme-toggle__icon--sun" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="left">Toggle theme</TooltipContent>
    </Tooltip>
  );
}
