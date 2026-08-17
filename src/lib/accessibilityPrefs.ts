/**
 * Accessibility mode preferences.
 *
 * A single "accessibility mode" master switch plus individual options. Each
 * option maps to a class on <html> that global CSS in index.css reacts to.
 * Preferences persist in localStorage so they survive navigation and reloads.
 */
export type A11yPrefs = {
  enabled: boolean;
  largeText: boolean;
  highContrast: boolean;
  reduceMotion: boolean;
  underlineLinks: boolean;
  focusHighlight: boolean;
};

export const DEFAULT_A11Y_PREFS: A11yPrefs = {
  enabled: false,
  largeText: true,
  highContrast: true,
  reduceMotion: true,
  underlineLinks: true,
  focusHighlight: true,
};

const STORAGE_KEY = "rbc_a11y_prefs";

export function readA11yPrefs(): A11yPrefs {
  if (typeof window === "undefined") return DEFAULT_A11Y_PREFS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_A11Y_PREFS;
    return { ...DEFAULT_A11Y_PREFS, ...(JSON.parse(raw) as Partial<A11yPrefs>) };
  } catch {
    return DEFAULT_A11Y_PREFS;
  }
}

export function writeA11yPrefs(prefs: A11yPrefs) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    /* storage unavailable — preferences stay in memory for this session */
  }
}

export function applyA11yPrefs(prefs: A11yPrefs) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const on = (cls: string, active: boolean) => root.classList.toggle(cls, active);
  on("a11y-mode", prefs.enabled);
  on("a11y-large-text", prefs.enabled && prefs.largeText);
  on("a11y-high-contrast", prefs.enabled && prefs.highContrast);
  on("a11y-reduce-motion", prefs.enabled && prefs.reduceMotion);
  on("a11y-underline-links", prefs.enabled && prefs.underlineLinks);
  on("a11y-focus-highlight", prefs.enabled && prefs.focusHighlight);
}
