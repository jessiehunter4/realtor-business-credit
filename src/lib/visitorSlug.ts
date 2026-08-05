/**
 * Parses a personalized visitor slug from a URL segment (e.g. `/guide/:slug`).
 *
 * MVP rules: the slug IS the personalization source — no DB or CRM lookup.
 * Anything that doesn't look like a human name is treated as invalid so the
 * page can silently fall back to the non-personalized experience.
 */
export interface ParsedVisitorSlug {
  /** Decoded, trimmed raw slug (empty when absent). */
  raw: string;
  /** Title-cased display name, empty when the slug is invalid. */
  displayName: string;
  isValid: boolean;
}

const NAME_PATTERN = /^[a-zA-Z][a-zA-Z\s'’]*$/;

/** e.g. "JP.Eltanal", "J.Hunter" — initials + "." + surname. */
const INITIALS_PATTERN = /^([A-Z]{1,4})\.([a-zA-Z][a-zA-Z'’-]*)$/;

const titleCase = (word: string) =>
  word.length > 1 ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : word.toUpperCase();

export function parseVisitorSlug(slug?: string | null): ParsedVisitorSlug {
  const empty: ParsedVisitorSlug = { raw: "", displayName: "", isValid: false };
  if (!slug) return empty;

  let decoded: string;
  try {
    decoded = decodeURIComponent(slug);
  } catch {
    decoded = slug;
  }
  const raw = decoded.trim();
  if (!raw || raw.length > 60) return { ...empty, raw };

  // Initials format keeps its capitalization verbatim ("JP.Eltanal" -> "JP Eltanal").
  const initialsMatch = raw.match(INITIALS_PATTERN);
  if (initialsMatch) {
    const [, initials, surname] = initialsMatch;
    return {
      raw,
      displayName: `${initials} ${titleCase(surname)}`,
      isValid: true,
    };
  }

  const spaced = raw.replace(/[+_\-.]+/g, " ").replace(/\s+/g, " ").trim();
  if (!spaced || !NAME_PATTERN.test(spaced)) return { ...empty, raw };

  const parts = spaced.split(" ");
  if (parts.length > 4) return { ...empty, raw };

  return { raw, displayName: parts.map(titleCase).join(" "), isValid: true };
}

/** First name only, useful for greetings. */
export function firstNameFromSlug(slug?: string | null): string {
  const { displayName, isValid } = parseVisitorSlug(slug);
  return isValid ? displayName.split(" ")[0] : "";
}