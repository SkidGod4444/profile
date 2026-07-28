"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { themeColors, themeStorageKey, type ColorTheme } from "@/lib/theme";

type ThemeContextValue = {
  theme: ColorTheme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  toggleTheme: () => {},
});

/**
 * Read whatever is already on `<html>` — the rendered `data-theme="dark"`
 * default, or the stored choice the bootstrap script applied — so the first
 * client render agrees with the painted DOM.
 */
function readTheme(): ColorTheme {
  if (typeof document === "undefined") {
    return "dark";
  }

  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ColorTheme>(readTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", themeColors[theme]);
  }, [theme]);

  /*
   * Persisting only on an explicit toggle — not from the effect above — keeps
   * the site following the OS setting until the visitor actually overrides it.
   * Writing on mount would store the system-derived value on the first visit
   * and pin the theme forever after.
   */
  const toggleTheme = useCallback(() => {
    const next: ColorTheme = theme === "dark" ? "light" : "dark";

    try {
      window.localStorage.setItem(themeStorageKey, next);
    } catch {
      // Private browsing modes can reject localStorage writes.
    }

    setTheme(next);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
