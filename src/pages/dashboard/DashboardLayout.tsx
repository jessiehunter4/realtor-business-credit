import { createContext, useContext, useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useNavigate, useSearchParams } from "react-router-dom";
import {
  BookOpen,
  Calendar,
  Compass,
  Flag,
  LayoutDashboard,
  Loader2,
  LogOut,
  PlayCircle,
  Target,
  Wallet,
  Wrench,
} from "lucide-react";
import SiteHeader from "@/components/shared/SiteHeader";
import Seo from "@/components/shared/Seo";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useToast } from "@/hooks/use-toast";
import { useRoadmap } from "@/hooks/useRoadmap";
import { usePlanItems } from "@/hooks/usePlanItems";
import { useEntitlements } from "@/hooks/useEntitlements";
import { buildEntitlementState, type EntitlementState } from "@/lib/entitlementTiers";
import { logRoadmapEvent } from "@/lib/roadmap";
import { signOutAndClear } from "@/lib/signOut";
import { cn } from "@/lib/utils";
import WelcomeDialog from "@/components/dashboard/WelcomeDialog";

type Ctx = ReturnType<typeof useDashboardData> & {
  roadmap: ReturnType<typeof useRoadmap>;
  planItems: ReturnType<typeof usePlanItems>;
  tier: EntitlementState;
  firstName: string;
};

const DashboardCtx = createContext<Ctx | null>(null);

export function useDashboardCtx() {
  const ctx = useContext(DashboardCtx);
  if (!ctx) throw new Error("useDashboardCtx must be used inside the dashboard layout");
  return ctx;
}

const NAV = [
  { to: "/dashboard", end: true, label: "Overview", icon: LayoutDashboard },
  { to: "/dashboard/goals", label: "My Goals", icon: Target },
  { to: "/dashboard/90-day", label: "90-Day Plan", icon: Flag },
  { to: "/dashboard/roadmap", label: "Credit Roadmap", icon: Compass },
  { to: "/dashboard/milestones", label: "6–12 Month", icon: Calendar },
  { to: "/dashboard/funding", label: "Funding", icon: Wallet },
  { to: "/dashboard/resources", label: "Resources", icon: Wrench },
  { to: "/dashboard/program", label: "My Program", icon: BookOpen },
];

export default function DashboardLayout() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const data = useDashboardData();
  const { session, profile, plan, tasks: progressRows, survey, loading } = data;
  const { hasProduct, loading: entLoading } = useEntitlements();
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const [markFirst, setMarkFirst] = useState(false);
  const viewLogged = useRef(false);
  const planExistsToasted = useRef(false);
  const { toast } = useToast();

  // Shown once when a returning user is redirected away from the intake flow.
  useEffect(() => {
    if (searchParams.get("planExists") !== "1" || planExistsToasted.current) return;
    planExistsToasted.current = true;
    toast({
      title: "You already have a plan",
      description:
        "We've brought you to your dashboard where you can view your customized plan and continue your progress.",
    });
    const next = new URLSearchParams(searchParams);
    next.delete("planExists");
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams, toast]);

  const firstName = profile?.first_name || session?.user.user_metadata?.first_name || "";

  const roadmap = useRoadmap({
    planId: plan?.id,
    planData: plan?.plan_data,
    survey,
    progress: progressRows,
    ready: !loading,
  });

  const planItems = usePlanItems({
    planId: plan?.id,
    planData: plan?.plan_data,
    progress: progressRows,
    refresh: data.refresh,
  });

  const tier = buildEntitlementState(hasProduct, !entLoading);

  useEffect(() => {
    if (loading || !plan?.id || viewLogged.current) return;
    viewLogged.current = true;
    logRoadmapEvent("dashboard_viewed", {
      planId: plan.id,
      nextTask: roadmap.priorityTask,
      completionPct: roadmap.metrics.overallPct,
    });
  }, [loading, plan?.id, roadmap.priorityTask, roadmap.metrics.overallPct]);

  useEffect(() => {
    if (loading || !profile) return;
    if (!profile.onboarding_completed_at) {
      setMarkFirst(true);
      setWelcomeOpen(true);
    }
    if (searchParams.get("firstLogin") === "1") {
      const next = new URLSearchParams(searchParams);
      next.delete("firstLogin");
      setSearchParams(next, { replace: true });
    }
  }, [loading, profile, searchParams, setSearchParams]);

  const handleLogout = async () => {
    await signOutAndClear({ redirectTo: "/" });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const ctx: Ctx = { ...data, roadmap, planItems, tier, firstName };

  return (
    <DashboardCtx.Provider value={ctx}>
      <Seo
        title="Your Dashboard — RE Pro Business Credit"
        description="Your personalized RE Pro Business Credit plan, progress, and next steps."
        noindex
      />
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <Sidebar collapsible="icon">
            <SidebarContent>
              <SidebarGroup className="mt-2">
                <SidebarGroupLabel className="uppercase tracking-wider text-xs text-sidebar-foreground/60 mb-2">
                  Your plan
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu className="gap-1.5">
                    {NAV.map((item) => (
                      <SidebarMenuItem key={item.to}>
                        <SidebarMenuButton asChild tooltip={item.label} size="lg">
                          <NavLink
                            to={item.to}
                            end={item.end}
                            className={({ isActive }) =>
                              cn(
                                "flex items-center gap-3 rounded-md border-l-4 border-transparent transition-colors",
                                isActive
                                  ? "bg-primary/10 text-primary border-l-primary font-semibold"
                                  : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                              )
                            }
                          >
                            <item.icon className="h-5 w-5 shrink-0" />
                            <span className="text-base">{item.label}</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>

          <div className="flex-1 min-w-0 flex flex-col">
            <SiteHeader />
            <div className="border-b border-border bg-card/60">
              <div className="max-w-5xl mx-auto w-full px-3 sm:px-6 py-2 flex items-center gap-2">
                <SidebarTrigger />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-secondary truncate">
                    Welcome{firstName ? `, ${firstName}` : ""}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={() => { setMarkFirst(false); setWelcomeOpen(true); }}
                >
                  <PlayCircle className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Welcome video</span>
                </Button>
              </div>
            </div>

            <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
              <Outlet />
            </main>
          </div>
        </div>
      </SidebarProvider>

      <WelcomeDialog
        open={welcomeOpen}
        onOpenChange={setWelcomeOpen}
        userId={session?.user.id}
        firstName={firstName}
        markCompleted={markFirst}
      />
    </DashboardCtx.Provider>
  );
}