export type PaidTierId = "self-paced" | "cohort" | "one-on-one";

/** Lowest to highest. Used only for "upgrade" labelling and headline copy. */
export const TIER_ORDER: PaidTierId[] = ["self-paced", "cohort", "one-on-one"];

export const TIER_LABELS: Record<PaidTierId, string> = {
  "self-paced": "DIY (Do it Yourself)",
  cohort: "Pro Cohort",
  "one-on-one": "Cohort Plus +",
};

export type TierCapabilities = {
  /** Credit Suite / Lendavo implementation platforms. */
  platformAccess: boolean;
  /** Foundation provider directory + walkthroughs. */
  resourceLibrary: boolean;
};

export type EntitlementState = {
  /** Exactly the products the user purchased — never inferred. */
  owned: Set<PaidTierId>;
  /** Highest owned tier, for headline copy only. */
  highest: PaidTierId | null;
  capabilities: TierCapabilities;
};

export function buildEntitlementState(
  hasProduct: (product: string) => boolean,
  ready: boolean,
): EntitlementState {
  const owned = new Set<PaidTierId>(
    ready ? TIER_ORDER.filter((t) => hasProduct(t)) : [],
  );
  const highest =
    [...TIER_ORDER].reverse().find((t) => owned.has(t)) ?? null;

  return {
    owned,
    highest,
    capabilities: {
      platformAccess: owned.has("cohort") || owned.has("one-on-one"),
      resourceLibrary: owned.size > 0,
    },
  };
}

/** True when `tier` sits above every product the user owns. */
export function isUpgrade(tier: PaidTierId, highest: PaidTierId | null): boolean {
  if (!highest) return true;
  return TIER_ORDER.indexOf(tier) > TIER_ORDER.indexOf(highest);
}