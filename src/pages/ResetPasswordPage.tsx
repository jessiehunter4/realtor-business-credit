import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SiteHeader from "@/components/shared/SiteHeader";
import SiteFooter from "@/components/shared/SiteFooter";
import Seo from "@/components/shared/Seo";

const schema = z.object({ password: z.string().min(8, "Password must be at least 8 characters").max(100) });

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase redirects here with a recovery session in the URL hash.
    // onAuthStateChange fires PASSWORD_RECOVERY when it's picked up.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const v = schema.parse({ password });
      setLoading(true);
      const { error } = await supabase.auth.updateUser({ password: v.password });
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("Password updated. Redirecting…");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      if (err instanceof z.ZodError) toast.error(err.errors[0].message);
      else toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Seo title="Set New Password — RE Pro Business Credit" description="Set a new password for your account." />
      <SiteHeader />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Set a new password</CardTitle>
            <CardDescription>Choose a strong password you haven't used before.</CardDescription>
          </CardHeader>
          <CardContent>
            {!ready ? (
              <p className="text-sm text-muted-foreground text-center">
                This page must be opened from the password reset email link.{" "}
                <Link to="/forgot-password" className="text-primary font-semibold hover:underline">Request a new link</Link>.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">New password</Label>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} placeholder="Minimum 8 characters" />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Updating…" : "Update password"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
}