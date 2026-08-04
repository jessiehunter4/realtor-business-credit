import PlanItemRow from "@/components/dashboard/PlanItemRow";
import AddPlanItemForm from "@/components/dashboard/AddPlanItemForm";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import EmptyPlanNotice from "./EmptyPlanNotice";
import SectionHeader from "./SectionHeader";
import { countDone, pct } from "@/lib/planItems";
import { useDashboardCtx } from "./DashboardLayout";

const WINDOWS = ["Days 1–30", "Days 31–60", "Days 61–90"];

export default function ActionPlanSection() {
  const { plan, planItems } = useDashboardCtx();
  const { actions, setStatus, updateItem, addItem, removeItem, revertItem, savingKey } = planItems;

  if (!plan) return <EmptyPlanNotice />;

  return (
    <>
      <SectionHeader
        title="90-Day Action Plan"
        subtitle={`${countDone(actions)} of ${actions.length} done`}
        blurb="The first 90 days of your plan, in order. Work top down — later steps assume the earlier ones are in place."
      />

      <Progress value={pct(actions)} className="h-2" />

      {actions.length === 0 ? (
        <p className="text-sm text-muted-foreground">No 90-day items were generated for your plan yet.</p>
      ) : (
        WINDOWS.map((w) => {
          const inWindow = actions.filter((a) =>
            a.meta?.startsWith(w) || (w === WINDOWS[0] && !WINDOWS.some((x) => a.meta?.startsWith(x))),
          );
          if (inWindow.length === 0) return null;
          return (
            <Card key={w}>
              <CardContent className="p-4 sm:p-5 space-y-2">
                <div className="flex items-baseline gap-2">
                  <h2 className="font-semibold text-secondary">{w}</h2>
                  <span className="text-xs text-muted-foreground">
                    {countDone(inWindow)}/{inWindow.length}
                  </span>
                </div>
                {inWindow.map((item) => (
                  <PlanItemRow
                    key={item.key}
                    item={item}
                    saving={savingKey === item.key}
                    onStatusChange={setStatus}
                    onUpdate={updateItem}
                    onRemove={removeItem}
                    onRevert={revertItem}
                    metaLabel="Window and effort (e.g. Days 1–30 · 1 hour)"
                    help={{
                      title: "This action step",
                      sections: [
                        { label: "What this means", body: "A specific task pulled from your custom plan, sized to fit inside the first 90 days." },
                        { label: "Why it matters", body: "The 90-day items are the ones that unlock everything after them — bureau files, tradelines, and eventually funding." },
                        { label: "Done looks like", body: "The step is fully finished and documented, not just started. If you're mid-way, use 'Start' instead." },
                      ],
                    }}
                  />
                ))}
              </CardContent>
            </Card>
          );
        })
      )}

      <AddPlanItemForm
        group="d90"
        addLabel="Add a step"
        titlePlaceholder="What step do you want to add?"
        metaOptions={WINDOWS}
        onAdd={addItem}
      />
    </>
  );
}