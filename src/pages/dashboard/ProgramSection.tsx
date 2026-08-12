import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink, Lock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PRICING_TIERS } from "@/data/pricingTiers";
import { TIER_LABELS, isUpgrade, type PaidTierId } from "@/lib/entitlementTiers";
import { cn } from "@/lib/utils";
import SectionHeader from "./SectionHeader";
import { useDashboardCtx } from "./DashboardLayout";

const PLATFORMS = [
  {
    name: "Credit Suite client portal",
    blurb: "Your business credit build-out, vendor sequencing, and dedicated Credit Suite coach.",
    href: "https://mybetterbusinesscredit.fundabilityscan.com/",
  },
  {
    name: "Lendavo funding directory",
    blurb: "Matched funding programs and lender directory once your profile is reporting.",
    href: "https://mybetterbusinesscredit.com",
  },
];

export default function ProgramSection() {
  const { plan, tier } = useDashboardCtx();
  const recommended = plan?.recommended_program_slug ?? null;
  const nextSteps = plan?.plan_data?.sections?.next_steps;
  const platformAccess = tier.capabilities.platformAccess;
  const subtitle = tier.highest ? `${TIER_LABELS[tier.highest]} active` : "Free plan";

  return (
    <>
      <SectionHeader
        title="My Program"
        subtitle={subtitle}
        blurb="Where you are today, and what the next level of support adds."
      />

      {nextSteps?.narrative && (
        <Card>
          <CardContent className="p-4 sm:p-5">
            <p className="text-sm text-secondary/80 leading-relaxed whitespace-pre-wrap">{nextSteps.narrative}</p>
          </CardContent>
        </Card>
      )}

      <Card className={platformAccess ? "border-primary/40 bg-primary/5" : "border-border"}>
        <CardContent className="p-5 space-y-3 text-center">
          <div className="flex items-center justify-center gap-2 font-semibold text-secondary">
            {platformAccess ? <Users className="h-4 w-4 text-primary" /> : <Lock className="h-4 w-4 text-muted-foreground" />}
            Credit Suite / Lendavo platforms
          </div>
          {platformAccess ? (
            <>
              <p className="text-sm text-secondary/80">
                Your cohort enrollment includes the implementation platforms. Launch them here — your RE Pro plan stays
                your source of truth for goals and progress.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {PLATFORMS.map((p) => (
                  <div key={p.name} className="flex flex-col items-center text-center rounded-lg border border-border bg-card p-4">
                    <div className="flex-1">
                      <p className="font-medium text-secondary text-sm">{p.name}</p>
                      <p className="text-xs text-secondary/80 mt-1 leading-relaxed">{p.blurb}</p>
                    </div>
                    <a href={p.href} target="_blank" rel="noopener noreferrer" className="mt-4">
                      <Button size="sm" className="rounded-full text-xs">
                        Launch <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    </a>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-secondary/80">
                Enrolling in Pro Cohort or Cohort Plus transitions you onto the Credit Suite and Lendavo platforms,
                with a specialist and the funding directory. You'll launch them from right here once you're enrolled.
              </p>
              <Link to="/pricing" className="inline-block mt-6">
                <Button className="rounded-full">
                  See cohort options <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </>
          )}
        </CardContent>
      </Card>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-secondary">Compare your options</h2>
        <div className="grid gap-3 sm:grid-cols-2 sm:grid-rows-2 items-stretch">
          {PRICING_TIERS.map((t) => {
            const active =
              t.id === "free"
                ? tier.owned.size === 0
                : tier.owned.has(t.id as PaidTierId);
            const upgrade =
              t.id !== "free" && isUpgrade(t.id as PaidTierId, tier.highest);
            return (
              <Card key={t.id} className={cn("h-full flex flex-col", active ? "border-primary/50" : "")}>
                <CardContent className="p-5 h-full text-center flex flex-col">
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    <t.icon className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold text-secondary">{t.name}</h3>
                    <span className="text-sm text-secondary/80">{t.price}</span>
                    {active && <Badge className="text-[10px]">Your plan</Badge>}
                    {recommended === t.id && <Badge variant="secondary" className="text-[10px]">Recommended</Badge>}
                  </div>
                  <p className="text-xs text-secondary/80 mt-3">{t.who}</p>
                  <ul className="text-xs text-secondary/80 space-y-1.5 pb-1 mt-3 flex-1">
                    {t.features.slice(0, 4).map((f) => (
                      <li key={f} className="leading-relaxed">· {f}</li>
                    ))}
                  </ul>
                  {!active ? (
                    <Link to={t.ctaHref} className="inline-block mt-auto pt-4">
                      <Button size="sm" variant="outline" className="rounded-full text-xs">
                        {upgrade ? `Upgrade to ${t.name}` : t.ctaLabel}
                      </Button>
                    </Link>
                  ) : (
                    <div className="mt-auto pt-4" aria-hidden="true" />
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </>
  );
}