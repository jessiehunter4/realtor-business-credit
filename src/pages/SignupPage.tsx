import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PhoneInput from "@/components/shared/PhoneInput";
import SiteHeader from "@/components/shared/SiteHeader";
import SiteFooter from "@/components/shared/SiteFooter";
import Seo from "@/components/shared/Seo";

const schema = z.object({
  firstName: z.string().trim().min(1, "First name required").max(80),
  lastName: z.string().trim().min(1, "Last name required").max(80),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().min(10, "Enter a valid phone").max(20),
  password: z.string().min(8, "Password must be at least 8 characters").max(100),
});

export default function SignupPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rawNext = searchParams.get("next");
  const next =
    rawNext && rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/dashboard";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session) navigate(next, { replace: true });
      }
    );
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate(next, { replace: true });
    });
    return () => subscription.unsubscribe();
  }, [navigate, next]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const v = schema.parse({ firstName, lastName, email, phone, password });
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email: v.email,
        password: v.password,
        options: {
          emailRedirectTo: `${window.location.origin}${next}`,
          data: {
            first_name: v.firstName,
            last_name: v.lastName,
            phone: v.phone,
          },
        },
      });
      if (error) {
        toast.error(
          error.message.includes("already registered")
            ? "This email is already registered. Please sign in instead."
            : error.message
        );
        return;
      }
      toast.success("Account created! Redirecting…");
    } catch (err) {
      if (err instanceof z.ZodError) toast.error(err.errors[0].message);
      else toast.error("Sign-up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Seo title="Create Account — RE Pro Business Credit" description="Save your custom plan and track your guide progress." />
      <SiteHeader />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Create your account</CardTitle>
            <CardDescription>Save your plan and track your progress.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required disabled={loading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required disabled={loading} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Mobile phone</Label>
                <PhoneInput id="phone" value={phone} onChange={setPhone} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} placeholder="Minimum 8 characters" />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating account…" : "Create account"}
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Already have an account?{" "}
                <Link to={`/login${next !== "/dashboard" ? `?next=${encodeURIComponent(next)}` : ""}`} className="text-primary font-semibold hover:underline">
                  Log in
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
}