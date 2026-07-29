import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export type CheckoutTierId = "self-paced" | "cohort" | "one-on-one";

export type CheckoutResult = { ok: true } | { ok: false; message: string };

function friendlyMessage(raw: string): string {
  const s = raw.toLowerCase();
  if (s.includes("priceid") || s.includes("tierid") || s.includes("price not configured")) {
    return "This plan isn't available for checkout yet. Please try another option or contact support.";
  }
  if (s.includes("unauthorized")) {
    return "Your session expired. Please sign in again.";
  }
  return "We couldn't start checkout. Please try again in a moment.";
}

export async function startCheckout(
  tierId: CheckoutTierId,
  leadId?: string,
): Promise<CheckoutResult> {
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) {
    const redirect = encodeURIComponent(`/pricing?tier=${tierId}`);
    window.location.assign(`/auth?redirect=${redirect}`);
    return { ok: true };
  }

  try {
    const { data, error } = await supabase.functions.invoke("create-checkout-session", {
      body: { tierId, leadId },
    });
    if (error) throw error;
    if (!data?.url) throw new Error("No checkout URL returned");
    window.location.assign(data.url);
    return { ok: true };
  } catch (err) {
    console.error("Checkout failed:", err);
    const message = friendlyMessage((err as Error).message || "");
    toast({
      title: "Checkout unavailable",
      description: message,
      variant: "destructive",
    });
    return { ok: false, message };
  }
}