import { CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import HelpBubble from "@/components/dashboard/HelpBubble";
import EmptyPlanNotice from "./EmptyPlanNotice";
import SectionHeader from "./SectionHeader";
import { countDone, pct } from "@/lib/planItems";
import { useDashboardCtx } from "./DashboardLayout";

export default function MilestonesSection() {
  const { plan, planItems } = useDashboardCtx();
  const { milestones, setStatus, savingKey } = planItems;

  if (!plan) return <EmptyPlanNotice />;

  return (
    <>
      <SectionHeader
        title="6–12 Month Roadmap"
        subtitle={`${countDone(milestones)} of ${milestones.length} reached`}
        blurb="Where your plan expects you to be as the profile matures. Check each one off as you hit it."
      />
      <Progress value={pct(milestones)} className="h-2" />

      {milestones.length === 0 ? (
        <p className="text-sm text-muted-foreground">No long-term milestones were generated for your plan yet.</p>
      ) : (
        <ol className="relative border-l border-border ml-3 space-y-5 pt-2">
          {milestones.map((m) => {
            const done = m.status === "completed";
            return (
              <li key={m.key} className="ml-6">
                <span className="absolute -left-[11px] flex h-5 w-5 items-center justify-center rounded-full bg-background">
                  {done ? (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">{m.meta}</p>
                  <HelpBubble
                    title="This milestone"
                    sections={[
                      { label: "What this means", body: "A checkpoint your plan expects around this month, based on how business credit files actually mature." },
                      { label: "If you're behind", body: "Timelines shift — usually because a tradeline isn't reporting yet. Go back to the roadmap and confirm the reporting steps are truly done." },
                    ]}
                  />
                </div>
                <p className={`mt-0.5 ${done ? "text-muted-foreground line-through" : "text-secondary font-medium"}`}>
                  {m.title}
                </p>
                <Button
                  variant={done ? "ghost" : "outline"}
                  size="sm"
                  className="rounded-full text-xs mt-2"
                  disabled={savingKey === m.key}
                  onClick={() => setStatus(m, done ? "not_started" : "completed")}
                >
                  {done ? "Undo" : "Mark reached"}
                </Button>
              </li>
            );
          })}
        </ol>
      )}
    </>
  );
}