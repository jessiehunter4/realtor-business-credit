import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { PRICING_TIERS } from "@/data/pricingTiers";

interface Props {
  defaultOpen?: string;
  headline?: string;
  subhead?: string;
}

export default function InlinePricingAccordion({
  defaultOpen,
  headline = "See pricing",
  subhead = "Three tiers — pick the level of support that fits how you like to work.",
}: Props) {
  return (
    <div className="rounded-2xl border border-border bg-white p-5 md:p-6 shadow-card">
      <div className="mb-4">
        <h4 className="text-base font-semibold text-secondary">{headline}</h4>
        <p className="text-sm text-secondary/65 mt-0.5">{subhead}</p>
      </div>
      <Accordion type="single" collapsible defaultValue={defaultOpen}>
        {PRICING_TIERS.map((tier) => {
          const Icon = tier.icon;
          return (
            <AccordionItem key={tier.id} value={tier.id}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3 flex-1 text-left">
                  <div
                    className={
                      "h-9 w-9 rounded-full flex items-center justify-center shrink-0 " +
                      (tier.highlighted
                        ? "bg-primary text-primary-foreground"
                        : "bg-primary/10 text-primary")
                    }
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-secondary text-sm">
                        {tier.name}
                      </span>
                      {tier.highlighted && (
                        <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary">
                          Most popular
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-secondary/60 mt-0.5">
                      <span className="font-semibold text-secondary/85">{tier.price}</span> · {tier.cadence}
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pl-12 pr-2 pt-1 pb-2 space-y-3">
                  {tier.cadenceNote && (
                    <p className="text-xs text-secondary/60 italic">{tier.cadenceNote}</p>
                  )}
                  <p className="text-sm text-secondary/80">{tier.who}</p>
                  <ul className="space-y-1.5">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-secondary/85">
                        <Check className="mt-0.5 h-4 w-4 text-primary shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <a
                      href={tier.ctaHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={
                        "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors " +
                        (tier.highlighted
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "border border-secondary/20 bg-white text-secondary hover:bg-secondary/5")
                      }
                    >
                      {tier.ctaLabel}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                    <Link
                      to="/pricing"
                      className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                    >
                      Compare all plans →
                    </Link>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}