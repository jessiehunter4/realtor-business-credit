import { Card, CardContent } from "@/components/ui/card";
import PlanItemRow from "@/components/dashboard/PlanItemRow";
import EmptyPlanNotice from "./EmptyPlanNotice";
import SectionHeader from "./SectionHeader";
import { countDone } from "@/lib/planItems";
import { useDashboardCtx } from "./DashboardLayout";

export default function GoalsSection() {
  const { plan, planItems } = useDashboardCtx();
  const { goals, setStatus, setNote, savingKey } = planItems;

  if (!plan) return <EmptyPlanNotice />;

  const narrative = plan.plan_data?.sections?.goals_snapshot?.narrative ?? "";

  return (
    <>
      <SectionHeader
        title="My Goals"
        subtitle={`${countDone(goals)} of ${goals.length} achieved`}
        blurb="These came from your Needs Analysis. Track where each one stands and keep notes as things change."
      />

      {narrative && (
        <Card>
          <CardContent className="p-4 sm:p-5">
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{narrative}</p>
          </CardContent>
        </Card>
      )}

      {goals.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Your plan didn't capture individual goals. Your coach can add them on your next review.
        </p>
      ) : (
        <div className="space-y-2">
          {goals.map((item) => (
            <PlanItemRow
              key={item.key}
              item={item}
              saving={savingKey === item.key}
              onStatusChange={setStatus}
              onNoteSave={setNote}
              labels={{ start: "Working on it", done: "Achieved", undo: "Reopen" }}
              help={{
                title: "Tracking a goal",
                sections: [
                  { label: "What this means", body: "This is a financial outcome you told us matters — not a task. It's the reason the roadmap steps exist." },
                  { label: "How to use it", body: "Mark it 'Working on it' once you've started, and keep a short note about what's actually moving or blocking it." },
                  { label: "Done looks like", body: "The number or capability you described is real — money available, expenses off personal credit, or the limit you were after." },
                ],
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}