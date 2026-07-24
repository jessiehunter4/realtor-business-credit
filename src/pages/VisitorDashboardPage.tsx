import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BookOpen, FileText, LogOut, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PhoneInput from "@/components/shared/PhoneInput";
import SiteHeader from "@/components/shared/SiteHeader";
import SiteFooter from "@/components/shared/SiteFooter";
import Seo from "@/components/shared/Seo";
import { readAllScrollMemory } from "@/lib/guideScrollMemory";

interface ProfileRow {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
}

interface PlanRow {
  id: string;
  status: string;
  updated_at: string | null;
}

export default function VisitorDashboardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [plans, setPlans] = useState<PlanRow[]>([]);
  const [savingProfile, setSavingProfile] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [guideProgress, setGuideProgress] = useState<number>(0);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const [{ data: prof }, { data: planRows }] = await Promise.all([
        supabase
          .from("profiles")
          .select("user_id, first_name, last_name, email, phone")
          .eq("user_id", session.user.id)
          .maybeSingle(),
        supabase
          .from("custom_plans")
          .select("id, status, updated_at")
          .eq("user_id", session.user.id)
          .order("updated_at", { ascending: false }),
      ]);

      if (!active) return;
      if (prof) {
        setProfile(prof as ProfileRow);
        setFirstName(prof.first_name ?? "");
        setLastName(prof.last_name ?? "");
        setPhone(prof.phone ?? "");
      }
      setPlans((planRows as PlanRow[]) ?? []);

      try {
        const mem = readAllScrollMemory?.() ?? {};
        const chapters = Object.keys(mem);
        // Guide has ~13 chapters; rough progress signal.
        setGuideProgress(Math.min(100, Math.round((chapters.length / 13) * 100)));
      } catch {
        setGuideProgress(0);
      }

      setLoading(false);
    })();
    return () => { active = false; };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/", { replace: true });
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSavingProfile(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: firstName.trim() || null,
        last_name: lastName.trim() || null,
        phone: phone.trim() || null,
      })
      .eq("user_id", profile.user_id);
    setSavingProfile(false);
    if (error) {
      toast.error("Could not save profile.");
      return;
    }
    toast.success("Profile updated.");
  };

  const publishedPlan = plans.find((p) => p.status === "published");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Seo title="Dashboard — RE Pro Business Credit" description="Your plan, guide progress, and profile." />
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-10 max-w-5xl">
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-secondary">
              Welcome{firstName ? `, ${firstName}` : ""}
            </h1>
            <p className="text-muted-foreground mt-1">Your plan, guide progress, and profile in one place.</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" /> Sign out
          </Button>
        </div>

        <Tabs defaultValue="plan" className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="plan"><FileText className="w-4 h-4 mr-2" />Plan</TabsTrigger>
            <TabsTrigger value="guide"><BookOpen className="w-4 h-4 mr-2" />Guide</TabsTrigger>
            <TabsTrigger value="profile"><User className="w-4 h-4 mr-2" />Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="plan" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>My Custom Plan</CardTitle>
                <CardDescription>Your personalized business credit action plan.</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-sm text-muted-foreground">Loading…</p>
                ) : publishedPlan ? (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Last updated {publishedPlan.updated_at ? new Date(publishedPlan.updated_at).toLocaleDateString() : "—"}.
                    </p>
                    <Button asChild>
                      <Link to={`/portal/plan/${publishedPlan.id}`}>Open my plan</Link>
                    </Button>
                  </div>
                ) : plans.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Your plan is being finalized. You'll be notified as soon as it's ready.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      You haven't created a plan yet. The intake survey builds it for you in about 10 minutes.
                    </p>
                    <Button asChild>
                      <Link to="/intake">Start intake survey</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="guide" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Guide Progress</CardTitle>
                <CardDescription>Pick up where you left off.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">Chapters viewed</span>
                    <span className="text-sm text-muted-foreground">{guideProgress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary transition-all" style={{ width: `${guideProgress}%` }} />
                  </div>
                </div>
                <Button asChild variant="outline">
                  <Link to="/guide">Open the guide</Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>My Profile</CardTitle>
                <CardDescription>Update your contact information.</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-sm text-muted-foreground">Loading…</p>
                ) : (
                  <form onSubmit={handleSaveProfile} className="space-y-4 max-w-md">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First name</Label>
                        <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last name</Label>
                        <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={profile?.email ?? ""} disabled />
                      <p className="text-xs text-muted-foreground">Email is managed by your account and can't be changed here.</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Mobile phone</Label>
                      <PhoneInput id="phone" value={phone} onChange={setPhone} />
                    </div>
                    <Button type="submit" disabled={savingProfile}>
                      {savingProfile ? "Saving…" : "Save changes"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <SiteFooter />
    </div>
  );
}