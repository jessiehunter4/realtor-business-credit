import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import { DEFAULT_ROLE, type AppRole } from "@/lib/roles";
import { clearSessionStorage } from "@/lib/signOut";

export type { AppRole };

interface AuthRoleContextValue {
  session: Session | null;
  role: AppRole | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

const AuthRoleContext = createContext<AuthRoleContextValue | undefined>(undefined);

async function fetchRole(userId: string): Promise<AppRole | null> {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  if (error || !data) return null;
  if (data.some((r) => r.role === "admin")) return "admin";
  if (data.some((r) => r.role === "user")) return "user";
  // No row = implicit visitor
  return DEFAULT_ROLE;
}

export function AuthRoleProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (s: Session | null) => {
    setSession(s);
    if (!s) {
      setRole(null);
      setLoading(false);
      return;
    }
    // Keep consumers in a loading state until the role for THIS session is
    // resolved, otherwise they route on a stale role.
    setLoading(true);
    const r = await fetchRole(s.user.id);
    setRole(r);
    setLoading(false);
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      // Sign-out (including token expiry or sign-out in another tab) and a
      // fresh sign-in both start from a clean sessionStorage so no scroll or
      // navigation state leaks between users on a shared browser.
      if (_e === "SIGNED_OUT" || _e === "SIGNED_IN") clearSessionStorage();
      // Defer supabase call to avoid deadlock inside the listener
      setTimeout(() => { load(s); }, 0);
    });
    supabase.auth.getSession().then(({ data: { session: s } }) => load(s));
    return () => subscription.unsubscribe();
  }, [load]);

  const refresh = useCallback(async () => {
    const { data: { session: s } } = await supabase.auth.getSession();
    await load(s);
  }, [load]);

  return (
    <AuthRoleContext.Provider value={{ session, role, loading, refresh }}>
      {children}
    </AuthRoleContext.Provider>
  );
}

export function useAuthRole(): AuthRoleContextValue {
  const ctx = useContext(AuthRoleContext);
  if (!ctx) throw new Error("useAuthRole must be used within AuthRoleProvider");
  return ctx;
}