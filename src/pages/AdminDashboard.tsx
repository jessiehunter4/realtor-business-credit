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
    } catch (error) {
      console.error("Error fetching stats:", error);
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
