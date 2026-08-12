import { CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import PlanItemRow from "@/components/dashboard/PlanItemRow";
import AddPlanItemForm from "@/components/dashboard/AddPlanItemForm";
import HelpBubble from "@/components/dashboard/HelpBubble";
import EmptyPlanNotice from "./EmptyPlanNotice";
import SectionHeader from "./SectionHeader";
import { countDone, pct } from "@/lib/planItems";
import { useDashboardCtx } from "./DashboardLayout";

export default function MilestonesSection() {
  const { plan, planItems } = useDashboardCtx();
  const { milestones, setStatus, updateItem, addItem, removeItem, revertItem, savingKey } = planItems;

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
        <p className="text-sm text-muted-foreground">
          No long-term milestones were generated for your plan yet — add your own below.
        </p>
      ) : (
        <ol className="relative space-y-6 pt-2">
          {milestones.map((m) => {
            const done = m.status === "completed";
            return (
              <li key={m.key} className="relative grid grid-cols-[24px_1fr] gap-3">
                <div className="relative flex justify-center">
                  <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-border" />
                  <span className="relative z-10 flex h-5 w-5 items-center justify-center rounded-full bg-background self-start mt-0.5">
                    {done ? (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary">{m.meta}</p>
                    {m.custom && <span className="text-[10px] text-muted-foreground">added by you</span>}
                    {m.edited && !m.custom && <span className="text-[10px] text-muted-foreground">edited</span>}
                    <HelpBubble
                      title="This milestone"
                      sections={[
                        { label: "What this means", body: "A checkpoint your plan expects around this month, based on how business credit files actually mature." },
                        { label: "If you're behind", body: "Timelines shift — usually because a tradeline isn't reporting yet. Go back to the roadmap and confirm the reporting steps are truly done." },
                      ]}
                    />
                  </div>
                  <PlanItemRow
                    item={m}
                    saving={savingKey === m.key}
                    onStatusChange={setStatus}
                    onUpdate={updateItem}
                    onRemove={removeItem}
                    onRevert={revertItem}
                    metaLabel="Target month (e.g. Month 6)"
                    labels={{ start: "Working on it", done: "Mark reached", undo: "Undo" }}
                  />
                </div>
              </li>
            );
          })}
        </ol>
      )}

      <AddPlanItemForm
        group="milestone"
        addLabel="Add a milestone"
        titlePlaceholder="What milestone do you want to hit?"
        metaPlaceholder="Target month (e.g. Month 6)"
        onAdd={addItem}
      />
    </>
  );
}