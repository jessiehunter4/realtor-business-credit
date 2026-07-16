const KEY = "rbc_guide_scroll_y";

export const saveGuideScroll = () => {
  try {
    sessionStorage.setItem(KEY, String(window.scrollY));
  } catch {
    // ignore
  }
};

export const readGuideScroll = (): number | null => {
  try {
    const v = sessionStorage.getItem(KEY);
    if (v == null) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
};

export const clearGuideScroll = () => {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // ignore
  }
};