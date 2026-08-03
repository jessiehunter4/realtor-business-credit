import { createClient, type SupabaseClient } from "npm:@supabase/supabase-js@2";

export type TierId = "self-paced" | "cohort" | "one-on-one";

export const PRODUCT_LABELS: Record<TierId, string> = {
  "self-paced": "DIY (Do it Yourself)",
  cohort: "Pro Cohort",
  "one-on-one": "Cohort Plus +",
};

const priceEnvByTier: Record<TierId, string> = {
  "self-paced": "STRIPE_PRICE_SELF_PACED",
  cohort: "STRIPE_PRICE_COHORT",
  "one-on-one": "STRIPE_PRICE_ONE_ON_ONE",
};

export function tierFromPriceId(priceId?: string | null): TierId | undefined {
  if (!priceId) return undefined;
  for (const [tier, envKey] of Object.entries(priceEnvByTier)) {
    if (Deno.env.get(envKey) === priceId) return tier as TierId;
  }
  return undefined;
}

export function serviceClient(): SupabaseClient {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );
}

export async function fetchCheckoutSession(sessionId: string) {
  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  if (!stripeKey) throw new Error("Stripe not configured");

  const url =
    `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}` +
    `?expand[]=line_items&expand[]=payment_intent`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${stripeKey}` },
  });
  const session = await res.json();
  if (!res.ok) {
    throw new Error(session?.error?.message || "Unable to retrieve Stripe session");
  }
  return session;
}

export type RecordResult = {
  success: boolean;
  status: string;
  product?: string;
  tierId?: TierId;
  amount?: number;
  currency?: string;
  sessionId: string;
  alreadyProcessed: boolean;
};

/**
 * Verifies a Stripe Checkout Session is paid, then records the payment and
 * grants the matching entitlement. Safe to call more than once for the same
 * session — duplicates are detected via the unique stripe_session_id.
 */
export async function recordPaymentFromSession(
  // deno-lint-ignore no-explicit-any
  session: any,
  expectedUserId?: string,
): Promise<RecordResult> {
  const sessionId = session?.id as string;
  const paymentStatus = session?.payment_status as string | undefined;
  const sessionStatus = session?.status as string | undefined;

  if (paymentStatus !== "paid" || (sessionStatus && sessionStatus !== "complete")) {
    return {
      success: false,
      status: paymentStatus ?? "unknown",
      sessionId,
      alreadyProcessed: false,
    };
  }

  const userId: string | undefined =
    session?.metadata?.user_id || session?.client_reference_id || undefined;

  if (expectedUserId && userId && userId !== expectedUserId) {
    throw new Error("Session does not belong to the current user");
  }

  const supabase = serviceClient();

  const { data: existing } = await supabase
    .from("payments")
    .select("id, product, amount, currency, status")
    .eq("stripe_session_id", sessionId)
    .maybeSingle();

  const priceId: string | undefined =
    session?.line_items?.data?.[0]?.price?.id ?? undefined;
  const tierId =
    (session?.metadata?.tier_id as TierId | undefined) ?? tierFromPriceId(priceId);
  const product = tierId ? PRODUCT_LABELS[tierId] ?? tierId : "RE Pro Program";
  const amount = (session?.amount_total ?? undefined) as number | undefined;
  const currency = (session?.currency ?? undefined) as string | undefined;

  if (existing) {
    return {
      success: true,
      status: "paid",
      product: existing.product ?? product,
      tierId,
      amount: existing.amount ?? amount,
      currency: existing.currency ?? currency,
      sessionId,
      alreadyProcessed: true,
    };
  }

  const paymentIntent =
    typeof session?.payment_intent === "string"
      ? session.payment_intent
      : session?.payment_intent?.id ?? null;
  const customerId =
    typeof session?.customer === "string" ? session.customer : session?.customer?.id ?? null;
  const email =
    session?.customer_details?.email ?? session?.customer_email ?? null;

  const { error: insertError } = await supabase.from("payments").insert({
    user_id: userId ?? null,
    email,
    stripe_session_id: sessionId,
    payment_intent: paymentIntent,
    customer_id: customerId,
    product,
    price_id: priceId ?? null,
    amount: amount ?? null,
    currency: currency ?? null,
    status: "paid",
    metadata: session?.metadata ?? null,
  });

  // A concurrent webhook may have inserted first — treat as already processed.
  if (insertError && !`${insertError.message}`.includes("duplicate key")) {
    console.error("payments insert failed:", insertError);
    throw new Error("Could not record payment");
  }

  if (userId && tierId) {
    const { error: subError } = await supabase.from("subscriptions").upsert(
      {
        user_id: userId,
        product: tierId,
        price_id: priceId ?? null,
        status: "active",
        purchased_at: new Date().toISOString(),
        stripe_session_id: sessionId,
        payment_intent: paymentIntent,
      },
      { onConflict: "user_id,product" },
    );
    if (subError) console.error("subscriptions upsert failed:", subError);
  }

  return {
    success: true,
    status: "paid",
    product,
    tierId,
    amount,
    currency,
    sessionId,
    alreadyProcessed: Boolean(insertError),
  };
}