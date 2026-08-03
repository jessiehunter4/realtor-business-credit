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
  // Pre-open a blank tab synchronously (inside the click handler) so popup
  // blockers allow it. We'll redirect this tab to Stripe once we have the URL.
  const checkoutWindow = window.open("about:blank", "_blank");
  if (checkoutWindow) {
    try {
      checkoutWindow.document.write(
        '<title>Opening secure checkout…</title><main style="font-family:system-ui,sans-serif;min-height:100vh;display:grid;place-items:center;margin:0;color:#0d1b2a"><p style="font-size:18px;font-weight:600">Opening secure Stripe checkout…</p></main>',
      );
    } catch {
      // ignore — some browsers restrict document.write on about:blank
    }
  }

  const { data: sessionData } = await supabase.auth.getSession();
  const navigate = (url: string) => {
    if (checkoutWindow && !checkoutWindow.closed) {
      try {
        checkoutWindow.location.href = url;
        return;
      } catch {
        // fall through
      }
    }
    const opened = window.open(url, "_blank", "noopener,noreferrer");
    if (opened) return;
    try {
      if (window.top && window.top !== window.self) {
        (window.top as Window).location.href = url;
        return;
      }
    } catch {
      // cross-origin top — last resort
    }
    window.location.assign(url);
  };

  if (!sessionData.session) {
    if (checkoutWindow && !checkoutWindow.closed) checkoutWindow.close();
    const redirect = encodeURIComponent(`/pricing?tier=${tierId}`);
    window.location.assign(`/login?next=${redirect}`);
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