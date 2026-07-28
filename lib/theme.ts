/**
 * Shared by the client theme provider and the server-rendered bootstrap script
 * in the root layout. It must NOT live in a "use client" module: a server
 * component importing a const from a client module receives a client reference
 * rather than the string, which silently becomes `undefined` in the inlined
 * script.
 */
export const themeStorageKey = "saidev-theme";

export type ColorTheme = "light" | "dark";

/**
 * The `<meta name="theme-color">` value per theme, which tints mobile browser
 * chrome. Keep in step with `--paper` in globals.css — this is the one place
 * the paper colour is duplicated outside the stylesheet.
 */
export const themeColors: Record<ColorTheme, string> = {
  light: "#fafaf9",
  dark: "#0c0a09",
};

/**
 * Ink used by the background shader. Only *just* warm — the stone steps the
 * text palette uses (#78716c / #a8a29e) are a visible taupe, which the backdrop
 * hides at 26–30% opacity but any shader that fills large areas renders as
 * outright brown. These read as grey while still sitting in the warm family.
 *
 * Light needs the darker step to register against near-white paper; dark needs
 * the lighter one.
 */
export const shaderInk: Record<ColorTheme, string> = {
  light: "#7c7a78",
  dark: "#a5a3a1",
};
