// Admin signup. The account is created as a normal user, then elevated to
// admin server-side. Not linked in nav.
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Seo from "@/components/shared/Seo";
import AccountConsentFields from "@/components/shared/AccountConsentFields";
import { TERMS_CONSENT_TEXT } from "@/lib/messagingConsent";
import { useAuthRole } from "@/hooks/useAuthRole";

const schema = z.object({
  email: z.string().email("Enter a valid email").max(255),
  password: z.string().min(6, "Minimum 6 characters").max(100),
});

export default function AdminSignupPage() {
  const navigate = useNavigate();
  const { refresh } = useAuthRole();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      toast.error("Please agree to the Terms of Use and Privacy Policy.");
      return;
    }
    try {
      const v = schema.parse({ email, password });
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email: v.email,
        password: v.password,
        options: {
          emailRedirectTo: `${window.location.origin}/admin`,
          data: {
            requested_role: "admin",
            terms_accepted: "true",
            terms_consent_text: TERMS_CONSENT_TEXT,
          },
        },
      });

      if (error) {
        toast.error(
          error.message.includes("already registered")
            ? "This email is already registered. Please sign in instead."
            : error.message,
        );
        return;
      }

      if (!data.session) {
        toast.success("Account created. Confirm your email, then sign in to finish admin setup.");
        return;
      }

      // The database assigns exactly one role at signup. Route on what it
      // actually stored rather than on what we requested.
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.session.user.id);
      const isAdmin = !!roles?.some((r) => r.role === "admin");
      await refresh();
      if (isAdmin) {
        toast.success("Admin account created.");
        navigate("/admin", { replace: true });
      } else {
        toast.error(
          "Account created as a standard user. An existing administrator must grant admin access.",
        );
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      if (err instanceof z.ZodError) toast.error(err.errors[0].message);
      else toast.error("Sign-up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-hero-grad p-4">
      <Seo title="Admin signup — RE Pro Business Credit" description="Create an administrator account." noindex />
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-bold text-center">Create an admin account</CardTitle>
          <CardDescription className="text-center">
            Accounts created here are granted administrator access.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  disabled={loading}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password">Password</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  required
                  disabled={loading}
                  className="pl-9 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-muted-foreground hover:text-secondary"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <AccountConsentFields
              idPrefix="admin-signup"
              showPhone={false}
              agreed={agreed}
              onAgreedChange={setAgreed}
              disabled={loading}
            />
            <Button type="submit" size="lg" className="w-full rounded-full" disabled={loading || !agreed}>
              {loading ? "Creating account…" : "Create admin account"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}