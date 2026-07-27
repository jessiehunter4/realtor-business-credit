import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { LogOut, PlayCircle, Loader2, CheckCircle2, Circle, TrendingUp, Calendar } from "lucide-react";
import SiteHeader from "@/components/shared/SiteHeader";
import SiteFooter from "@/components/shared/SiteFooter";
import Seo from "@/components/shared/Seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useDashboardData } from "@/hooks/useDashboardData";
import PlanHeroCard from "@/components/dashboard/PlanHeroCard";
import WelcomeDialog from "@/components/dashboard/WelcomeDialog";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { session, profile, plan, tasks, loading } = useDashboardData();
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const [markFirst, setMarkFirst] = useState(false);

  const firstName = profile?.first_name || session?.user.user_metadata?.first_name || "";
  const doneCount = tasks.filter((t) => t.completed).length;
  const pct = tasks.length > 0 ? Math.round((doneCount / tasks.length) * 100) : 0;
  const nextTask = useMemo(() => tasks.find((t) => !t.completed) ?? null, [tasks]);

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
          taskCount={tasks.length}
          taskDoneCount={doneCount}
        />

        {/* KPI strip */}
        {plan && (
          <div className="grid gap-3 grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4" /> 90-Day Plan
                </div>
                <div className="mt-2 text-2xl font-bold text-secondary">{doneCount}/{tasks.length || "—"}</div>
                <Progress value={pct} className="h-1.5 mt-2" />
                <div className="text-xs text-muted-foreground mt-1">{pct}% complete</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                  <TrendingUp className="h-4 w-4" /> Recommended Program
                </div>
                <div className="mt-2 text-lg font-semibold text-secondary capitalize">
                  {plan.recommended_program_slug?.replace(/-/g, " ") || "Review with coach"}
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-2 lg:col-span-1">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                  <Calendar className="h-4 w-4" /> Next 1:1
                </div>
                <div className="mt-2 text-lg font-semibold text-secondary">Book your session</div>
                <Link to="/one-on-one" className="text-xs text-primary hover:underline">Schedule now →</Link>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Next action */}
        {plan && nextTask && (
          <Card>
            <CardContent className="p-5 sm:p-6">
              <div className="text-xs uppercase tracking-wide font-semibold text-primary mb-1">Next action</div>
              <div className="flex items-start gap-3">
                <Circle className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-secondary font-medium">{nextTask.task_label || nextTask.task_key}</p>
                </div>
                <Link to={`/portal/plan/${plan.id}?tab=checklist`}>
                  <Button variant="outline" size="sm" className="rounded-full">Open checklist</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
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