// Mirrors src/data/pricingTiers.ts — the pricing page is the source of truth.
// Keep names, descriptions, and bullets in sync with that file.

export type PaidTierId = "self-paced" | "cohort" | "one-on-one";

export type TierCopy = {
  name: string;
  /** Short positioning line (the `who` field on the pricing page). */
  description: string;
  /** "What's Included" bullets — the tier's `features` list. */
  features: string[];
};

export const TIER_COPY: Record<PaidTierId, TierCopy> = {
  "self-paced": {
    name: "DIY (Do it Yourself)",
    description:
      "For Realtors who want the plan and want to run with it on their own.",
    features: [
      "Custom Business, Finance & Credit Plan (PDF + portal)",
      "Guide + 7-step action checklist",
      "Credit Suite vendor & tradeline directory access",
      "Email support",
    ],
  },
  cohort: {
    name: "Pro Cohort",
    description:
      "For Realtors who want structure, accountability, and a small group.",
    features: [
      "Everything in Self-Paced",
      "90-day cohort with 5–10 Realtors",
      "Weekly live coaching calls",
      "Private cohort community",
      "Credit Suite client portal + coach",
    ],
  },
  "one-on-one": {
    name: "Cohort Plus",
    description:
      "For Realtors and brokers who want private, high-touch guidance.",
    features: [
      "Everything in Cohort",
      "Private 1:1 coaching with Jessie",
      "Dedicated Credit Suite specialist",
      "Priority response + funding strategy sessions",
      "Quarterly plan reviews",
    ],
  },
};

export const priceEnvByTier: Record<PaidTierId, string> = {
  "self-paced": "STRIPE_PRICE_SELF_PACED",
  cohort: "STRIPE_PRICE_COHORT",
  "one-on-one": "STRIPE_PRICE_ONE_ON_ONE",
};

/**
 * Stripe product description — renders in the LEFT order-summary column of
 * Checkout. Plain text, capped at 350 chars. Bullets go on their own lines.
 */
export function buildProductDescription(tier: TierCopy): string {
  const header = tier.description;
  const bullets = tier.features.map((f) => `• ${f}`);
  let full = [header, ...bullets].join("\n");
  while (full.length > 350 && bullets.length > 0) {
    bullets.pop();
    full = [header, ...bullets].join("\n");
  }
  return full.length > 350 ? `${full.slice(0, 347).trimEnd()}...` : full;
}

/** Short reassurance line above the Pay button (inclusions live on the left). */
export function buildIncludedText(tier: TierCopy): string {
  const bullets = tier.features.map((f) => `• ${f}`).join("\n");
  return `What's included with ${tier.name}:\n${bullets}`;
}

/**
 * Best-effort: push the current pricing-page copy onto the Stripe Product that
 * is attached to `priceId`. Runs automatically before each Checkout session so
 * no manual admin sync is ever needed. Never throws.
 */
export async function syncStripeProductCopy(
  priceId: string,
  tier: TierCopy,
  tierId: string,
  stripeKey: string,
): Promise<void> {
  try {
    const priceRes = await fetch(`https://api.stripe.com/v1/prices/${priceId}`, {
      headers: { Authorization: `Bearer ${stripeKey}` },
    });
    const price = await priceRes.json();
    if (!priceRes.ok) throw new Error(price?.error?.message || "price lookup failed");

    const productId =
      typeof price.product === "string" ? price.product : price.product?.id;
    if (!productId) return;

    const description = buildProductDescription(tier);
    const form = new URLSearchParams();
    form.append("name", tier.name);
    form.append("description", description);
    form.append("metadata[tier_id]", tierId);

    const res = await fetch(`https://api.stripe.com/v1/products/${productId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: form.toString(),
    });
    if (!res.ok) {
      const err = await res.json();
      console.error("syncStripeProductCopy failed:", err?.error?.message);
    }
  } catch (err) {
    console.error("syncStripeProductCopy error:", (err as Error).message);
  }
}