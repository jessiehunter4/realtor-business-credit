import { useEffect, useRef, useCallback, useMemo } from "react";
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

  // Stabilise the thresholds array so the scroll effect doesn't churn
  const stableThresholds = useMemo(
    () => scrollThresholds,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [scrollThresholds.join(",")],
  );

  const logEvent = useCallback(
    async (eventType: string, metadata: Record<string, unknown> = {}) => {
      try {
        const { error } = await supabase.functions.invoke("log-funnel-event", {
          body: { contactId: contactId || undefined, eventType, metadata },
        });
        if (error) {
          console.error(`log-funnel-event invoke error for ${eventType}:`, error);
        }
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

  // Session summary on unmount — use sendBeacon for reliability
  useEffect(() => {
    const cId = contactId;
    const pName = pageName;

    return () => {
      if (unmountLogged.current) return;
      unmountLogged.current = true;
      const seconds = Math.round((Date.now() - mountTime.current) / 1000);
      const eventType = `${pName}_session`;
      const metadata = {
        max_scroll_pct: maxScroll.current,
        time_on_page_seconds: seconds,
      };

      // Use sendBeacon for reliable delivery on page unload/navigation
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/log-funnel-event`;
      const payload = JSON.stringify({
        contactId: cId || undefined,
        eventType,
        metadata,
      });

      const sent = navigator.sendBeacon?.(
        url,
        new Blob([payload], { type: "application/json" }),
      );

      // Fallback to fetch if sendBeacon isn't available or fails
      if (!sent) {
        fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    };
    // Only run cleanup on unmount — stable deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { logEvent };
}
