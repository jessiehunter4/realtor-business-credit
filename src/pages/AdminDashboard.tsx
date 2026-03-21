import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Users, FileText, TrendingUp, Activity, RefreshCw } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface FunnelCount {
  event_type: string;
  count: number;
}

interface RecentEvent {
  id: string;
  event_type: string;
  ghl_contact_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

const FUNNEL_ORDER = [
  "site_visit",
  "guide_view",
  "guide_read_25",
  "guide_read_50",
  "guide_read_75",
  "guide_read_100",
  "one_on_one_visited",
  "checkout_visited",
  "checkout_clicked",
  "intake_started",
  "intake_submitted",
];

const FUNNEL_LABELS: Record<string, string> = {
  site_visit: "Site Visit",
  guide_view: "Guide View",
  guide_read_25: "Guide 25%",
  guide_read_50: "Guide 50%",
  guide_read_75: "Guide 75%",
  guide_read_100: "Guide 100%",
  one_on_one_visited: "1:1 Page Visit",
  checkout_visited: "Checkout Visit",
  checkout_clicked: "Checkout Click",
  intake_started: "Intake Start",
  intake_submitted: "Intake Submit",
};

const BAR_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--primary))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-5))",
];

const AUTO_REFRESH_MS = 15000;

const asMetadataRecord = (value: unknown): Record<string, unknown> => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value as Record<string, unknown>;
};

