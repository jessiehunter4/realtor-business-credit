// UI-only mock login page.
// TODO(auth): replace the handleSubmit navigation with
//   `await supabase.auth.signInWithPassword({ email, password })`
//   and redirect to /mock-dashboard (or a real /portal route) on success.
import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import SiteHeader from "@/components/shared/SiteHeader";
import SiteFooter from "@/components/shared/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Seo from "@/components/shared/Seo";

interface LocationState {
  firstName?: string;
  email?: string;
  contactId?: string;
}

const MockLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state ?? {}) as LocationState;

  const [email, setEmail] = useState(state.email ?? "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock: no validation, no request. Move on to the mock dashboard.
    navigate("/mock-dashboard", {
      state: { firstName: state.firstName, email },
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-hero-grad">
      <Seo title="Log in — Realtor Business Credit" description="Access your Realtor Business Credit portal." />
      <SiteHeader />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              <ShieldCheck className="h-3.5 w-3.5" />
              Welcome back
            </span>
            <h1
              className="mt-4 font-semibold text-secondary"
              style={{ fontSize: "clamp(1.75rem, 3vw, 2.25rem)", lineHeight: 1.15 }}
            >
              Log in to your Realtor Business Credit portal
            </h1>
            <p className="mt-3 text-muted-foreground text-sm">
              {state.firstName
                ? `Great to see you, ${state.firstName}. Set a password later — for now just log in to preview your portal.`
                : "Log in to view your custom plan, tasks, and next session."}
            </p>
          </div>

          <div className="rounded-3xl bg-white shadow-card border border-border/60 p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
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

              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <Checkbox
                  checked={remember}
                  onCheckedChange={(v) => setRemember(Boolean(v))}
                />
                Keep me signed in on this device
              </label>

              <Button type="submit" size="lg" className="w-full rounded-full">
                Log in
              </Button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-3 text-xs uppercase tracking-wide text-muted-foreground">
                    New here?
                  </span>
                </div>
              </div>

              <Link to="/mock-login" className="block">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="w-full rounded-full"
                >
                  Create an account
                </Button>
              </Link>
            </form>
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