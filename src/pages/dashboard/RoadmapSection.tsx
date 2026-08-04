import RoadmapChecklist from "@/components/dashboard/RoadmapChecklist";
import ProgressSummary from "@/components/dashboard/ProgressSummary";
import EmptyPlanNotice from "./EmptyPlanNotice";
import SectionHeader from "./SectionHeader";
import { useDashboardCtx } from "./DashboardLayout";

export default function RoadmapSection() {
  const { plan, roadmap } = useDashboardCtx();
  if (!plan) return <EmptyPlanNotice />;

  return (
    <>
      <SectionHeader
        title="Credit Roadmap"
        subtitle={`${roadmap.metrics.completed} of ${roadmap.metrics.total} steps complete`}
        blurb="Foundation through funding — the structural steps that make your business fundable."
      />
      <ProgressSummary metrics={roadmap.metrics} planId={plan.id} />
      <RoadmapChecklist
        tasks={roadmap.tasks}
        savingKey={roadmap.savingKey}
        onStatusChange={roadmap.setTaskStatus}
        planId={plan.id}
      />
    </>
  );
}