// Visitor login page (real Supabase auth).
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { signOutAndClear } from "@/lib/signOut";
import SiteHeader from "@/components/shared/SiteHeader";
import SiteFooter from "@/components/shared/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Seo from "@/components/shared/Seo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AccountConsentFields from "@/components/shared/AccountConsentFields";
import { readContactIdentity } from "@/lib/contactIdentityStore";
import { SMS_CONSENT_TEXT, TERMS_CONSENT_TEXT } from "@/lib/messagingConsent";
import { useAuthRole } from "@/hooks/useAuthRole";
import { resolvePostAuthTarget } from "@/lib/roles";

interface LocationState {
  firstName?: string;
  email?: string;
  contactId?: string;
}

const schema = z.object({
  email: z.string().email("Enter a valid email").max(255),
  password: z.string().min(6, "Minimum 6 characters").max(100),
});

const MockLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { session: activeSession, role, loading: roleLoading } = useAuthRole();
  const rawNext = searchParams.get("next");
  const next =
    rawNext && rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : null;
  const state = (location.state ?? {}) as LocationState;

  const [email, setEmail] = useState(state.email ?? "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [view, setView] = useState<"tabs" | "forgot">("tabs");
  const [phone, setPhone] = useState(() => readContactIdentity().phone ?? "");
  const [smsConsent, setSmsConsent] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // Role resolution is centralised in AuthRoleProvider; once a session and its
  // role are known, route by role (never by "authentication succeeded" alone).
  useEffect(() => {
    if (roleLoading || !activeSession) return;
    if (role === "admin") {
      // Admin accounts must use the admin sign-in page.
      signOutAndClear({ redirectTo: null }).then(() =>
        toast.error("Invalid email or password"),
      );
      return;
    }
    navigate(resolvePostAuthTarget(next, role), { replace: true });
  }, [roleLoading, activeSession, role, next, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const v = schema.parse({ email, password });
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: v.email,
        password: v.password,
      });
      if (error) {
        toast.error(
          error.message.includes("Invalid login credentials")
            ? "Invalid email or password"
            : error.message,
        );
        return;
      }
      if (data.user) {
        // Admin accounts are not allowed to sign in here.
        const { data: adminRow } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", data.user.id)
          .eq("role", "admin")
          .maybeSingle();
        if (adminRow) {
          await signOutAndClear({ redirectTo: null });
          toast.error("Invalid email or password");
          return;
        }
      }
      // AuthRoleProvider picks up the new session and the effect above
      // performs the role-based redirect.
      if (!data.user) toast.error("Sign-in failed");
    } catch (err) {
      if (err instanceof z.ZodError) toast.error(err.errors[0].message);
      else toast.error("Sign-in failed");
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
    if (phone.length !== 10) {
      toast.error("Enter a valid 10-digit mobile number.");
      return;
    }
    try {
      const v = schema.parse({ email, password });
      setLoading(true);
      const identity = readContactIdentity();
      const smsOptedIn = smsConsent && phone.length === 10;
      const { data, error } = await supabase.auth.signUp({
        email: v.email,
        password: v.password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            first_name: identity.firstName ?? "",
            last_name: identity.lastName ?? "",
            phone,
            terms_accepted: "true",
            terms_consent_text: TERMS_CONSENT_TEXT,
            sms_consent: smsOptedIn ? "true" : "false",
            sms_consent_text: smsOptedIn ? SMS_CONSENT_TEXT : "",
            sms_consent_source: smsOptedIn ? "MockLoginSignUp" : "",
          },
        },
      });
      if (error) {
        toast.error(
          error.message.includes("already registered")
            ? "This email is already registered. Please sign in."
            : error.message,
        );
        return;
      }
      if (data.session && data.user) {
        toast.success("Account created!");
        // Redirect is handled by the role-based effect once the provider
        // resolves the new session's role.
      } else {
        toast.success("Check your email to confirm your account.");
      }
    } catch (err) {
      if (err instanceof z.ZodError) toast.error(err.errors[0].message);
      else toast.error("Sign-up failed");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const v = z.string().email("Enter a valid email").max(255).parse(email);
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(v, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) {
        toast.error(error.message);
        return;
      }
      setResetSent(true);
      toast.success("Check your email for a password reset link.");
    } catch (err) {
      if (err instanceof z.ZodError) toast.error(err.errors[0].message);
      else toast.error("Could not send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-hero-grad">
      <Seo title="Log in — RE Pro Business Credit" description="Access your RE Pro Business Credit portal." />
      <SiteHeader />

      <main id="main-content" className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1
              className="mt-4 font-semibold text-secondary"
              style={{ fontSize: "clamp(1.75rem, 3vw, 2.25rem)", lineHeight: 1.15 }}
            >
              Log in to your RE Pro Business Credit portal
            </h1>
            <p className="mt-3 text-muted-foreground text-sm">
              {state.firstName
                ? `Welcome back, ${state.firstName}. Log in to see your plan.`
                : "Log in to view your custom plan, tasks, and next session."}
            </p>
          </div>

          <div className="rounded-3xl bg-white shadow-card border border-border/60 p-6 sm:p-8">
            {view === "forgot" ? (
              <div className="space-y-5">
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-secondary">Reset your password</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Enter your email and we'll send you a reset link and code.
                  </p>
                </div>
                {resetSent ? (
                  <div className="text-center space-y-4">
                    <p className="text-sm text-muted-foreground">
                      If an account exists for <span className="font-medium text-foreground">{email}</span>, you'll receive a reset email shortly.
                    </p>
                    <Button
                      type="button"
                      size="lg"
                      className="w-full rounded-full"
                      onClick={() =>
                        navigate(`/reset-password?email=${encodeURIComponent(email)}`)
                      }
                    >
                      I have a code
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full rounded-full"
                      onClick={() => { setView("tabs"); setResetSent(false); }}
                    >
                      Back to sign in
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleForgotPassword} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="forgot-email">Email</Label>
                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="forgot-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          required
                          disabled={loading}
                          className="pl-9"
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full rounded-full"
                      disabled={loading}
                    >
                      {loading ? "Sending…" : "Send reset link"}
                    </Button>
                    <button
                      type="button"
                      onClick={() => setView("tabs")}
                      className="w-full text-center text-sm text-muted-foreground hover:text-secondary"
                    >
                      Back to sign in
                    </button>
                  </form>
                )}
              </div>
            ) : (
              <Tabs value={tab} onValueChange={(v) => setTab(v as "signin" | "signup")}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="signin">Sign in</TabsTrigger>
                  <TabsTrigger value="signup">Create account</TabsTrigger>
                </TabsList>

                {(["signin", "signup"] as const).map((mode) => (
                  <TabsContent key={mode} value={mode}>
                    <form
                      onSubmit={mode === "signin" ? handleSignIn : handleSignUp}
                      className="space-y-5"
                    >
                      <div className="space-y-2">
                        <Label htmlFor={`${mode}-email`}>Email</Label>
                        <div className="relative">
                          <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id={`${mode}-email`}
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                            disabled={loading}
                            className="pl-9"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`${mode}-password`}>Password</Label>
                        <div className="relative">
                          <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id={`${mode}-password`}
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={mode === "signup" ? "Minimum 6 characters" : "••••••••"}
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
                      {mode === "signup" && (
                        <AccountConsentFields
                          idPrefix="signup"
                          phone={phone}
                          onPhoneChange={setPhone}
                          smsConsent={smsConsent}
                          onSmsConsentChange={setSmsConsent}
                          agreed={agreed}
                          onAgreedChange={setAgreed}
                          disabled={loading}
                        />
                      )}
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full rounded-full"
                        disabled={loading || (mode === "signup" && !agreed)}
                      >
                        {loading
                          ? mode === "signin"
                            ? "Signing in…"
                            : "Creating account…"
                          : mode === "signin"
                            ? "Log in"
                            : "Create account"}
                      </Button>
                      {mode === "signin" && (
                        <div className="text-center">
                          <button
                            type="button"
                            onClick={() => setView("forgot")}
                            className="text-sm text-muted-foreground hover:text-secondary"
                          >
                            Forgot password?
                          </button>
                        </div>
                      )}
                    </form>
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Secure · Private · Realtor-only
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};

export default MockLoginPage;
