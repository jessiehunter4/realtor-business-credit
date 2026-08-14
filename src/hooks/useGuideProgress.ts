import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { tocItems } from "@/components/guide/guideChapters";
import {
  GUIDE_PROGRESS_EVENT,
  readGuideProgress,
  setGuideCompleted,
  setGuideLastSection,
  type GuideProgress,
} from "@/lib/guideProgress";

/** Shared reactive view of the reader's guide progress (local to this device). */
export function useGuideProgress() {
  const [progress, setProgress] = useState<GuideProgress>(() => readGuideProgress());

  useEffect(() => {
    const sync = () => setProgress(readGuideProgress());
    window.addEventListener(GUIDE_PROGRESS_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(GUIDE_PROGRESS_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const completedSet = useMemo(() => new Set(progress.completed), [progress.completed]);

  const toggle = useCallback((id: string, next: boolean) => {
    setProgress(setGuideCompleted(id, next));
  }, []);

  return {
    progress,
    completedSet,
    completedCount: completedSet.size,
    totalCount: tocItems.length,
    isCompleted: (id: string) => completedSet.has(id),
    toggle,
  };
}

const DWELL_MS = 1500;

/**
 * Observes guide sections and records the last section the reader actually
 * dwelled on (~1.5s), so a quick scroll-through never creates a bookmark.
 */
export function useGuideReadingPosition(enabled = true) {
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const clear = () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = null;
    };

    let currentId = "";
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        const id = visible[0].target.id;
        if (!id || id === currentId) return;
        currentId = id;
        clear();
        timerRef.current = window.setTimeout(() => setGuideLastSection(id), DWELL_MS);
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 },
    );

    tocItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => {
      clear();
      observer.disconnect();
    };
  }, [enabled]);
}