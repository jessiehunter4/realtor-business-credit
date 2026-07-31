import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { z } from "zod";
import AccountConsentFields from "@/components/shared/AccountConsentFields";
import { TERMS_CONSENT_TEXT } from "@/lib/messagingConsent";
import { useAuthRole } from "@/hooks/useAuthRole";

const authSchema = z.object({
  email: z.string().email("Invalid email address").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(100)
});

export default function AuthPage() {
  const navigate = useNavigate();
  const { refresh } = useAuthRole();
  const [searchParams] = useSearchParams();
  const rawNext = searchParams.get("next");
  const next =
    rawNext && rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : null;
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const adminCheckInFlight = useRef(false);
  // While an admin sign-up is in progress the SIGNED_IN event must not route
  // the user away before the admin role has been granted server-side.
  const signingUp = useRef(false);

  const checkAdminAndRoute = async (userId: string) => {
    if (adminCheckInFlight.current) return;
    adminCheckInFlight.current = true;

    try {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();
      if (data) {
        if (next) window.location.replace(next);
        else navigate("/admin");
        return;
      }

      // Not an admin: reject the sign-in outright rather than routing them here.
      await supabase.auth.signOut();
      toast.error("Invalid email or password");
    } finally {
      adminCheckInFlight.current = false;
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) checkAdminAndRoute(session.user.id);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        if (signingUp.current) return;
        setTimeout(() => checkAdminAndRoute(session.user.id), 0);
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate, next]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validated = authSchema.parse({ email, password });
      setLoading(true);

      const { error } = await supabase.auth.signInWithPassword({
        email: validated.email,
        password: validated.password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Invalid email or password");
        } else {
          toast.error(error.message);
        }
        return;
      }

      toast.success("Signed in successfully!");
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("An error occurred during sign in");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreed) {
      toast.error("Please agree to the Terms of Use and Privacy Policy.");
      return;
    }

    try {
      const validated = authSchema.parse({ email, password });
      setLoading(true);
      signingUp.current = true;

      const { data, error } = await supabase.auth.signUp({
        email: validated.email,
        password: validated.password,
        options: {
          emailRedirectTo: `${window.location.origin}${next ?? "/admin"}`,
          data: {
            terms_accepted: "true",
            terms_consent_text: TERMS_CONSENT_TEXT,
          }
        }
      });

      if (error) {
        if (error.message.includes("already registered")) {
          toast.error("This email is already registered. Please sign in instead.");
        } else {
          toast.error(error.message);
        }
        return;
      }

      if (!data.session) {
        toast.success("Account created. Confirm your email, then sign in to finish admin setup.");
        return;
      }

      const { data: result, error: fnError } = await supabase.functions.invoke(
        "assign-admin-role",
        { body: {} },
      );

      if (fnError || !result || (result as { error?: string }).error) {
        toast.error("Account created, but admin access could not be granted.");
        await refresh();
        navigate("/dashboard", { replace: true });
        return;
      }

      toast.success("Admin account created.");
      await refresh();
      navigate("/admin", { replace: true });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("An error occurred during sign up");
      }
    } finally {
      setLoading(false);
      signingUp.current = false;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[hsl(var(--background))] to-[hsl(var(--muted))] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-bold text-center">Admin Access</CardTitle>
          <CardDescription className="text-center">
            Sign in to access the RE Pro Business Credit admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    placeholder="Minimum 6 characters"
                  />
                </div>
                <AccountConsentFields
                  idPrefix="auth-signup"
                  showPhone={false}
                  agreed={agreed}
                  onAgreedChange={setAgreed}
                  disabled={loading}
                />
                <Button type="submit" className="w-full" disabled={loading || !agreed}>
                  {loading ? "Creating account..." : "Sign Up"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
