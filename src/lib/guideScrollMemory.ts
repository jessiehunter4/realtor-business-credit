const KEY = "rbc_guide_scroll_y";
const TS_KEY = "rbc_guide_scroll_ts";
const MAX_AGE_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

export const saveGuideScroll = () => {
  try {
    localStorage.setItem(KEY, String(window.scrollY));
    localStorage.setItem(TS_KEY, String(Date.now()));
  } catch {
    // ignore
  }
};

export const consumeGuideScroll = (): number | null => {
  try {
    const raw = localStorage.getItem(KEY);
    const ts = Number(localStorage.getItem(TS_KEY) || "0");
    if (!raw) return null;
    localStorage.removeItem(KEY);
    localStorage.removeItem(TS_KEY);
    if (!ts || Date.now() - ts > MAX_AGE_MS) return null;
    const y = Number(raw);
    return Number.isFinite(y) ? y : null;
  } catch {
    return null;
  }
};