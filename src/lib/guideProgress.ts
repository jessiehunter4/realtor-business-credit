import { tocItems } from "@/components/guide/guideChapters";

const KEY = "rbc_guide_progress_v1";
const VERSION = 1;
export const GUIDE_PROGRESS_EVENT = "rbc-guide-progress";

export interface GuideProgress {
  completed: string[];
  lastSectionId: string | null;
  updatedAt: number;
}

const EMPTY: GuideProgress = { completed: [], lastSectionId: null, updatedAt: 0 };

const validIds = () => new Set(tocItems.map((i) => i.id));

/** Reads progress, filtering out section IDs that no longer exist. Never throws. */
export const readGuideProgress = (): GuideProgress => {
  try {
    const raw = localStorage.getItem(KEY);
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

const write = (next: GuideProgress) => {
  try {
    localStorage.setItem(KEY, JSON.stringify({ version: VERSION, ...next }));
  } catch {
    // storage unavailable (private mode) — progress is best-effort only
  }
  try {
    window.dispatchEvent(new CustomEvent(GUIDE_PROGRESS_EVENT));
  } catch {
    // ignore
  }
};

export const setGuideCompleted = (id: string, completed: boolean): GuideProgress => {
  const current = readGuideProgress();
  const set = new Set(current.completed);
  if (completed) set.add(id);
  else set.delete(id);
  const next: GuideProgress = {
    ...current,
    completed: tocItems.map((i) => i.id).filter((i) => set.has(i)),
    updatedAt: Date.now(),
  };
  write(next);
  return next;
};

export const setGuideLastSection = (id: string) => {
  const current = readGuideProgress();
  if (current.lastSectionId === id) return;
  if (!validIds().has(id)) return;
  write({ ...current, lastSectionId: id, updatedAt: Date.now() });
};