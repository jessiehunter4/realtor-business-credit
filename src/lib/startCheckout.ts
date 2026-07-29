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
  const isFramed = (() => {
    try {
      return window.top !== window.self;
    } catch {
      return true;
    }
  })();
  const checkoutWindow = isFramed ? window.open("", "_blank") : null;
  if (checkoutWindow) {
    checkoutWindow.document.title = "Opening secure checkout";
    checkoutWindow.document.body.innerHTML =
      '<main style="font-family: system-ui, sans-serif; min-height: 100vh; display: grid; place-items: center; margin: 0; color: #0d1b2a;"><p style="font-size: 18px; font-weight: 600;">Opening secure Stripe checkout…</p></main>';
  }

  const { data: sessionData } = await supabase.auth.getSession();
  const navigate = (url: string) => {
    if (checkoutWindow && !checkoutWindow.closed) {
      checkoutWindow.opener = null;
      checkoutWindow.location.replace(url);
      return;
    }
    try {
      if (window.top && window.top !== window.self) {
        window.top.location.href = url;
        return;
      }
    } catch {
      // Cross-origin top frame — fall through to new tab.
    }
    const opened = window.open(url, "_blank", "noopener,noreferrer");
    if (!opened) window.location.assign(url);
  };

  if (!sessionData.session) {
    if (checkoutWindow && !checkoutWindow.closed) checkoutWindow.close();
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
    navigate(data.url);
    return { ok: true };
  } catch (err) {
    if (checkoutWindow && !checkoutWindow.closed) checkoutWindow.close();
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