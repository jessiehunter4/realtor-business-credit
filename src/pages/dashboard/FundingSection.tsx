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

const BADGE_CLASS: Record<string, string> = {
  not_started: "border border-border bg-muted text-muted-foreground",
  in_progress: "bg-primary text-primary-foreground hover:bg-primary/90",
  completed: "bg-success-green text-success-green-foreground hover:bg-success-green-hover",
};

const ACTIVE_BTN_CLASS: Record<string, string> = {
  not_started: "bg-secondary text-secondary-foreground hover:bg-secondary/90 border border-transparent",
  in_progress: "bg-primary text-primary-foreground hover:bg-primary/90 border border-transparent",
  completed: "bg-success-green text-success-green-foreground hover:bg-success-green-hover border border-transparent",
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
        <div className="grid gap-3 sm:grid-cols-2 items-stretch">
          {funding.map((f) => (
          <Card
            key={f.key}
            className={`h-full flex flex-col ${f.status === "completed" ? "border-primary/40 bg-primary/5" : ""}`}
          >
              <CardContent className="p-4 space-y-2 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0 flex-1">
                    <h2 className="font-semibold text-secondary text-left">{f.title}</h2>
                    <HelpBubble
                      title={f.title}
                      sections={[
                        { label: "What this is", body: f.detail || "A funding option your plan flagged as a possible fit." },
                        { label: "Before you apply", body: "Applications leave inquiries. Make sure the structure and reporting steps behind this option are finished first — that's what changes the answer." },
                      ]}
                    />
                  </div>
                  <Badge
                    variant="outline"
                    aria-label={`Status: ${STATUS_LABEL[f.status]}`}
                    className={`text-[10px] shrink-0 self-start ${BADGE_CLASS[f.status]}`}
                  >
                    {STATUS_LABEL[f.status]}
                  </Badge>
                </div>
                {f.detail && <p className="text-sm text-secondary/80 text-left">{f.detail}</p>}
                <div className="grid grid-cols-3 gap-2 pt-2 mt-auto">
                  {(["not_started", "in_progress", "completed"] as const).map((s) => (
                    <Button
                      key={s}
                      size="sm"
                      variant={f.status === s ? "default" : "outline"}
                      aria-pressed={f.status === s}
                      className={`w-full h-9 rounded-full text-xs font-medium ${
                        f.status === s ? ACTIVE_BTN_CLASS[s] : "hover:bg-muted text-muted-foreground hover:text-foreground"
                      }`}
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

      <p className="text-xs text-secondary/70">
        This is education and coaching, not legal, tax, or financial advice. Check with your broker, attorney, and tax
        professional for your situation.
      </p>
    </>
  );
}