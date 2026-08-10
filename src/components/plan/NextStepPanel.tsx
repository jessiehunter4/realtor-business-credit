import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Calendar,
  CheckCircle,
  Compass,
  CreditCard,
  Loader2,
  Rocket,
  Sparkles,
  Clock,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { postFunnelEvent } from "@/lib/logFunnelEvent";
import { toast } from "sonner";
import InlinePricingAccordion from "./InlinePricingAccordion";

export type ReadinessId = "ready_now" | "within_30" | "need_clarity" | "exploring";

interface Option {
  id: ReadinessId;
  label: string;
  short: string;
  headline: string;
  body: string;
  icon: LucideIcon;
  tag: string;
  accent: string; // tailwind text/bg accent classes for headline
  showPricing: boolean;
  pricingDefaultOpen?: string;
  cta: { label: string; href: string; icon: LucideIcon; external?: boolean };
  secondary?: { label: string; href: string; external?: boolean };
  extras?: string[];
}

const READINESS_OPTIONS: Option[] = [
  {
    id: "ready_now",
    label: "I'm ready to start now",
    short: "Ready now",
    headline: "Let's get you enrolled.",
    body:
      "You'll be routed to secure Stripe checkout. Once you enroll, your coach kicks off onboarding within one business day and your portal unlocks the full 90-day action plan.",
    icon: Rocket,
    tag: "f-readiness-ready-now",
    accent: "border-primary/40 bg-primary/5",
    showPricing: true,
    pricingDefaultOpen: "cohort",
    cta: { label: "Enroll & begin", href: "/checkout?tier=cohort", icon: CreditCard },
  },
  {
    id: "within_30",
    label: "I want to start within 30 days",
    short: "Within 30 days",
    headline: "No problem — and no pressure.",
    body:
      "Use the next few weeks to line up the basics so day one moves fast. When you're ready, come back here and click enroll.",
    icon: Clock,
    tag: "f-readiness-30-days",
    accent: "border-amber-300 bg-amber-50",
    showPricing: true,
    extras: [
      "Gather your EIN paperwork (or note that you need one)",
      "List every credit card, bank account, and loan tied to the business today",
      "Skim the guide chapters that match your top gap",
    ],
    cta: { label: "See pricing while I prepare", href: "#inline-pricing", icon: Sparkles },
    secondary: { label: "Read the free guide", href: "/guide" },
  },
  {
    id: "need_clarity",
    label: "I need more clarity first",
    short: "Need clarity",
    headline: "Let's talk it through.",
    body:
      "Take another pass through your plan and the guide. They cover the questions most Realtors have at this stage, so you can decide which tier — if any — actually fits your business right now.",
    icon: Compass,
    tag: "f-readiness-clarity",
    accent: "border-sky-300 bg-sky-50",
    showPricing: true,
    cta: { label: "Read the free guide", href: "/guide", icon: ArrowRight },
  },
  {
    id: "exploring",
    label: "I'm just exploring",
    short: "Just exploring",
    headline: "Take your time.",
    body:
      "No pressure at all. Keep reading, keep thinking, and come back when the timing feels right. Here's what's most useful while you look around.",
    icon: Sparkles,
    tag: "f-readiness-exploring",
    accent: "border-secondary/20 bg-secondary/[0.03]",
    showPricing: true,
    cta: { label: "Read the free guide", href: "/guide", icon: ArrowRight },
    secondary: { label: "See a sample plan", href: "/sample-plan" },
  },
];

interface Props {
  planId?: string;
  contactId?: string;
  initialSelection?: ReadinessId | null;
  demo?: boolean;
}

