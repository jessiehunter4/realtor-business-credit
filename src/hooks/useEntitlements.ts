import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Entitlement = {
  product: string;
  status: string;
  purchased_at: string;
  expires_at: string | null;
};

/** Reads the signed-in user's active program entitlements. */
export function useEntitlements() {
  const [entitlements, setEntitlements] = useState<Entitlement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("product, status, purchased_at, expires_at")
        .eq("status", "active");

      if (cancelled) return;
      if (error) console.error("Failed to load entitlements:", error);
      setEntitlements(data ?? []);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const hasProduct = (product: string) =>
    entitlements.some(
      (e) =>
        e.product === product &&
        (!e.expires_at || new Date(e.expires_at).getTime() > Date.now()),
    );

  return { entitlements, loading, hasProduct };
}