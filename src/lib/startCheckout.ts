import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export type CheckoutTierId = "self-paced" | "cohort" | "one-on-one";

export async function startCheckout(tierId: CheckoutTierId, leadId?: string) {
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) {
    const redirect = encodeURIComponent(`/pricing?tier=${tierId}`);
    window.location.assign(`/auth?redirect=${redirect}`);
    return;
  }

  try {
    const { data, error } = await supabase.functions.invoke("create-checkout-session", {
      body: { tierId, leadId },
    });
    if (error) throw error;
    if (!data?.url) throw new Error("No checkout URL returned");
    window.location.assign(data.url);
  } catch (err) {
    console.error("Checkout failed:", err);
    toast({
      title: "Checkout unavailable",
      description: (err as Error).message || "Please try again in a moment.",
      variant: "destructive",
    });
  }
}