import { useCallback, useEffect, useState } from "react";
import {
  applyA11yPrefs,
  DEFAULT_A11Y_PREFS,
  readA11yPrefs,
  writeA11yPrefs,
  type A11yPrefs,
} from "@/lib/accessibilityPrefs";

/** Reads, applies and persists the visitor's accessibility mode settings. */
export function useAccessibilityPrefs() {
  const [prefs, setPrefs] = useState<A11yPrefs>(() => readA11yPrefs());

  useEffect(() => {
    applyA11yPrefs(prefs);
    writeA11yPrefs(prefs);
  }, [prefs]);

  const setPref = useCallback(<K extends keyof A11yPrefs>(key: K, value: A11yPrefs[K]) => {
    setPrefs((p) => ({ ...p, [key]: value }));
  }, []);

  const toggleMode = useCallback(() => setPrefs((p) => ({ ...p, enabled: !p.enabled })), []);
  const reset = useCallback(() => setPrefs({ ...DEFAULT_A11Y_PREFS }), []);

  return { prefs, setPref, toggleMode, reset };
}
