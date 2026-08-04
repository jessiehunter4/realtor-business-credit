import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { LogOut, PlayCircle, Loader2, TrendingUp, BookOpen } from "lucide-react";
import SiteHeader from "@/components/shared/SiteHeader";
import SiteFooter from "@/components/shared/SiteFooter";
import Seo from "@/components/shared/Seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useRoadmap } from "@/hooks/useRoadmap";
import { logRoadmapEvent } from "@/lib/roadmap";
import PlanHeroCard from "@/components/dashboard/PlanHeroCard";
import WelcomeDialog from "@/components/dashboard/WelcomeDialog";
import MessagePreferencesCard from "@/components/dashboard/MessagePreferencesCard";
import ProgressSummary from "@/components/dashboard/ProgressSummary";
import PriorityTaskCard from "@/components/dashboard/PriorityTaskCard";
import RoadmapChecklist from "@/components/dashboard/RoadmapChecklist";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { session, profile, plan, tasks: progressRows, survey, loading } = useDashboardData();
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const [markFirst, setMarkFirst] = useState(false);
  const viewLogged = useRef(false);

  const firstName = profile?.first_name || session?.user.user_metadata?.first_name || "";

  const { tasks, metrics, priorityTask, setTaskStatus, savingKey } = useRoadmap({
    planId: plan?.id,
    planData: plan?.plan_data,
    survey,
    progress: progressRows,
    ready: !loading,
  });

  // Log a single dashboard view per session so workflows know they're engaged.
  useEffect(() => {
    if (loading || !plan?.id || viewLogged.current) return;
    viewLogged.current = true;
    logRoadmapEvent("dashboard_viewed", {
      planId: plan.id,
      nextTask: priorityTask,
      completionPct: metrics.overallPct,
    });
  }, [loading, plan?.id, priorityTask, metrics.overallPct]);

  // First-login: open welcome dialog once (DB flag is authoritative).
  useEffect(() => {
    if (loading || !profile) return;
    const wantFirst = searchParams.get("firstLogin") === "1";
    if (!profile.onboarding_completed_at) {
      setMarkFirst(true);
      setWelcomeOpen(true);
    }
    if (wantFirst) {
      const next = new URLSearchParams(searchParams);
      next.delete("firstLogin");
      setSearchParams(next, { replace: true });
    }
  }, [loading, profile, searchParams, setSearchParams]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Seo
        title="Your Dashboard — RE Pro Business Credit"
        description="Your personalized RE Pro Business Credit plan, progress, and next steps."
        noindex
      />
      <SiteHeader />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6">
        {/* Greeting row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-secondary">
              Welcome{firstName ? `, ${firstName}` : ""}
            </h1>
            <p className="text-sm text-muted-foreground">Your plan and next steps, in one place.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => { setMarkFirst(false); setWelcomeOpen(true); }}
            >
              <PlayCircle className="h-4 w-4 mr-2" /> Welcome video
            </Button>
            <Button variant="outline" size="sm" className="rounded-full" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" /> Log out
            </Button>
          </div>
        </div>

        {/* Plan hero — primary CTA */}
        <PlanHeroCard
          plan={plan}
          firstName={firstName}
          taskCount={metrics.total}
          taskDoneCount={metrics.completed}
        />

        {plan && (
          <>
            {/* Highest-priority incomplete task */}
            <PriorityTaskCard
              task={priorityTask}
              saving={savingKey === priorityTask?.key}
              onStatusChange={setTaskStatus}
              planId={plan.id}
            />

            <ProgressSummary metrics={metrics} planId={plan.id} />

            <RoadmapChecklist
              tasks={tasks}
              savingKey={savingKey}
              onStatusChange={setTaskStatus}
              planId={plan.id}
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                    <TrendingUp className="h-4 w-4" /> Recommended program
                  </div>
                  <div className="mt-2 text-lg font-semibold text-secondary capitalize">
                    {plan.recommended_program_slug?.replace(/-/g, " ") || "Review with coach"}
                  </div>
                  <Link to="/pricing" className="text-xs text-primary hover:underline">
                    Compare options →
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
      </main>

      <SiteFooter />

      <WelcomeDialog
        open={welcomeOpen}
        onOpenChange={setWelcomeOpen}
        userId={session?.user.id}
        firstName={firstName}
        markCompleted={markFirst}
      />
    </div>
  );
}