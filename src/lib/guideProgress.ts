import { tocItems } from "@/components/guide/guideChapters";

const VERSION = 1;
export const GUIDE_PROGRESS_EVENT = "rbc-guide-progress";

/** Guides that track reading progress. Keys stay stable — they are persisted. */
export const GUIDE_SLUGS = {
  structureCredit: "structure-credit",
  card: "card",
} as const;

export type GuideSlug = (typeof GUIDE_SLUGS)[keyof typeof GUIDE_SLUGS];

export const DEFAULT_GUIDE_SLUG: GuideSlug = GUIDE_SLUGS.structureCredit;

/**
 * Storage keys. The main guide keeps its original key so existing readers
 * don't lose local progress.
 */
const storageKey = (slug: GuideSlug) =>
  slug === GUIDE_SLUGS.structureCredit ? "rbc_guide_progress_v1" : `rbc_guide_progress_v1_${slug}`;

export interface GuideProgress {
  completed: string[];
  lastSectionId: string | null;
  updatedAt: number;
}

const EMPTY: GuideProgress = { completed: [], lastSectionId: null, updatedAt: 0 };

const validIds = () => new Set(tocItems.map((i) => i.id));

/** Orders ids by their position in the guide and drops unknown ones. */
export const normalizeCompleted = (ids: Iterable<string>): string[] => {
  const set = new Set(ids);
  return tocItems.map((i) => i.id).filter((id) => set.has(id));
};

/** Reads progress, filtering out section IDs that no longer exist. Never throws. */
export const readGuideProgress = (slug: GuideSlug = DEFAULT_GUIDE_SLUG): GuideProgress => {
  try {
    const raw = localStorage.getItem(storageKey(slug));
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== VERSION) return EMPTY;
    const ids = validIds();
    const completed = Array.isArray(parsed.completed)
      ? parsed.completed.filter((id: unknown): id is string => typeof id === "string" && ids.has(id))
      : [];
    const last =
      typeof parsed.lastSectionId === "string" && ids.has(parsed.lastSectionId)
        ? parsed.lastSectionId
        : null;
    return {
      completed,
      lastSectionId: last,
      updatedAt: typeof parsed.updatedAt === "number" ? parsed.updatedAt : 0,
    };
  } catch {
    return EMPTY;
  }
};

const write = (next: GuideProgress, slug: GuideSlug) => {
  try {
    localStorage.setItem(storageKey(slug), JSON.stringify({ version: VERSION, ...next }));
  } catch {
    // storage unavailable (private mode) — progress is best-effort only
  }
  try {
    window.dispatchEvent(new CustomEvent(GUIDE_PROGRESS_EVENT));
  } catch {
    // ignore
  }
};

/** Overwrites local progress (used after a remote merge). Never throws. */
export const writeGuideProgress = (
  next: GuideProgress,
  slug: GuideSlug = DEFAULT_GUIDE_SLUG,
) => write(next, slug);

/**
 * Merges two progress snapshots: completed chapters are a union, the last
 * reading position comes from whichever side was updated most recently.
 */
export const mergeGuideProgress = (a: GuideProgress, b: GuideProgress): GuideProgress => {
  const ids = validIds();
  const completed = normalizeCompleted(
    [...a.completed, ...b.completed].filter((id) => ids.has(id)),
  );
  const newer = b.updatedAt > a.updatedAt ? b : a;
  const older = newer === a ? b : a;
  const lastSectionId =
    (newer.lastSectionId && ids.has(newer.lastSectionId) ? newer.lastSectionId : null) ??
    (older.lastSectionId && ids.has(older.lastSectionId) ? older.lastSectionId : null);
  return {
    completed,
    lastSectionId,
    updatedAt: Math.max(a.updatedAt, b.updatedAt),
  };
};

export const setGuideCompleted = (
  id: string,
  completed: boolean,
  slug: GuideSlug = DEFAULT_GUIDE_SLUG,
): GuideProgress => {
  const current = readGuideProgress(slug);
  const set = new Set(current.completed);
  if (completed) set.add(id);
  else set.delete(id);
  const next: GuideProgress = {
    ...current,
    completed: normalizeCompleted(set),
    updatedAt: Date.now(),
  };
  write(next, slug);
  return next;
};

export const setGuideLastSection = (
  id: string,
  slug: GuideSlug = DEFAULT_GUIDE_SLUG,
): GuideProgress | null => {
  const current = readGuideProgress(slug);
  if (current.lastSectionId === id) return null;
  if (!validIds().has(id)) return null;
  const next: GuideProgress = { ...current, lastSectionId: id, updatedAt: Date.now() };
  write(next, slug);
  return next;
};