const getEventHostname = (metadata: unknown): string | null => {
  const hostname = asMetadataRecord(metadata).hostname;
  if (typeof hostname !== "string") return null;
  const trimmed = hostname.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const getTrackerVersion = (metadata: unknown): string | null => {
  const version = asMetadataRecord(metadata).tracker_version;
  if (typeof version !== "string") return null;
  const trimmed = version.trim();
  return trimmed.length > 0 ? trimmed : null;
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [settingUpAdmin, setSettingUpAdmin] = useState(false);

  // Overview stats
  const [stats, setStats] = useState({ agents: 0, leads: 0, transactions: 0 });
  const [syncStats, setSyncStats] = useState({ pending: 0, success: 0, failed: 0 });
  const [syncing, setSyncing] = useState(false);
  const [lastSyncResult, setLastSyncResult] = useState<string | null>(null);
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionResult, setConnectionResult] = useState<{
    connected: boolean;
    location_name?: string;
    error?: string;
    details?: string;
  } | null>(null);

  // Funnel analytics
  const [funnelData, setFunnelData] = useState<FunnelCount[]>([]);
  const [recentEvents, setRecentEvents] = useState<RecentEvent[]>([]);
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d" | "all">("30d");
  const [hostFilter, setHostFilter] = useState<string>("all");
  const [knownHosts, setKnownHosts] = useState<string[]>([]);
  const [refreshingDashboard, setRefreshingDashboard] = useState(false);
  const [lastRefreshAt, setLastRefreshAt] = useState<string | null>(null);
  const [diagnostics, setDiagnostics] = useState<{
    latestEventType: string;
    latestEventHost: string;
    latestEventAt: string;
    latestTrackerVersion: string;
  }>({
    latestEventType: "—",
    latestEventHost: "—",
    latestEventAt: "—",
    latestTrackerVersion: "—",
  });

  // Engagement
  const [engagementStats, setEngagementStats] = useState({
    guideAvgScroll: 0,
    guideAvgTime: 0,
    oneOnOneVisits: 0,
    oneOnOneAvgTime: 0,
    checkoutVisits: 0,
    checkoutClicks: 0,
    checkoutAvgTime: 0,
    intakeStarted: 0,
    intakeSubmitted: 0,
    intakeAvgTime: 0,
  });

  const currentHostname = useMemo(
    () => (typeof window !== "undefined" ? window.location.hostname : "unknown"),
    [],
  );

  useEffect(() => {
    checkAdminStatus();
  }, []);

  /* ---------- Auth / Admin Check ---------- */

  const checkAdminStatus = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      setUser(user);

      const { data: roles, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (error) {
        console.error("Error checking admin status:", error);
        toast.error("Error checking permissions");
        return;
      }

      const hasAdmin = !!roles;
      setIsAdmin(hasAdmin);
      if (hasAdmin) {
        await Promise.all([fetchStats(), fetchFunnelData("30d", "all"), fetchEngagement("all")]);
        setLastRefreshAt(new Date().toISOString());
      }
    } catch (error) {
      console.error("Error in checkAdminStatus:", error);
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Overview ---------- */

  const fetchStats = async () => {
    try {
      const [agentsResult, leadsResult, transactionsResult] = await Promise.all([
        supabase.from("agents").select("id", { count: "exact", head: true }),
        supabase.from("leads").select("id", { count: "exact", head: true }),
        supabase.from("transactions").select("id", { count: "exact", head: true }),
      ]);
      setStats({
        agents: agentsResult.count || 0,
        leads: leadsResult.count || 0,
        transactions: transactionsResult.count || 0,
      });
      await fetchSyncStats();
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchSyncStats = async () => {
    try {
      const [pendingResult, successResult, failedResult] = await Promise.all([
        supabase.from("contact_syncs").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("contact_syncs").select("id", { count: "exact", head: true }).eq("status", "success"),
        supabase.from("contact_syncs").select("id", { count: "exact", head: true }).eq("status", "failed"),
      ]);
      setSyncStats({
        pending: pendingResult.count || 0,
        success: successResult.count || 0,
        failed: failedResult.count || 0,
      });
    } catch (error) {
      console.error("Error fetching sync stats:", error);
    }
  };

  const handleManualSync = async () => {
    setSyncing(true);
    setLastSyncResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("sync-to-ghl", { body: { manual: true } });
      if (error) {
        toast.error("Failed to trigger sync");
        setLastSyncResult(`Error: ${error.message}`);
      } else {
        const result = data as { processed?: number; successful?: number; failed?: number; message?: string };
        if (result.message === "No pending syncs") {
          toast.info("No pending contacts to sync");
          setLastSyncResult("No pending syncs found");
        } else {
          toast.success(`Synced ${result.successful || 0} contacts successfully`);
          setLastSyncResult(`Processed: ${result.processed || 0}, Success: ${result.successful || 0}, Failed: ${result.failed || 0}`);
        }
        await fetchSyncStats();
      }
    } catch (error) {
      console.error("Error triggering sync:", error);
      toast.error("An error occurred during sync");
      setLastSyncResult("Error occurred");
    } finally {
      setSyncing(false);
    }
  };

  const handleTestGHLConnection = async () => {
    setTestingConnection(true);
    setConnectionResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("test-ghl-connection");
      if (error) {
        setConnectionResult({ connected: false, error: error.message });
      } else {
        setConnectionResult(data as { connected: boolean; location_name?: string; error?: string; details?: string });
      }
    } catch {
      setConnectionResult({ connected: false, error: "Request failed" });
    } finally {
      setTestingConnection(false);
    }
  };

  /* ---------- Funnel Analytics ---------- */

  const fetchFunnelData = async (
    range: "7d" | "30d" | "90d" | "all",
    selectedHost: string = hostFilter,
  ) => {
    setDateRange(range);
    try {
      let query = supabase.from("funnel_events").select("event_type, created_at, metadata");

      if (range !== "all") {
        const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
        const since = new Date(Date.now() - days * 86400000).toISOString();
        query = query.gte("created_at", since);
      }

      const { data, error } = await query;
      if (error) {
        console.error("Error fetching funnel data:", error);
        return;
      }

      const scopedRows = (data || []).filter((row) =>
        selectedHost === "all" ? true : getEventHostname(row.metadata) === selectedHost,
      );

      // Count by event_type
      const counts: Record<string, number> = {};
      for (const row of scopedRows) {
        counts[row.event_type] = (counts[row.event_type] || 0) + 1;
      }

      const ordered = FUNNEL_ORDER.map((et) => ({
        event_type: et,
        count: counts[et] || 0,
      }));
      setFunnelData(ordered);

      // Recent events (last 50)
      const { data: recent, error: recentErr } = await supabase
        .from("funnel_events")
        .select("id, event_type, ghl_contact_id, metadata, created_at")
        .order("created_at", { ascending: false })
        .limit(50);

      if (!recentErr && recent) {
        const hosts = Array.from(
          new Set(recent.map((ev) => getEventHostname(ev.metadata)).filter((h): h is string => Boolean(h))),
        );
        setKnownHosts(hosts);

        const scopedRecent = recent.filter((ev) =>
          selectedHost === "all" ? true : getEventHostname(ev.metadata) === selectedHost,
        );
        setRecentEvents(scopedRecent as unknown as RecentEvent[]);

        const latest = scopedRecent[0] ?? recent[0];
        if (latest) {
          setDiagnostics({
            latestEventType: FUNNEL_LABELS[latest.event_type] || latest.event_type,
            latestEventHost: getEventHostname(latest.metadata) || "(unknown)",
            latestEventAt: new Date(latest.created_at).toLocaleString(),
            latestTrackerVersion: getTrackerVersion(latest.metadata) || "(not set)",
          });
        }
      }
    } catch (error) {
      console.error("Error fetching funnel data:", error);
    }
  };

  /* ---------- Engagement ---------- */

  const fetchEngagement = async (selectedHost: string = hostFilter) => {
    try {
      const matchesHost = (metadata: unknown) =>
        selectedHost === "all" ? true : getEventHostname(metadata) === selectedHost;

      // Guide sessions
      const { data: guideSessions } = await supabase
        .from("funnel_events")
        .select("metadata")
        .eq("event_type", "guide_session");

      const scopedGuideSessions = (guideSessions || []).filter((row) => matchesHost(row.metadata));

      let guideAvgScroll = 0;
      let guideAvgTime = 0;
      if (scopedGuideSessions.length > 0) {
        const scrolls = scopedGuideSessions.map((r) => {
          const m = r.metadata as Record<string, number> | null;
          return m?.max_scroll_pct ?? 0;
        });
        const times = scopedGuideSessions.map((r) => {
          const m = r.metadata as Record<string, number> | null;
          return m?.time_on_page_seconds ?? 0;
        });
        guideAvgScroll = Math.round(scrolls.reduce((a, b) => a + b, 0) / scrolls.length);
        guideAvgTime = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
      }

      // One-on-one
      const { data: oneOnOneVisitRows } = await supabase
        .from("funnel_events")
        .select("id, metadata")
        .eq("event_type", "one_on_one_visited");
      const oneOnOneVisits = (oneOnOneVisitRows || []).filter((row) => matchesHost(row.metadata)).length;

      const { data: oneOnOneSessions } = await supabase
        .from("funnel_events")
        .select("metadata")
        .eq("event_type", "one_on_one_session");

      const scopedOneOnOneSessions = (oneOnOneSessions || []).filter((row) => matchesHost(row.metadata));
      let oneOnOneAvgTime = 0;
      if (scopedOneOnOneSessions.length > 0) {
        const times = scopedOneOnOneSessions.map((r) => {
          const m = r.metadata as Record<string, number> | null;
          return m?.time_on_page_seconds ?? 0;
        });
        oneOnOneAvgTime = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
      }

      // Checkout
      const { data: checkoutVisitRows } = await supabase
        .from("funnel_events")
        .select("id, metadata")
        .eq("event_type", "checkout_visited");
      const checkoutVisits = (checkoutVisitRows || []).filter((row) => matchesHost(row.metadata)).length;

      const { data: checkoutClickRows } = await supabase
        .from("funnel_events")
        .select("id, metadata")
        .eq("event_type", "checkout_clicked");
      const checkoutClicks = (checkoutClickRows || []).filter((row) => matchesHost(row.metadata)).length;

      const { data: checkoutSessions } = await supabase
        .from("funnel_events")
        .select("metadata")
        .eq("event_type", "checkout_session");

      const scopedCheckoutSessions = (checkoutSessions || []).filter((row) => matchesHost(row.metadata));
      let checkoutAvgTime = 0;
      if (scopedCheckoutSessions.length > 0) {
        const times = scopedCheckoutSessions.map((r) => {
          const m = r.metadata as Record<string, number> | null;
          return m?.time_on_page_seconds ?? 0;
        });
        checkoutAvgTime = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
      }

      // Intake
      const { data: intakeStartedRows } = await supabase
        .from("funnel_events")
        .select("id, metadata")
        .eq("event_type", "intake_started");
      const intakeStarted = (intakeStartedRows || []).filter((row) => matchesHost(row.metadata)).length;

      const { data: intakeSubmittedRows } = await supabase
        .from("funnel_events")
        .select("id, metadata")
        .eq("event_type", "intake_submitted");
      const intakeSubmitted = (intakeSubmittedRows || []).filter((row) => matchesHost(row.metadata)).length;

      const { data: intakeSessions } = await supabase
        .from("funnel_events")
        .select("metadata")
        .eq("event_type", "intake_session");

      const scopedIntakeSessions = (intakeSessions || []).filter((row) => matchesHost(row.metadata));
      let intakeAvgTime = 0;
      if (scopedIntakeSessions.length > 0) {
        const times = scopedIntakeSessions.map((r) => {
          const m = r.metadata as Record<string, number> | null;
          return m?.time_on_page_seconds ?? 0;
        });
        intakeAvgTime = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
      }

      setEngagementStats({
        guideAvgScroll,
        guideAvgTime,
        oneOnOneVisits,
        oneOnOneAvgTime,
        checkoutVisits,
        checkoutClicks,
        checkoutAvgTime,
        intakeStarted,
        intakeSubmitted,
        intakeAvgTime,
      });
    } catch (error) {
      console.error("Error fetching engagement:", error);
    }
  };

  const refreshDashboardData = async (
    range: "7d" | "30d" | "90d" | "all" = dateRange,
    selectedHost: string = hostFilter,
    showLoading = true,
  ) => {
    if (showLoading) setRefreshingDashboard(true);
    try {
      await Promise.all([fetchStats(), fetchFunnelData(range, selectedHost), fetchEngagement(selectedHost)]);
      setLastRefreshAt(new Date().toISOString());
    } finally {
      if (showLoading) setRefreshingDashboard(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) return;

    const timer = window.setInterval(() => {
      void refreshDashboardData(dateRange, hostFilter, false);
    }, AUTO_REFRESH_MS);

    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, dateRange, hostFilter]);

  /* ---------- Admin Setup ---------- */

  const handleSetupAdmin = async () => {
    setSettingUpAdmin(true);
    try {
      const { error } = await supabase.functions.invoke("setup-admin");
      if (error) {
        toast.error("Failed to setup admin access");
      } else {
        toast.success("Admin access granted!");
        await checkAdminStatus();
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setSettingUpAdmin(false);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) toast.error("Error signing out");
    else {
      toast.success("Signed out successfully");
      navigate("/auth");
    }
  };

  /* ---------- Render ---------- */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Admin Access Setup</CardTitle>
            <CardDescription>
              Click below to grant yourself admin access. One-time setup for the first administrator.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={handleSetupAdmin} className="w-full" disabled={settingUpAdmin}>
              {settingUpAdmin ? "Setting up..." : "Setup Admin Access"}
            </Button>
            <Button onClick={handleSignOut} variant="outline" className="w-full">
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatSeconds = (s: number) => {
    if (s < 60) return `${s}s`;
    return `${Math.floor(s / 60)}m ${s % 60}s`;
  };

  const lastRefreshLabel = lastRefreshAt ? new Date(lastRefreshAt).toLocaleTimeString() : "—";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Realtor Business Credit Admin</h1>
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              View Site
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <Button onClick={handleSignOut} variant="outline" size="sm">
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Quick actions */}
        <div className="mb-6 flex gap-3">
          <Button onClick={() => navigate("/admin/mls-import")}>Import MLS Data</Button>
          <Button variant="outline" onClick={() => navigate("/admin/intake")}>
            Intake Surveys
          </Button>
          <Button
            variant="outline"
            onClick={() => void refreshDashboardData(dateRange, hostFilter, true)}
            disabled={refreshingDashboard}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshingDashboard ? "animate-spin" : ""}`} />
            {refreshingDashboard ? "Refreshing..." : "Refresh Dashboard"}
          </Button>
          <p className="text-xs text-muted-foreground self-center">
            Auto-refresh: {Math.floor(AUTO_REFRESH_MS / 1000)}s · Last refresh: {lastRefreshLabel}
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview" className="gap-1.5">
              <Users className="h-4 w-4" /> Overview
            </TabsTrigger>
            <TabsTrigger value="funnel" className="gap-1.5">
              <TrendingUp className="h-4 w-4" /> Funnel Analytics
            </TabsTrigger>
            <TabsTrigger value="engagement" className="gap-1.5">
              <Activity className="h-4 w-4" /> Engagement
            </TabsTrigger>
          </TabsList>

          {/* ======== OVERVIEW TAB ======== */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Agents</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{stats.agents}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Leads</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{stats.leads}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{stats.transactions}</p>
                </CardContent>
              </Card>
            </div>

            {/* GHL Sync */}
            <Card>
              <CardHeader>
                <CardTitle>GoHighLevel Sync Status</CardTitle>
                <CardDescription>Contact synchronization with CRM</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold text-amber-600">{syncStats.pending}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Synced</p>
                    <p className="text-2xl font-bold text-green-600">{syncStats.success}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Failed</p>
                    <p className="text-2xl font-bold text-red-600">{syncStats.failed}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Button onClick={handleManualSync} disabled={syncing || syncStats.pending === 0}>
                    {syncing ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Syncing...
                      </>
                    ) : (
                      `Sync Now (${syncStats.pending} pending)`
                    )}
                  </Button>
                  <Button variant="outline" onClick={handleTestGHLConnection} disabled={testingConnection}>
                    {testingConnection ? "Testing..." : "Test GHL Connection"}
                  </Button>
                </div>

                {connectionResult && (
                  <div
                    className={`p-3 rounded-md ${
                      connectionResult.connected
                        ? "bg-green-50 border border-green-200"
                        : "bg-red-50 border border-red-200"
                    }`}
                  >
                    {connectionResult.connected ? (
                      <p className="text-sm text-green-800">
                        ✅ Connected — Location: <strong>{connectionResult.location_name}</strong>
                      </p>
                    ) : (
                      <div className="text-sm text-red-800">
                        <p>❌ Connection failed: {connectionResult.error}</p>
                        {connectionResult.details && (
                          <p className="mt-1 font-mono text-xs">{connectionResult.details}</p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {lastSyncResult && (
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-sm font-mono">{lastSyncResult}</p>
                  </div>
                )}

                <p className="text-xs text-muted-foreground">
                  Automatic sync runs every 5 minutes. Manual sync processes up to 20 contacts at a time.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tracking Diagnostics</CardTitle>
                <CardDescription>Live signal health and deployment visibility</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Admin Host</p>
                    <p className="text-sm font-medium break-all">{currentHostname}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Latest Event</p>
                    <p className="text-sm font-medium">{diagnostics.latestEventType}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Latest Event Host</p>
                    <p className="text-sm font-medium break-all">{diagnostics.latestEventHost}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Tracker Version</p>
                    <p className="text-sm font-medium">{diagnostics.latestTrackerVersion}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Latest event time: {diagnostics.latestEventAt}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ======== FUNNEL ANALYTICS TAB ======== */}
          <TabsContent value="funnel" className="space-y-6">
            <div className="flex items-center gap-2">
              {(["7d", "30d", "90d", "all"] as const).map((r) => (
                <Button
                  key={r}
                  size="sm"
                  variant={dateRange === r ? "default" : "outline"}
                  onClick={() => void refreshDashboardData(r, hostFilter, true)}
                >
                  {r === "all" ? "All Time" : `Last ${r.replace("d", " days")}`}
                </Button>
              ))}

              <select
                value={hostFilter}
                onChange={(e) => {
                  const nextHost = e.target.value;
                  setHostFilter(nextHost);
                  void refreshDashboardData(dateRange, nextHost, true);
                }}
                className="h-9 rounded-md border border-border bg-background px-3 text-sm"
              >
                <option value="all">All hosts</option>
                {knownHosts.map((host) => (
                  <option key={host} value={host}>
                    {host}
                  </option>
                ))}
              </select>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Funnel Progression</CardTitle>
                <CardDescription>Event counts across funnel stages</CardDescription>
              </CardHeader>
              <CardContent>
                {funnelData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={funnelData} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis
                        dataKey="event_type"
                        tickFormatter={(v) => FUNNEL_LABELS[v] || v}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        className="text-xs fill-muted-foreground"
                      />
                      <YAxis className="text-xs fill-muted-foreground" />
                      <Tooltip
                        labelFormatter={(v) => FUNNEL_LABELS[v as string] || v}
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {funnelData.map((_, i) => (
                          <Cell key={i} fill={BAR_COLORS[i] || "hsl(var(--primary))"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-muted-foreground text-center py-12">
                    No funnel events recorded yet. Events will appear as visitors interact with your site.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Conversion rates */}
            {funnelData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Conversion Rates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    {[
                      { label: "Visit → Guide View", from: "site_visit", to: "guide_view" },
                      { label: "Guide View → 50%+", from: "guide_view", to: "guide_read_50" },
                      { label: "Guide View → Complete", from: "guide_view", to: "guide_read_100" },
                      { label: "Guide Complete → 1:1", from: "guide_read_100", to: "one_on_one_visited" },
                      { label: "Visit → Checkout", from: "site_visit", to: "checkout_visited" },
                      { label: "Checkout → Click", from: "checkout_visited", to: "checkout_clicked" },
                      { label: "Intake Start → Submit", from: "intake_started", to: "intake_submitted" },
                    ].map(({ label, from, to }) => {
                      const fromCount = funnelData.find((f) => f.event_type === from)?.count || 0;
                      const toCount = funnelData.find((f) => f.event_type === to)?.count || 0;
                      const rate = fromCount > 0 ? Math.round((toCount / fromCount) * 100) : 0;
                      return (
                        <div key={label} className="p-3 bg-muted rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">{label}</p>
                          <p className="text-2xl font-bold">{rate}%</p>
                          <p className="text-xs text-muted-foreground">
                            {toCount} / {fromCount}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent events */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Events</CardTitle>
                <CardDescription>Last 50 funnel events</CardDescription>
              </CardHeader>
              <CardContent>
                {recentEvents.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 pr-4 font-medium text-muted-foreground">Time</th>
                          <th className="text-left py-2 pr-4 font-medium text-muted-foreground">Event</th>
                          <th className="text-left py-2 pr-4 font-medium text-muted-foreground">Contact</th>
                          <th className="text-left py-2 pr-4 font-medium text-muted-foreground">Host</th>
                          <th className="text-left py-2 pr-4 font-medium text-muted-foreground">Tracker</th>
                          <th className="text-left py-2 font-medium text-muted-foreground">Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentEvents.map((ev) => (
                          <tr key={ev.id} className="border-b border-border/50">
                            <td className="py-2 pr-4 text-muted-foreground whitespace-nowrap">
                              {new Date(ev.created_at).toLocaleString()}
                            </td>
                            <td className="py-2 pr-4 font-medium">
                              {FUNNEL_LABELS[ev.event_type] || ev.event_type}
                            </td>
                            <td className="py-2 pr-4 text-muted-foreground font-mono text-xs">
                              {ev.ghl_contact_id || "—"}
                            </td>
                            <td className="py-2 pr-4 text-muted-foreground font-mono text-xs">
                              {getEventHostname(ev.metadata) || "—"}
                            </td>
                            <td className="py-2 pr-4 text-muted-foreground font-mono text-xs">
                              {getTrackerVersion(ev.metadata) || "—"}
                            </td>
                            <td className="py-2 text-muted-foreground text-xs">
                              {ev.metadata && Object.keys(ev.metadata).length > 0
                                ? JSON.stringify(ev.metadata)
                                : "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-6">No events yet.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ======== ENGAGEMENT TAB ======== */}
          <TabsContent value="engagement" className="space-y-6">
            {/* Guide */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" /> Guide Engagement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Avg Scroll Depth</p>
                    <p className="text-3xl font-bold">{engagementStats.guideAvgScroll}%</p>
                    <div className="w-full bg-muted rounded-full h-2 mt-2">
                      <div
                        className="bg-primary rounded-full h-2 transition-all"
                        style={{ width: `${engagementStats.guideAvgScroll}%` }}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Avg Time on Page</p>
                    <p className="text-3xl font-bold">{formatSeconds(engagementStats.guideAvgTime)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Checkout */}
            <Card>
              <CardHeader>
                <CardTitle>One-on-One Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Visits</p>
                    <p className="text-3xl font-bold">{engagementStats.oneOnOneVisits}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Avg Time on Page</p>
                    <p className="text-3xl font-bold">{formatSeconds(engagementStats.oneOnOneAvgTime)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Checkout */}
            <Card>
              <CardHeader>
                <CardTitle>Checkout Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Visits</p>
                    <p className="text-3xl font-bold">{engagementStats.checkoutVisits}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Payment Clicks</p>
                    <p className="text-3xl font-bold">{engagementStats.checkoutClicks}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Avg Time on Page</p>
                    <p className="text-3xl font-bold">{formatSeconds(engagementStats.checkoutAvgTime)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Intake */}
            <Card>
              <CardHeader>
                <CardTitle>Intake Survey Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Started</p>
                    <p className="text-3xl font-bold">{engagementStats.intakeStarted}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Submitted</p>
                    <p className="text-3xl font-bold">{engagementStats.intakeSubmitted}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Avg Completion Time</p>
                    <p className="text-3xl font-bold">{formatSeconds(engagementStats.intakeAvgTime)}</p>
                  </div>
                </div>
                {engagementStats.intakeStarted > 0 && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Completion Rate:{" "}
                      <span className="font-bold text-foreground">
                        {Math.round((engagementStats.intakeSubmitted / engagementStats.intakeStarted) * 100)}%
                      </span>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Button
              variant="outline"
              onClick={() => void refreshDashboardData(dateRange, hostFilter, true)}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${refreshingDashboard ? "animate-spin" : ""}`} />
              {refreshingDashboard ? "Refreshing..." : "Refresh Engagement Data"}
            </Button>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
