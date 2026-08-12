import { Card, CardContent } from "@/components/ui/card";
import PlanItemRow from "@/components/dashboard/PlanItemRow";
import AddPlanItemForm from "@/components/dashboard/AddPlanItemForm";
import EmptyPlanNotice from "./EmptyPlanNotice";
import SectionHeader from "./SectionHeader";
import { countDone } from "@/lib/planItems";
import { useDashboardCtx } from "./DashboardLayout";

export default function GoalsSection() {
  const { plan, planItems } = useDashboardCtx();
  const { goals, setStatus, setNote, updateItem, addItem, removeItem, revertItem, savingKey } = planItems;

  if (!plan) return <EmptyPlanNotice />;

  const narrative = plan.plan_data?.sections?.goals_snapshot?.narrative ?? "";

  // The generator tags each goal's meta with "primary goal" / "secondary goal".
  const isPrimary = (meta?: string) => !!meta && meta.toLowerCase().startsWith("primary goal");
  const cleanMeta = (meta?: string) =>
    meta
      ? meta.replace(/^(primary|secondary) goal\s*(·\s*)?/i, "").trim() || undefined
      : undefined;

  const primaryGoals = goals.filter((g) => isPrimary(g.meta));
  const secondaryGoals = goals.filter((g) => !isPrimary(g.meta));

  const help = {
    title: "Tracking a goal",
    sections: [
      { label: "What this means", body: "This is a financial outcome you told us matters — not a task. It's the reason the roadmap steps exist." },
      { label: "How to use it", body: "Mark it 'Working on it' once you've started, and keep a short note about what's actually moving or blocking it." },
      { label: "Done looks like", body: "The number or capability you described is real — money available, expenses off personal credit, or the limit you were after." },
    ],
  };

  const renderGoal = (item: (typeof goals)[number]) => (
    <PlanItemRow
      key={item.key}
      item={{ ...item, meta: cleanMeta(item.meta) }}
      saving={savingKey === item.key}
      onStatusChange={setStatus}
      onNoteSave={setNote}
      onUpdate={updateItem}
      onRemove={removeItem}
      onRevert={revertItem}
      metaLabel="Horizon or target amount"
      labels={{ start: "Working on it", done: "Achieved", undo: "Reopen" }}
      help={help}
    />
  );

  return (
    <>
      <SectionHeader
        title="My Goals"
        subtitle={`${countDone(goals)} of ${goals.length} achieved`}
        blurb="These came from your Needs Analysis — including any goals you typed in yourself. Track where each one stands and add more any time."
      />

      {narrative && (
        <Card className="border-l-4 border-l-primary bg-muted/50 shadow-none">
          <CardContent className="p-4 sm:p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Your plan summary
            </p>
            <p className="text-sm text-secondary leading-relaxed whitespace-pre-wrap">{narrative}</p>
          </CardContent>
        </Card>
      )}

      {goals.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Your plan didn't capture individual goals — add your own below, or your coach can add them on your next review.
        </p>
      )}

      {primaryGoals.length > 0 && (
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-primary mb-1">Top priority</p>
          {primaryGoals.map(renderGoal)}
        </div>
      )}

      {secondaryGoals.length > 0 && (
        <div className="space-y-2">
          {primaryGoals.length > 0 && (
            <p className="pt-6 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">
              Also working toward
            </p>
          )}
          {secondaryGoals.map(renderGoal)}
        </div>
      )}

      <AddPlanItemForm
        group="goal"
        addLabel="Add a goal"
        titlePlaceholder="What do you want to achieve?"
        metaPlaceholder="Horizon or target amount (optional)"
        onAdd={addItem}
      />
    </>
  );
}