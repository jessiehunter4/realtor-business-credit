import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import HelpBubble from "@/components/dashboard/HelpBubble";
import EmptyPlanNotice from "./EmptyPlanNotice";
import SectionHeader from "./SectionHeader";
import { countDone } from "@/lib/planItems";
import { useDashboardCtx } from "./DashboardLayout";

const STATUS_LABEL: Record<string, string> = {
  not_started: "Not yet",
  in_progress: "Exploring",
  completed: "Obtained",
};

export default function FundingSection() {
  const { plan, planItems } = useDashboardCtx();
  const { funding, setStatus, savingKey } = planItems;

  if (!plan) return <EmptyPlanNotice />;

  return (
    <>
      <SectionHeader
        title="Credit & Funding Opportunities"
        subtitle={`${countDone(funding)} of ${funding.length} obtained`}
        blurb="Funding types matched to your profile. Educational and indicative — not an approval or a guarantee."
      />

      {funding.length === 0 ? (
        <p className="text-sm text-muted-foreground">No funding opportunities were generated for your plan yet.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {funding.map((f) => (
            <Card key={f.key} className={f.status === "completed" ? "border-primary/40 bg-primary/5" : ""}>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <h2 className="font-semibold text-secondary">{f.title}</h2>
                    <HelpBubble
                      title={f.title}
                      sections={[
                        { label: "What this is", body: f.detail || "A funding option your plan flagged as a possible fit." },
                        { label: "Before you apply", body: "Applications leave inquiries. Make sure the structure and reporting steps behind this option are finished first — that's what changes the answer." },
                      ]}
                    />
                  </div>
                  <Badge variant={f.status === "completed" ? "default" : "secondary"} className="text-[10px] shrink-0">
                    {STATUS_LABEL[f.status]}
                  </Badge>
                </div>
                {f.detail && <p className="text-sm text-muted-foreground">{f.detail}</p>}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(["not_started", "in_progress", "completed"] as const).map((s) => (
                    <Button
                      key={s}
                      size="sm"
                      variant={f.status === s ? "default" : "outline"}
                      className="rounded-full text-xs"
                      disabled={savingKey === f.key}
                      onClick={() => setStatus(f, s)}
                    >
                      {STATUS_LABEL[s]}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        This is education and coaching, not legal, tax, or financial advice. Check with your broker, attorney, and tax
        professional for your situation.
      </p>
    </>
  );
}