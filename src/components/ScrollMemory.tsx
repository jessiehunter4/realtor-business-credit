import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const KEY = "rbc_scroll_positions_v1";

type PositionMap = Record<string, number>;

const loadMap = (): PositionMap => {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
};

const saveMap = (m: PositionMap) => {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(m));
  } catch {
    // ignore
  }
};

const savePosition = (path: string, y: number) => {
  const m = loadMap();
  m[path] = y;
  saveMap(m);
};

const readPosition = (path: string): number | undefined => loadMap()[path];

/**
 * Tracks and restores per-route scroll positions independently.
 * - Saves the outgoing route's scrollY the moment the pathname changes.
 * - Restores the incoming route's saved position (or 0 for first visit),
 *   retrying via rAF until the DOM has grown tall enough to reach it
 *   (handles lazy content / images on long pages like /guide).
 */
const ScrollMemory = () => {
  const location = useLocation();
  const navType = useNavigationType();
  const prevPathRef = useRef<string>(location.pathname);
  const currentScrollRef = useRef<number>(0);

  // Take manual control from the browser so it can't overwrite our restore.
  useEffect(() => {
    try {
      window.history.scrollRestoration = "manual";
    } catch {
      // ignore
    }
    const onScroll = () => {
      currentScrollRef.current = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const onHide = () => {
      savePosition(prevPathRef.current, window.scrollY);
    };
    window.addEventListener("pagehide", onHide);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pagehide", onHide);
    };
  }, []);

  useEffect(() => {
    const nextPath = location.pathname;
    const prevPath = prevPathRef.current;

    if (prevPath !== nextPath) {
      // Persist the outgoing page's scroll (captured just before route swap).
      savePosition(prevPath, currentScrollRef.current);
      prevPathRef.current = nextPath;
    }

    const saved = readPosition(nextPath);
    // PUSH navigations to a new route go to top by default when nothing is saved.
    const target = saved ?? 0;

    let cancelled = false;
    let attempts = 0;
    const tryScroll = () => {
      if (cancelled) return;
      const maxY =
        document.documentElement.scrollHeight - window.innerHeight;
      if (maxY >= target - 2 || attempts > 60) {
        window.scrollTo({ top: Math.max(0, target), behavior: "auto" });
        currentScrollRef.current = Math.max(0, target);
        return;
      }
      attempts += 1;
      requestAnimationFrame(tryScroll);
    };
    requestAnimationFrame(tryScroll);

    return () => {
      cancelled = true;
    };
    // Only react to pathname changes; ignore search/hash churn.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, navType]);

  return null;
};

export default ScrollMemory;