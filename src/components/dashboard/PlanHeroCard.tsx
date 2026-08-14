import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Pencil, Sparkles } from "lucide-react";
import type { DashboardPlan } from "@/hooks/useDashboardData";

interface Props {
  plan: DashboardPlan | null;
  firstName?: string | null;
  taskCount?: number;
  taskDoneCount?: number;
}

function formatDate(iso: string | null | undefined) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export default function PlanHeroCard({ plan, firstName, taskCount = 0, taskDoneCount = 0 }: Props) {
  if (!plan) {
    return (
      <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="p-6 sm:p-8 text-center space-y-4">
          <h2 className="text-xl font-semibold text-secondary">Finish your intake to unlock your plan</h2>
          <p className="text-muted-foreground text-sm">
            You're one step away. Complete the 5-minute Needs Analysis and we'll generate your personalized plan.
          </p>
          <Link to="/intake" className="mt-6 inline-block">
            <Button size="lg" className="rounded-full">
              Complete My Intake <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const pct = taskCount > 0 ? Math.round((taskDoneCount / taskCount) * 100) : 0;

  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/5 via-background to-transparent overflow-hidden">
      <CardContent className="p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1 min-w-0">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary mb-2">
              <Sparkles className="h-3.5 w-3.5" /> Your personalized plan
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-secondary leading-tight">
              {firstName ? `${firstName}'s ` : ""}RE Pro Business Credit Plan
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              Generated {formatDate(plan.created_at)}
              {plan.updated_at && plan.updated_at !== plan.created_at ? ` · Updated ${formatDate(plan.updated_at)}` : ""}
              {taskCount > 0 ? ` · ${pct}% complete` : ""}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            <Link to={`/portal/plan/${plan.id}`} className="w-full sm:w-auto">
              <Button size="lg" className="rounded-full w-full sm:w-auto min-w-[180px]">
                <FileText className="h-4 w-4 mr-2" /> View Your Plan
              </Button>
            </Link>
            <Link to={`/portal/plan/${plan.id}?edit=1`} className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="rounded-full w-full sm:w-auto min-w-[180px]">
                <Pencil className="h-4 w-4 mr-2" /> Edit Your Plan
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}