// Admin-only: pushes the pricing-page copy onto the existing Stripe Products
// attached to the configured price IDs. Never creates products or touches prices.
import { requireAdmin, corsHeaders } from "../_shared/requireAdmin.ts";
import {
  TIER_COPY,
  priceEnvByTier,
  buildProductDescription,
  type PaidTierId,
} from "../_shared/tierCopy.ts";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

async function stripe(path: string, key: string, form?: URLSearchParams) {
  const res = await fetch(`https://api.stripe.com/v1/${path}`, {
    method: form ? "POST" : "GET",
    headers: {
      Authorization: `Bearer ${key}`,
      ...(form ? { "Content-Type": "application/x-www-form-urlencoded" } : {}),
    },
    body: form?.toString(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || `Stripe error on ${path}`);
  return data;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const guard = await requireAdmin(req);
  if (guard instanceof Response) return guard;

  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  if (!stripeKey) return json({ error: "Stripe not configured" }, 500);

  const results: Record<string, unknown>[] = [];

  for (const tierId of Object.keys(TIER_COPY) as PaidTierId[]) {
    const priceId = Deno.env.get(priceEnvByTier[tierId]);
    if (!priceId) {
      results.push({ tierId, skipped: "price not configured" });
      continue;
    }
    try {
      const price = await stripe(`prices/${priceId}`, stripeKey);
      const productId = typeof price.product === "string"
        ? price.product
        : price.product?.id;
      if (!productId) throw new Error("No product attached to price");

      const copy = TIER_COPY[tierId];
      const form = new URLSearchParams();
      form.append("name", copy.name);
      form.append("description", buildProductDescription(copy));
      form.append("metadata[tier_id]", tierId);

      const product = await stripe(`products/${productId}`, stripeKey, form);
      results.push({
        tierId,
        priceId,
        productId,
        name: product.name,
        description: product.description,
        unit_amount: price.unit_amount,
        currency: price.currency,
      });
    } catch (err) {
      results.push({ tierId, priceId, error: (err as Error).message });
    }
  }

  return json({ ok: true, results });
});