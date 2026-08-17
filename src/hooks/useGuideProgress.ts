import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { tocItems } from "@/components/guide/guideChapters";
import { useAuthRole } from "@/hooks/useAuthRole";
import {
  DEFAULT_GUIDE_SLUG,
  GUIDE_PROGRESS_EVENT,
  mergeGuideProgress,
  readGuideProgress,
  setGuideCompleted,
  setGuideLastSection,
  writeGuideProgress,
  type GuideProgress,
  type GuideSlug,
} from "@/lib/guideProgress";
import { fetchRemoteProgress, upsertRemoteProgress } from "@/lib/guideProgressRemote";

/**
 * Shared reactive view of the reader's guide progress.
 *
 * Local storage renders instantly and always works (including signed out).
 * For a signed-in reader the server copy is merged in once per session so the
 * position and completed chapters follow them across devices.
 */
export function useGuideProgress(slug: GuideSlug = DEFAULT_GUIDE_SLUG) {
  const { session } = useAuthRole();
  const userId = session?.user?.id ?? null;
  const [progress, setProgress] = useState<GuideProgress>(() => readGuideProgress(slug));
  const [syncing, setSyncing] = useState(false);
  const mergedForUser = useRef<string | null>(null);

  useEffect(() => {
    const sync = () => setProgress(readGuideProgress(slug));
    window.addEventListener(GUIDE_PROGRESS_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(GUIDE_PROGRESS_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [slug]);

  // One-time merge of local + remote when a session appears.
  useEffect(() => {
    if (!userId) {
      mergedForUser.current = null;
      return;
    }
    if (mergedForUser.current === userId) return;
    mergedForUser.current = userId;

    let cancelled = false;
    setSyncing(true);
    (async () => {
      const remote = await fetchRemoteProgress(userId, slug);
      if (cancelled) return;
      const local = readGuideProgress(slug);
      const merged = remote ? mergeGuideProgress(local, remote) : local;
      writeGuideProgress(merged, slug);
      setProgress(merged);
      setSyncing(false);
      // Push the merged view back so the other device converges too.
      if (merged.completed.length > 0 || merged.lastSectionId) {
        void upsertRemoteProgress(userId, merged, slug);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId, slug]);

  const completedSet = useMemo(() => new Set(progress.completed), [progress.completed]);

  const toggle = useCallback(
    (id: string, next: boolean) => {
      const updated = setGuideCompleted(id, next, slug);
      setProgress(updated);
      if (userId) void upsertRemoteProgress(userId, updated, slug);
    },
    [userId, slug],
  );

  return {
    progress,
    syncing,
    completedSet,
    completedCount: completedSet.size,
    totalCount: tocItems.length,
    isCompleted: (id: string) => completedSet.has(id),
    toggle,
  };
}

const DWELL_MS = 1500;
const REMOTE_INTERVAL_MS = 10_000;

/**
 * Observes guide sections and records the last section the reader actually
 * dwelled on (~1.5s), so a quick scroll-through never creates a bookmark.
 * Remote writes are coalesced to at most one per 10s, with a final flush when
 * the page is hidden or unloaded.
 */
export function useGuideReadingPosition(enabled = true, slug: GuideSlug = DEFAULT_GUIDE_SLUG) {
  const { session } = useAuthRole();
  const userId = session?.user?.id ?? null;
  const timerRef = useRef<number | null>(null);
  const lastRemoteAt = useRef(0);
  const pendingRef = useRef<GuideProgress | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const clear = () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = null;
    };

    const flush = () => {
      const pending = pendingRef.current;
      if (!pending || !userId) return;
      pendingRef.current = null;
      lastRemoteAt.current = Date.now();
      void upsertRemoteProgress(userId, pending, slug);
    };

    const record = (id: string) => {
      const updated = setGuideLastSection(id, slug);
      if (!updated || !userId) return;
      pendingRef.current = updated;
      if (Date.now() - lastRemoteAt.current >= REMOTE_INTERVAL_MS) flush();
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
        timerRef.current = window.setTimeout(() => record(id), DWELL_MS);
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 },
    );

    tocItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    const onHide = () => {
      if (document.visibilityState === "hidden") flush();
    };
    window.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", flush);

    return () => {
      clear();
      observer.disconnect();
      window.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", flush);
      flush();
    };
  }, [enabled, userId, slug]);
}
