import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calculator, ArrowRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { postFunnelEvent } from "@/lib/logFunnelEvent";
import { useContactIdentity } from "@/hooks/useContactIdentity";

const fmt = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

interface Props {
  guideLink?: string;
}

/**
 * Cash-flow gap calculator.
 * Inputs: monthly business spend on personal cards + average days between closings.
 * Outputs: estimated personal-card balance carried, utilization impact on a $20k personal limit,
 * and approximate annual interest cost at 24% APR.
 */
const CashFlowCalculator = ({ guideLink = "/guide" }: Props) => {
  const { contactId } = useContactIdentity();
  const [monthlySpend, setMonthlySpend] = useState<number>(2500);
  const [daysBetween, setDaysBetween] = useState<number>(45);
  const [personalLimit, setPersonalLimit] = useState<number>(20000);
  const [logged, setLogged] = useState(false);

  const result = useMemo(() => {
    const cycleMonths = Math.max(daysBetween, 7) / 30;
    const carried = monthlySpend * cycleMonths;
    const utilization = personalLimit > 0 ? Math.min(100, (carried / personalLimit) * 100) : 0;
    const annualInterest = carried * 0.24;
    return { carried, utilization, annualInterest };
  }, [monthlySpend, daysBetween, personalLimit]);

  const handleEngage = () => {
    if (logged) return;
    setLogged(true);
    void postFunnelEvent({
      contactId: contactId || undefined,
      eventType: "cash_flow_calculator_used",
      metadata: {
        monthly_spend: monthlySpend,
        days_between: daysBetween,
        personal_limit: personalLimit,
        utilization_pct: Math.round(result.utilization),
      },
    }).catch(() => {});
  };

  const utilizationTone =
    result.utilization >= 50
      ? "text-destructive"
      : result.utilization >= 30
        ? "text-[hsl(var(--warning,38_92%_50%))]"
        : "text-primary";

  return (
    <section id="cash-flow-calculator" className="bg-background py-16 md:py-24 scroll-mt-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 mb-4">
            <Calculator className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium text-primary">Cash-Flow Gap Calculator</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-3">
            How much "money when you need it" are you losing to personal credit?
          </h2>
          <p className="text-muted-foreground">
            A 30-second estimate. No signup, no email — just clarity on the gap between
            closings and what it's quietly costing you.
          </p>
        </div>

        <Card className="max-w-3xl mx-auto border-border/60 shadow-sm">
          <CardContent className="p-6 md:p-8">
            <div className="grid md:grid-cols-3 gap-5">
              <div className="space-y-2">
                <Label htmlFor="cf-spend">Monthly business spend</Label>
                <Input
                  id="cf-spend"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={monthlySpend}
                  onChange={(e) => {
                    setMonthlySpend(Math.max(0, Number(e.target.value) || 0));
                    handleEngage();
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  Marketing, tech, staging, gas, CRM, etc.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cf-days">Avg days between closings</Label>
                <Input
                  id="cf-days"
                  type="number"
                  inputMode="numeric"
                  min={7}
                  value={daysBetween}
                  onChange={(e) => {
                    setDaysBetween(Math.max(7, Number(e.target.value) || 0));
                    handleEngage();
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  How long between commission deposits.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cf-limit">Personal card limit</Label>
                <Input
                  id="cf-limit"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={personalLimit}
                  onChange={(e) => {
                    setPersonalLimit(Math.max(0, Number(e.target.value) || 0));
                    handleEngage();
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  Total limit across personal cards used for business.
                </p>
              </div>
            </div>

            <div className="mt-8 grid md:grid-cols-3 gap-4">
              <div className="bg-muted/50 rounded-lg p-5 text-center">
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                  Avg balance carried
                </p>
                <p className="text-2xl font-bold text-secondary">{fmt(result.carried)}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-5 text-center">
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                  Personal-card utilization
                </p>
                <p className={`text-2xl font-bold ${utilizationTone}`}>
                  {Math.round(result.utilization)}%
                </p>
              </div>
              <div className="bg-muted/50 rounded-lg p-5 text-center">
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                  ~Annual interest @ 24% APR
                </p>
                <p className="text-2xl font-bold text-secondary">{fmt(result.annualInterest)}</p>
              </div>
            </div>

            {result.utilization >= 30 && (
              <p className="mt-6 text-sm text-muted-foreground text-center">
                Personal-card utilization above ~30% commonly drags personal FICO scores —
                which can affect mortgage, auto, and personal loan terms.
              </p>
            )}

            {/* Bar comparison: personal-card cost vs business-credit alternative */}
            <div className="mt-8 bg-card border border-border rounded-xl p-5">
              <p className="text-sm font-semibold text-secondary text-center mb-4">
                What the same overhead costs on personal vs. business credit
              </p>
              <svg viewBox="0 0 400 130" className="w-full h-auto" role="img" aria-label="Cost comparison bar chart">
                {/* Personal credit bar */}
                <text x="10" y="22" fontSize="11" fill="hsl(var(--muted-foreground))">Personal credit</text>
                <rect x="10" y="30" width="380" height="22" rx="4" fill="hsl(var(--muted))" />
                <rect x="10" y="30" width="320" height="22" rx="4" fill="hsl(var(--destructive))" opacity="0.85" />
                <text x="335" y="46" fontSize="11" fill="white" fontWeight="bold">High cost + FICO hit</text>
                {/* Business credit bar */}
                <text x="10" y="78" fontSize="11" fill="hsl(var(--muted-foreground))">Business credit</text>
                <rect x="10" y="86" width="380" height="22" rx="4" fill="hsl(var(--muted))" />
                <rect x="10" y="86" width="120" height="22" rx="4" fill="hsl(var(--primary))" opacity="0.9" />
                <text x="135" y="102" fontSize="11" fill="hsl(var(--secondary))" fontWeight="bold">Lower cost · separate score</text>
              </svg>
              <p className="mt-3 text-xs text-muted-foreground text-center italic">
                Illustrative. Actual savings depend on rates, limits, and how quickly you season your business profile.
              </p>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" onClick={handleEngage}>
                <Link to={guideLink}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  Read the Free Guide
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" onClick={handleEngage}>
                <Link to="/one-on-one">
                  Book a Free Session
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <p className="mt-4 text-xs text-muted-foreground text-center">
              Estimates only. Actual interest, utilization impact, and credit outcomes depend on
              your specific accounts, statements, and reporting cycles.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CashFlowCalculator;