import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Lock, Eye, EyeOff, Loader2 } from "lucide-react";
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
import { useAuthRole } from "@/hooks/useAuthRole";
import { resolvePostAuthTarget } from "@/lib/roles";

const passwordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters").max(100),
    confirm: z.string().min(6, "Confirm password is required").max(100),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const next = searchParams.get("next");
  const { session: activeSession, role, loading: roleLoading } = useAuthRole();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validLink, setValidLink] = useState<boolean | null>(null);
  const [updated, setUpdated] = useState(false);
  const [otpEmail, setOtpEmail] = useState(searchParams.get("email") ?? "");
  const [otpCode, setOtpCode] = useState("");
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    // Recovery links can arrive in three shapes depending on the auth flow:
    //   #access_token=...&type=recovery   (implicit)
    //   ?code=...                          (PKCE)
    //   ?token_hash=...&type=recovery      (verify redirect)
    let cancelled = false;
    const resolve = async () => {
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const query = new URLSearchParams(window.location.search);

      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");
      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (!cancelled) setValidLink(!error);
        return;
      }

      const code = query.get("code");
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!cancelled) setValidLink(!error);
        return;
      }

      const tokenHash = query.get("token_hash") ?? hashParams.get("token_hash");
      if (tokenHash) {
        const { error } = await supabase.auth.verifyOtp({ type: "recovery", token_hash: tokenHash });
        if (!cancelled) setValidLink(!error);
        return;
      }

      // Already-established recovery session (e.g. detectSessionInUrl ran first).
      const { data } = await supabase.auth.getSession();
      if (!cancelled) setValidLink(Boolean(data.session));
    };
    void resolve();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifying(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: otpEmail.trim(),
        token: otpCode.trim(),
        type: "recovery",
      });
      if (error) {
        toast.error(error.message);
        return;
      }
      setValidLink(true);
      toast.success("Code verified — choose a new password.");
    } finally {
      setVerifying(false);
    }
  };

  useEffect(() => {
    if (!updated || roleLoading || !activeSession) return;

    if (role === "admin") {
      // Admin accounts must use the admin sign-in page.
      signOutAndClear({ redirectTo: null }).then(() =>
        toast.error("Invalid email or password"),
      );
      return;
    }

    toast.success("Password updated successfully!");
    navigate(resolvePostAuthTarget(next && next.startsWith("/") && !next.startsWith("//") ? next : null, role), {
      replace: true,
    });
  }, [updated, roleLoading, activeSession, role, next, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validated = passwordSchema.parse({ password, confirm });
      setLoading(true);
      const { error } = await supabase.auth.updateUser({ password: validated.password });
      if (error) {
        toast.error(error.message);
        return;
      }
      setUpdated(true);
    } catch (err) {
      if (err instanceof z.ZodError) toast.error(err.errors[0].message);
      else toast.error("Could not update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-hero-grad">
      <Seo title="Reset Password — RE Pro Business Credit" description="Set a new password for your RE Pro Business Credit portal." />
      <SiteHeader />

      <main id="main-content" className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1
              className="mt-4 font-semibold text-secondary"
              style={{ fontSize: "clamp(1.75rem, 3vw, 2.25rem)", lineHeight: 1.15 }}
            >
              Set a new password
            </h1>
          </div>

          <div className="rounded-3xl bg-white shadow-card border border-border/60 p-6 sm:p-8">
            {validLink === null ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : !validLink ? (
              <form onSubmit={handleVerifyCode} className="space-y-5">
                <p className="text-sm text-muted-foreground">
                  Open the reset email we sent you. Click the link, or enter the 6-digit
                  code from the email below.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="reset-otp-email">Email</Label>
                  <Input
                    id="reset-otp-email"
                    type="email"
                    value={otpEmail}
                    onChange={(e) => setOtpEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    disabled={verifying}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reset-otp-code">Reset code</Label>
                  <Input
                    id="reset-otp-code"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 8))}
                    placeholder="123456"
                    required
                    disabled={verifying}
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full rounded-full"
                  disabled={verifying || otpCode.length < 6}
                >
                  {verifying ? "Verifying…" : "Verify code"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full rounded-full"
                  onClick={() => navigate("/login")}
                >
                  Back to log in
                </Button>
              </form>
            ) : updated ? (
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  Your password has been updated. Redirecting you to your portal…
                </p>
                <div className="flex items-center justify-center py-2">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="reset-password">New password</Label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="reset-password"
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
                <div className="space-y-2">
                  <Label htmlFor="reset-confirm">Confirm new password</Label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="reset-confirm"
                      type={showConfirm ? "text" : "password"}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="Re-enter your password"
                      required
                      disabled={loading}
                      className="pl-9 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-muted-foreground hover:text-secondary"
                    >
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full rounded-full"
                  disabled={loading}
                >
                  {loading ? "Updating…" : "Update password"}
                </Button>
              </form>
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
}
