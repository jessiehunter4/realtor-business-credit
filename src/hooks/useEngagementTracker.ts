import { useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

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

  const logEvent = useCallback(
    async (eventType: string, metadata: Record<string, unknown> = {}) => {
      try {
        await supabase.functions.invoke("log-funnel-event", {
          body: { contactId: contactId || undefined, eventType, metadata },
        });
      } catch (e) {
        console.error(`Failed to log ${eventType}:`, e);
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

      for (const threshold of scrollThresholds) {
        if (pct >= threshold && !firedThresholds.current.has(threshold)) {
          firedThresholds.current.add(threshold);
          onThreshold?.(threshold);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollThresholds, onThreshold]);

  // Session summary on unmount
  useEffect(() => {
    return () => {
      if (unmountLogged.current) return;
      unmountLogged.current = true;
      const seconds = Math.round((Date.now() - mountTime.current) / 1000);
      logEvent(`${pageName}_session`, {
        max_scroll_pct: maxScroll.current,
        time_on_page_seconds: seconds,
      });
    };
  }, [logEvent, pageName]);

  return { logEvent };
}
