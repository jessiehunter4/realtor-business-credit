import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Props {
  intakeId: string;
  accessToken: string;
  defaultEmail: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  onAuthenticated: () => void;
}

type Mode = "signup" | "signin";

export default function PostPlanAuthCard({
  intakeId,
  accessToken,
  defaultEmail,
  firstName,
  lastName,
  phone,
  onAuthenticated,
}: Props) {
  const { toast } = useToast();
  const [mode, setMode] = useState<Mode>("signup");
  const [email, setEmail] = useState(defaultEmail);
  const [editingEmail, setEditingEmail] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordTooShort = password.length > 0 && password.length < 8;
  const passwordMismatch = mode === "signup" && confirm.length > 0 && confirm !== password;
  const canSubmit =
    !!email &&
    password.length >= 8 &&
    (mode === "signin" || confirm === password) &&
    !submitting;

  const linkIntake = async () => {
    const { error } = await supabase.functions.invoke("link-intake-to-user", {
      body: { intake_id: intakeId, access_token: accessToken },
    });
    if (error) throw new Error(error.message || "Failed to link plan to your account.");
  };

  const handleForgot = async () => {
    if (!email) return;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      toast({ title: "Couldn't send reset email", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Check your email", description: "We sent a password reset link." });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      if (mode === "signup") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              first_name: firstName ?? "",
              last_name: lastName ?? "",
              phone: phone ?? "",
            },
          },
        });
        if (signUpError) {
          const msg = signUpError.message || "";
          if (/already registered|already exists|user already/i.test(msg)) {
            setMode("signin");
            setError("You already have an account. Enter your password to sign in.");
            setSubmitting(false);
            return;
          }
          throw signUpError;
        }
        // With auto-confirm enabled, signUp returns a session.
        if (!data.session) {
          // Fall back to explicit sign-in.
          const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
          if (signInError) throw signInError;
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) {
          throw new Error(
            /invalid login credentials/i.test(signInError.message)
              ? "Incorrect password. Try again or reset your password."
              : signInError.message,
          );
        }
      }

      await linkIntake();
      onAuthenticated();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(msg);
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left border-t border-border pt-6 mt-2">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground">
          {mode === "signup" ? "Create your account to view your plan" : "Sign in to view your plan"}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          {mode === "signup"
            ? "You'll use this to return to your plan and track progress."
            : "We found an existing account for this email."}
        </p>
      </div>

      <div>
        <Label htmlFor="pp-email">Email</Label>
        <div className="flex gap-2 mt-1">
          <Input
            id="pp-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            readOnly={!editingEmail}
            className={!editingEmail ? "bg-muted/50" : ""}
            required
          />
          {!editingEmail && (
            <Button type="button" variant="ghost" size="sm" onClick={() => setEditingEmail(true)}>
              Edit
            </Button>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="pp-password">Password</Label>
        <div className="relative mt-1">
          <Input
            id="pp-password"
            type={showPw ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={passwordTooShort}
            aria-describedby="pp-password-hint"
            required
            minLength={8}
          />
          <button
            type="button"
            onClick={() => setShowPw((s) => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label={showPw ? "Hide password" : "Show password"}
          >
            {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <p id="pp-password-hint" className="text-xs text-muted-foreground mt-1">
          At least 8 characters.
        </p>
      </div>

      {mode === "signup" && (
        <div>
          <Label htmlFor="pp-confirm">Confirm password</Label>
          <Input
            id="pp-confirm"
            type={showPw ? "text" : "password"}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            aria-invalid={passwordMismatch}
            required
            className="mt-1"
          />
          {passwordMismatch && (
            <p className="text-xs text-destructive mt-1">Passwords don't match.</p>
          )}
        </div>
      )}

      {error && (
        <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded p-2">
          {error}
        </div>
      )}

      <Button type="submit" size="lg" disabled={!canSubmit} className="w-full">
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            {mode === "signup" ? "Creating your account…" : "Signing in…"}
          </>
        ) : (
          "View My Plan"
        )}
      </Button>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        {mode === "signup" ? (
          <button type="button" className="underline hover:text-foreground" onClick={() => { setMode("signin"); setError(null); }}>
            Already have an account? Sign in
          </button>
        ) : (
          <>
            <button type="button" className="underline hover:text-foreground" onClick={() => { setMode("signup"); setError(null); }}>
              Create a new account
            </button>
            <button type="button" className="underline hover:text-foreground" onClick={handleForgot}>
              Forgot password?
            </button>
          </>
        )}
      </div>

      <p className="text-[11px] text-muted-foreground text-center">
        By creating an account, you agree to our{" "}
        <a href="/terms" className="underline">Terms</a> and{" "}
        <a href="/privacy" className="underline">Privacy Policy</a>.
      </p>
    </form>
  );
}