import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

type TierId = "self-paced" | "cohort" | "one-on-one";

const priceEnvByTier: Record<TierId, string> = {
  "self-paced": "STRIPE_PRICE_SELF_PACED",
  cohort: "STRIPE_PRICE_COHORT",
  "one-on-one": "STRIPE_PRICE_ONE_ON_ONE",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) return json({ error: "Stripe not configured" }, 500);

    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return json({ error: "Unauthorized" }, 401);
    }
    const token = authHeader.replace("Bearer ", "");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: claimsData, error: claimsErr } = await supabase.auth.getClaims(token);
    if (claimsErr || !claimsData?.claims) return json({ error: "Unauthorized" }, 401);
    const userId = claimsData.claims.sub as string;
    const userEmail = (claimsData.claims.email as string | undefined) ?? undefined;

    let body: { priceId?: string; tierId?: TierId; leadId?: string } = {};
    try {
      body = await req.json();
    } catch {
      return json({ error: "Invalid JSON body" }, 400);
    }

    // Resolve price ID: prefer tierId (server-side allowlist); else validate priceId against known env values.
    const allowedPrices = new Set(
      Object.values(priceEnvByTier)
        .map((k) => Deno.env.get(k))
        .filter((v): v is string => !!v),
    );

    let priceId: string | undefined;
    if (body.tierId && body.tierId in priceEnvByTier) {
      priceId = Deno.env.get(priceEnvByTier[body.tierId]);
      if (!priceId) return json({ error: `Price not configured for tier ${body.tierId}` }, 400);
    } else if (body.priceId && allowedPrices.has(body.priceId)) {
      priceId = body.priceId;
    } else {
      return json({ error: "Invalid or missing priceId/tierId" }, 400);
    }

    const origin =
      req.headers.get("origin") ||
      req.headers.get("referer")?.replace(/\/[^/]*$/, "") ||
      "https://realtorbusinesscredit.com";

    const form = new URLSearchParams();
    form.append("mode", "payment");
    form.append("line_items[0][price]", priceId);
    form.append("line_items[0][quantity]", "1");
    form.append("success_url", `${origin}/checkout?status=success&session_id={CHECKOUT_SESSION_ID}`);
    form.append("cancel_url", `${origin}/pricing?status=cancelled`);
    form.append("client_reference_id", userId);
    form.append("metadata[user_id]", userId);
    if (body.tierId) form.append("metadata[tier_id]", body.tierId);
    if (body.leadId) form.append("metadata[lead_id]", body.leadId);
    if (userEmail) form.append("customer_email", userEmail);
    form.append("allow_promotion_codes", "true");

    const stripeRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: form.toString(),
    });

    const session = await stripeRes.json();
    if (!stripeRes.ok) {
      console.error("Stripe error:", session);
      return json({ error: session?.error?.message || "Stripe error" }, 502);
    }

    return json({ url: session.url, id: session.id });
  } catch (err) {
    console.error("create-checkout-session error:", err);
    return json({ error: (err as Error).message || "Internal error" }, 500);
  }
});