import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuthRole } from "@/hooks/useAuthRole";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
  const { role } = useAuthRole();
  const home = role === "admin" ? "/admin" : "/dashboard";
  const homeLabel = role === "admin" ? "Go to admin" : "Go to my dashboard";

  return (
    <div className="min-h-screen flex items-center justify-center bg-hero-grad px-4">
      <div className="max-w-md w-full text-center bg-white rounded-3xl shadow-card border border-border/60 p-8">
        <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-semibold text-secondary">You don't have access to this page</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          If you think this is a mistake, sign out and log back in with the right account.
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <Link to={home}><Button className="w-full rounded-full">{homeLabel}</Button></Link>
          <Button
            variant="outline"
            className="w-full rounded-full"
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.href = "/";
            }}
          >
            Sign out
          </Button>
        </div>
      </div>
    </div>
  );
}