export default function NextStepPanel({ planId, contactId, initialSelection, demo }: Props) {
  const [selection, setSelection] = useState<ReadinessId | "">(initialSelection ?? "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialSelection) setSelection(initialSelection);
  }, [initialSelection]);

  const handleChange = async (value: string) => {
    const next = value as ReadinessId;
    setSelection(next);
    if (demo) return;

    setSaving(true);
    try {
      if (planId) {
        await supabase
          .from("custom_plans")
          .update({ readiness_selection: next })
          .eq("id", planId);
      }

      const opt = READINESS_OPTIONS.find((o) => o.id === next);
      if (opt && contactId) {
        await supabase.functions
          .invoke("tag-ghl-contact", {
            body: { contactId, tags: [opt.tag] },
          })
          .catch((e) => console.error("readiness tag failed:", e));
      }

      await postFunnelEvent({
        contactId,
        eventType: "plan_readiness_selected",
        metadata: { readiness: next, plan_id: planId ?? null },
      }).catch(() => null);
    } catch (e) {
      console.error("Failed to save readiness selection", e);
      toast.error("Couldn't save your selection. It's fine — pick your next step below.");
    } finally {
      setSaving(false);
    }
  };

  const active = READINESS_OPTIONS.find((o) => o.id === selection);

  const buildHref = (href: string) => {
    if (href.startsWith("#") || href.startsWith("http")) return href;
    if (!contactId) return href;
    const sep = href.includes("?") ? "&" : "?";
    return `${href}${sep}contactId=${encodeURIComponent(contactId)}`;
  };

  return (
    <section
      aria-labelledby="next-step-heading"
      className="mt-8 rounded-2xl bg-white border border-border shadow-card overflow-hidden"
    >
      <div className="bg-muted/50 px-6 sm:px-8 py-5 border-b border-border">
        <p className="text-primary text-[10px] tracking-[0.2em] uppercase font-semibold">
          Your Next Step
        </p>
        <h3 id="next-step-heading" className="text-secondary text-xl sm:text-2xl font-bold mt-1">
          Where are you right now with starting the program?
        </h3>
        <p className="text-secondary/70 text-sm mt-1">
          Pick the option that fits — we'll show you exactly what to do next.
        </p>
      </div>

      <div className="px-6 sm:px-8 py-6 space-y-6">
        <RadioGroup
          value={selection}
          onValueChange={handleChange}
          className="grid gap-3 sm:grid-cols-2"
        >
          {READINESS_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const checked = selection === opt.id;
            return (
              <Label
                key={opt.id}
                htmlFor={`readiness-${opt.id}`}
                className={
                  "cursor-pointer flex items-start gap-3 rounded-xl border p-3 transition-all duration-200 " +
                  (checked
                    ? "border-primary bg-primary/5 shadow-card"
                    : "border-border bg-white hover:border-secondary/40 hover:bg-primary/[0.03] hover:shadow-sm")
                }
              >
                <RadioGroupItem
                  id={`readiness-${opt.id}`}
                  value={opt.id}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Icon
                      className={
                        "h-4 w-4 " + (checked ? "text-primary" : "text-secondary/60")
                      }
                    />
                    <span className="font-semibold text-secondary text-sm">{opt.label}</span>
                  </div>
                </div>
              </Label>
            );
          })}
        </RadioGroup>

        {saving && (
          <p className="text-xs text-secondary/60 flex items-center gap-1.5">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving your choice…
          </p>
        )}

        {active && (
          <div className={`rounded-2xl border p-5 md:p-6 ${active.accent}`}>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-lg font-bold text-secondary">{active.headline}</h4>
                <p className="text-sm text-secondary/80 mt-1 leading-relaxed">
                  {active.body}
                </p>

                {active.extras && (
                  <ul className="mt-4 space-y-2">
                    {active.extras.map((x) => (
                      <li key={x} className="flex items-start gap-2 text-sm text-secondary/85">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                        <span>{x}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  {active.cta.href.startsWith("#") ? (
                    <a
                      href={active.cta.href}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold shadow-card hover:bg-primary/90 transition-colors"
                    >
                      <active.cta.icon className="h-4 w-4" />
                      {active.cta.label}
                    </a>
                  ) : (
                    <Link
                      to={buildHref(active.cta.href)}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold shadow-card hover:bg-primary/90 transition-colors"
                    >
                      <active.cta.icon className="h-4 w-4" />
                      {active.cta.label}
                    </Link>
                  )}
                  {active.secondary && (
                    <Link
                      to={buildHref(active.secondary.href)}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      {active.secondary.label} →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {active?.showPricing && (
          <div id="inline-pricing">
            <InlinePricingAccordion defaultOpen={active.pricingDefaultOpen} />
          </div>
        )}
      </div>
    </section>
  );
}