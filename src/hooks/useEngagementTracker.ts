import { useEffect, useRef, useCallback, useMemo } from "react";
import { postFunnelEvent } from "@/lib/logFunnelEvent";

interface EngagementConfig {
  contactId: string;
  pageName: string;
  scrollThresholds?: number[];
  onThreshold?: (pct: number) => void;
}

export function useEngagementTracker({
  contactId,
  pageName,
  scrollThresholds = [],
  onThreshold,
}: EngagementConfig) {
  const mountTime = useRef(Date.now());
  const maxScroll = useRef(0);
  const firedThresholds = useRef<Set<number>>(new Set());
  const unmountLogged = useRef(false);

  // Stabilise the thresholds array so the scroll effect doesn't churn
  const stableThresholds = useMemo(
    () => scrollThresholds,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [scrollThresholds.join(",")],
  );

  const logEvent = useCallback(
    async (eventType: string, metadata: Record<string, unknown> = {}) => {
      try {
        const data = await postFunnelEvent({
          contactId: contactId || undefined,
          eventType,
          metadata,
        });
        console.log(`[Engagement] Successfully logged: ${eventType}`, data);
      } catch (e) {
        console.error(`[Engagement] Failed to log ${eventType}:`, e);
      }
    },
    [contactId],
  );

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const pct = Math.round((scrollTop / docHeight) * 100);
      if (pct > maxScroll.current) maxScroll.current = pct;

      for (const threshold of stableThresholds) {
        if (pct >= threshold && !firedThresholds.current.has(threshold)) {
          firedThresholds.current.add(threshold);
          onThreshold?.(threshold);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [stableThresholds, onThreshold]);

  // Fire session summary — called on both React unmount AND beforeunload
  const sendSession = useCallback(() => {
    if (unmountLogged.current) return;
    unmountLogged.current = true;
    const seconds = Math.round((Date.now() - mountTime.current) / 1000);
    void postFunnelEvent(
      {
        contactId: contactId || undefined,
        eventType: `${pageName}_session`,
        metadata: {
          max_scroll_pct: maxScroll.current,
          time_on_page_seconds: seconds,
        },
      },
      { keepalive: true },
    ).catch(() => {});
  }, [contactId, pageName]);

  // beforeunload ensures session fires even when user closes tab
  useEffect(() => {
    const handleUnload = () => sendSession();
    window.addEventListener("beforeunload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      sendSession(); // also fire on React unmount (in-app navigation)
    };
  }, [sendSession]);

  return { logEvent };
}
