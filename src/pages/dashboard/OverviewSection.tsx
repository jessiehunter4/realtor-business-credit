import { Link } from "react-router-dom";
import { BookOpen, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import PlanHeroCard from "@/components/dashboard/PlanHeroCard";
import PriorityTaskCard from "@/components/dashboard/PriorityTaskCard";
import ProgressSummary from "@/components/dashboard/ProgressSummary";
import MessagePreferencesCard from "@/components/dashboard/MessagePreferencesCard";
import PlanActionsBar from "@/components/dashboard/PlanActionsBar";
import { pct } from "@/lib/planItems";
import { useDashboardCtx } from "./DashboardLayout";

export default function OverviewSection() {
  const { plan, firstName, roadmap, planItems } = useDashboardCtx();
  const { metrics, priorityTask, setTaskStatus, savingKey } = roadmap;

  const strips = [
    { label: "Goals", to: "/dashboard/goals", value: pct(planItems.goals), count: planItems.goals.length },
    { label: "90-Day Plan", to: "/dashboard/90-day", value: pct(planItems.actions), count: planItems.actions.length },
    { label: "Credit Roadmap", to: "/dashboard/roadmap", value: metrics.overallPct, count: metrics.total },
    { label: "6–12 Month", to: "/dashboard/milestones", value: pct(planItems.milestones), count: planItems.milestones.length },
    { label: "Funding", to: "/dashboard/funding", value: pct(planItems.funding), count: planItems.funding.length },
  ];

  return (
    <>
      <PlanHeroCard
        plan={plan}
        firstName={firstName}
        taskCount={metrics.total}
        taskDoneCount={metrics.completed}
      />

      {plan && (
        <>
          <PlanActionsBar />

          <section aria-label="Plan sections" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {strips.map((s) => (
              <Link key={s.label} to={s.to}>
                <Card className="h-full hover:border-primary/40 transition-colors">
                  <CardContent className="p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">{s.label}</p>
                    <p className="mt-1 text-xl font-bold text-secondary">{s.value}%</p>
                    <Progress value={s.value} className="h-1.5 mt-2" />
                    <p className="text-[11px] text-muted-foreground mt-1">{s.count} items</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </section>

          <PriorityTaskCard
            task={priorityTask}
            saving={savingKey === priorityTask?.key}
            onStatusChange={setTaskStatus}
            planId={plan.id}
          />

          <ProgressSummary metrics={metrics} planId={plan.id} />

          <div className="grid gap-3 sm:grid-cols-2">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                  <TrendingUp className="h-4 w-4" /> Recommended program
                </div>
                <div className="mt-2 text-lg font-semibold text-secondary capitalize">
                  {plan.recommended_program_slug?.replace(/-/g, " ") || "Review with coach"}
                </div>
                <Link to="/dashboard/program" className="text-xs text-primary hover:underline">
                  See your program →
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                  <BookOpen className="h-4 w-4" /> Learn the why
                </div>
                <div className="mt-2 text-lg font-semibold text-secondary">The full guide</div>
                <Link to="/guide" className="text-xs text-primary hover:underline">
                  Read the guide →
                </Link>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      <MessagePreferencesCard />
    </>
  );
}