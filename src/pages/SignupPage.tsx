// Visitor signup. Accounts created here get the `user` role (assigned
// server-side by the new-user database trigger).
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import SiteHeader from "@/components/shared/SiteHeader";
import SiteFooter from "@/components/shared/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Seo from "@/components/shared/Seo";
import AccountConsentFields from "@/components/shared/AccountConsentFields";
import { readContactIdentity } from "@/lib/contactIdentityStore";
import { SMS_CONSENT_TEXT, TERMS_CONSENT_TEXT } from "@/lib/messagingConsent";
import { useAuthRole } from "@/hooks/useAuthRole";
import { resolvePostAuthTarget } from "@/lib/roles";

const schema = z.object({
  email: z.string().email("Enter a valid email").max(255),
  password: z.string().min(6, "Minimum 6 characters").max(100),
});

export default function SignupPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { session, role, loading: roleLoading } = useAuthRole();
  const rawNext = searchParams.get("next");
  const next = rawNext && rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : null;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState(() => readContactIdentity().phone ?? "");
  const [smsConsent, setSmsConsent] = useState(false);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    if (roleLoading || !session) return;
    navigate(resolvePostAuthTarget(next, role), { replace: true });
  }, [roleLoading, session, role, next, navigate]);

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
            sms_consent_source: smsOptedIn ? "VisitorSignUp" : "",
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
      if (data.session) toast.success("Account created!");
      else toast.success("Check your email to confirm your account.");
    } catch (err) {
      if (err instanceof z.ZodError) toast.error(err.errors[0].message);
      else toast.error("Sign-up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-hero-grad">
      <Seo title="Create your account — RE Pro Business Credit" description="Create your RE Pro Business Credit account to view your custom plan." />
      <SiteHeader />
      <main id="main-content" className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1
              className="mt-4 font-semibold text-secondary"
              style={{ fontSize: "clamp(1.75rem, 3vw, 2.25rem)", lineHeight: 1.15 }}
            >
              Create your account
            </h1>
            <p className="mt-3 text-muted-foreground text-sm">
              Save your custom plan, track your tasks, and book your next session.
            </p>
          </div>

          <div className="rounded-3xl bg-white shadow-card border border-border/60 p-6 sm:p-8">
            <form onSubmit={handleSignUp} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="visitor-email">Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="visitor-email"
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
                <Label htmlFor="visitor-password">Password</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="visitor-password"
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
                idPrefix="visitor-signup"
                phone={phone}
                onPhoneChange={setPhone}
                smsConsent={smsConsent}
                onSmsConsentChange={setSmsConsent}
                agreed={agreed}
                onAgreedChange={setAgreed}
                disabled={loading}
              />
              <Button type="submit" size="lg" className="w-full rounded-full" disabled={loading || !agreed}>
                {loading ? "Creating account…" : "Create account"}
              </Button>
            </form>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary underline underline-offset-4">
              Log in
            </Link>
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}