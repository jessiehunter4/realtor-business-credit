import { Accessibility, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useAccessibilityPrefs } from "@/hooks/useAccessibilityPrefs";
import type { A11yPrefs } from "@/lib/accessibilityPrefs";

const OPTIONS: { key: keyof A11yPrefs; label: string; hint: string }[] = [
  { key: "largeText", label: "Larger text", hint: "Increase base font size across the site" },
  { key: "highContrast", label: "High contrast", hint: "Stronger text and border contrast" },
  { key: "reduceMotion", label: "Reduce motion", hint: "Turn off animations and smooth scrolling" },
  { key: "underlineLinks", label: "Underline links", hint: "Make links identifiable without color" },
  { key: "focusHighlight", label: "Strong focus outline", hint: "Thicker keyboard focus indicator" },
];

/**
 * Floating accessibility control. The trigger toggles nothing on its own —
 * it opens a panel with the master "Accessibility mode" switch plus the
 * individual options, all persisted to localStorage.
 */
const AccessibilityToggle = () => {
  const { prefs, setPref, toggleMode, reset } = useAccessibilityPrefs();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          size="icon"
          variant={prefs.enabled ? "default" : "secondary"}
          aria-label={
            prefs.enabled
              ? "Accessibility options (accessibility mode is on)"
              : "Accessibility options (accessibility mode is off)"
          }
          className="fixed bottom-4 left-4 z-[60] h-12 w-12 rounded-full shadow-lg"
        >
          <Accessibility className="h-5 w-5" aria-hidden="true" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="start"
        className="z-[70] w-80 max-w-[calc(100vw-2rem)] p-4"
        aria-label="Accessibility settings"
      >
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-semibold text-secondary">Accessibility mode</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Turn on display adjustments that make the site easier to read and navigate.
            </p>
          </div>

          <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/50 px-3 py-2.5">
            <Label htmlFor="a11y-mode" className="text-sm font-semibold">
              {prefs.enabled ? "On" : "Off"}
            </Label>
            <Switch id="a11y-mode" checked={prefs.enabled} onCheckedChange={toggleMode} />
          </div>

          <Separator />

          <fieldset className="space-y-3" disabled={!prefs.enabled}>
            <legend className="sr-only">Accessibility options</legend>
            {OPTIONS.map((opt) => (
              <div
                key={opt.key}
                className={`flex items-start justify-between gap-3 ${prefs.enabled ? "" : "opacity-60"}`}
              >
                <div className="min-w-0">
                  <Label htmlFor={`a11y-${opt.key}`} className="text-sm">
                    {opt.label}
                  </Label>
                  <p id={`a11y-${opt.key}-hint`} className="text-xs text-muted-foreground">
                    {opt.hint}
                  </p>
                </div>
                <Switch
                  id={`a11y-${opt.key}`}
                  aria-describedby={`a11y-${opt.key}-hint`}
                  checked={Boolean(prefs[opt.key])}
                  disabled={!prefs.enabled}
                  onCheckedChange={(checked) => setPref(opt.key, checked)}
                />
              </div>
            ))}
          </fieldset>

          <Button variant="outline" size="sm" className="w-full" onClick={reset}>
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Reset to defaults
          </Button>

          <p aria-live="polite" className="sr-only">
            Accessibility mode is {prefs.enabled ? "on" : "off"}.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AccessibilityToggle;
