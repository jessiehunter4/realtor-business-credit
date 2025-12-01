import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [settingUpAdmin, setSettingUpAdmin] = useState(false);
  const [stats, setStats] = useState({
    agents: 0,
    leads: 0,
    transactions: 0,
  });
  const [syncStats, setSyncStats] = useState({
    pending: 0,
    success: 0,
    failed: 0,
  });
  const [syncing, setSyncing] = useState(false);
  const [lastSyncResult, setLastSyncResult] = useState<string | null>(null);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      setUser(user);

      // Check if user has admin role
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

      // Fetch stats if admin
      if (hasAdmin) {
        await fetchStats();
      }
    } catch (error) {
      console.error("Error in checkAdminStatus:", error);
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

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
      const { data, error } = await supabase.functions.invoke('sync-to-ghl', {
        body: { manual: true }
      });
      
      if (error) {
        toast.error("Failed to trigger sync");
        console.error("Sync error:", error);
        setLastSyncResult(`Error: ${error.message}`);
      } else {
        const result = data as { processed?: number; successful?: number; failed?: number; message?: string };
        if (result.message === 'No pending syncs') {
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

  const handleSetupAdmin = async () => {
    setSettingUpAdmin(true);
    try {
      const { error } = await supabase.functions.invoke('setup-admin');
      
      if (error) {
        toast.error("Failed to setup admin access");
        console.error("Setup admin error:", error);
      } else {
        toast.success("Admin access granted!");
        // Refresh admin status
        await checkAdminStatus();
      }
    } catch (error) {
      console.error("Error setting up admin:", error);
      toast.error("An error occurred");
    } finally {
      setSettingUpAdmin(false);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error signing out");
    } else {
      toast.success("Signed out successfully");
      navigate("/auth");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
              Click the button below to grant yourself admin access. This is a one-time setup for the first administrator.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={handleSetupAdmin} 
              className="w-full"
              disabled={settingUpAdmin}
            >
              {settingUpAdmin ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                  Setting up...
                </>
              ) : (
                "Setup Admin Access"
              )}
            </Button>
            <Button onClick={handleSignOut} variant="outline" className="w-full">
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Realtor Business Credit Admin</h1>
            <Button variant="ghost" onClick={() => navigate("/")}>
              View Landing Page
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <Button onClick={handleSignOut} variant="outline">
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button onClick={() => navigate("/admin/mls-import")}>
            Import MLS Data
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Total Agents</CardTitle>
              <CardDescription>Agents from MLS imports</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.agents}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Leads</CardTitle>
              <CardDescription>From landing page</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.leads}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transactions</CardTitle>
              <CardDescription>Total closings tracked</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.transactions}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>GoHighLevel Sync Status</CardTitle>
            <CardDescription>
              Contact synchronization with GoHighLevel CRM
            </CardDescription>
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
              <Button 
                onClick={handleManualSync}
                disabled={syncing || syncStats.pending === 0}
              >
                {syncing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                    Syncing...
                  </>
                ) : (
                  `Sync Now (${syncStats.pending} pending)`
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={fetchSyncStats}
              >
                Refresh Stats
              </Button>
            </div>

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

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Welcome to the Admin Dashboard</CardTitle>
            <CardDescription>
              This is the foundation of your Realtor Business Credit management system.
              The full dashboard features will be implemented in subsequent phases.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Phase 1 Complete: Database schema, authentication, and admin role system are now in place.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
