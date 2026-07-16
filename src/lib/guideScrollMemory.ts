const KEY = "rbc_guide_scroll";
const TTL_MS = 1000 * 60 * 60 * 4; // 4 hours

interface StoredScroll {
  y: number;
  ts: number;
  path: string;
}

/** Save current window scroll position so we can return the user to it later. */
export function saveGuideScroll(): void {
  try {
    const data: StoredScroll = {
      y: window.scrollY || window.pageYOffset || 0,
      ts: Date.now(),
      path: window.location.pathname,
    };
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

/** Read a stored scroll position (if fresh). Does not clear it. */
export function readGuideScroll(): number | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as StoredScroll;
    if (!data || typeof data.y !== "number") return null;
    if (Date.now() - data.ts > TTL_MS) {
      localStorage.removeItem(KEY);
      return null;
    }
    return data.y;
  } catch {
    return null;
  }
}

/** Clear the stored scroll position. */
export function clearGuideScroll(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}