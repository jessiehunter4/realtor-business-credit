import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format an ISO date string as "Mon D, YYYY". Returns null if invalid/missing. */
export function formatPlanDate(input?: string | null): string | null {
  if (!input) return null;
  const d = new Date(input);
  if (isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

/** True when two timestamps represent meaningfully different moments (>60s apart). */
export function isMeaningfullyUpdated(createdAt?: string | null, updatedAt?: string | null): boolean {
  if (!createdAt || !updatedAt) return false;
  const a = new Date(createdAt).getTime();
  const b = new Date(updatedAt).getTime();
  if (isNaN(a) || isNaN(b)) return false;
  return Math.abs(b - a) > 60_000;
}
