import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink, Lock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PRICING_TIERS } from "@/data/pricingTiers";
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

  return (
    <>
      <SectionHeader
        title="My Program"
        subtitle={tier.program ? "Cohort access active" : tier.diy ? "DIY plan active" : "Free plan"}
        blurb="Where you are today, and what the next level of support adds."
      />

      {nextSteps?.narrative && (
        <Card>
          <CardContent className="p-4 sm:p-5">
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{nextSteps.narrative}</p>
          </CardContent>
        </Card>
      )}

      <Card className={tier.program ? "border-primary/40 bg-primary/5" : "border-border"}>
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center gap-2 font-semibold text-secondary">
            {tier.program ? <Users className="h-4 w-4 text-primary" /> : <Lock className="h-4 w-4 text-muted-foreground" />}
            Credit Suite / Lendavo platforms
          </div>
          {tier.program ? (
            <>
              <p className="text-sm text-muted-foreground">
                Your cohort enrollment includes the implementation platforms. Launch them here — your RE Pro plan stays
                your source of truth for goals and progress.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {PLATFORMS.map((p) => (
                  <div key={p.name} className="rounded-lg border border-border bg-card p-3">
                    <p className="font-medium text-secondary text-sm">{p.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{p.blurb}</p>
                    <a href={p.href} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" className="rounded-full text-xs mt-2">
                        Launch <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    </a>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Pro Cohort and Cohort Plus + transition you onto the Credit Suite and Lendavo platforms, with a dedicated
                specialist and the funding directory. You'll launch both from right here once you're enrolled.
              </p>
              <Link to="/pricing">
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
        <div className="grid gap-3 sm:grid-cols-2">
          {PRICING_TIERS.map((t) => {
            const active =
              (t.id === "free" && !tier.diy) ||
              (t.id === "self-paced" && tier.diy && !tier.program) ||
              ((t.id === "cohort" || t.id === "one-on-one") && tier.program);
            return (
              <Card key={t.id} className={active ? "border-primary/50" : ""}>
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <t.icon className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold text-secondary">{t.name}</h3>
                    <span className="text-sm text-muted-foreground">{t.price}</span>
                    {active && <Badge className="text-[10px]">Your plan</Badge>}
                    {recommended === t.id && <Badge variant="secondary" className="text-[10px]">Recommended</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground">{t.who}</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {t.features.slice(0, 4).map((f) => (
                      <li key={f}>· {f}</li>
                    ))}
                  </ul>
                  {!active && (
                    <Link to={t.ctaHref}>
                      <Button size="sm" variant="outline" className="rounded-full text-xs">
                        {t.ctaLabel}
                      </Button>
                    </Link>
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