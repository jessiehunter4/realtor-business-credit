// Single source of truth for application roles and role-based routing.
// Adding a new role = add it to APP_ROLES + ROLE_HOME, then use it in
// route guards (`roles={[...]}`), nav config, and RLS policies.

export type AppRole = "admin" | "user";

export const APP_ROLES: AppRole[] = ["admin", "user"];

/** Where each role lands after authentication. */
export const ROLE_HOME: Record<AppRole, string> = {
  admin: "/admin",
  user: "/dashboard",
};

/** Users with no `user_roles` row are implicit visitors. */
export const DEFAULT_ROLE: AppRole = "user";

export function homeForRole(role: AppRole | null | undefined): string {
  return ROLE_HOME[role ?? DEFAULT_ROLE] ?? ROLE_HOME[DEFAULT_ROLE];
}

/** Route prefixes that are restricted to specific roles. */
const ROLE_RESTRICTED_PREFIXES: { prefix: string; roles: AppRole[] }[] = [
  { prefix: "/admin", roles: ["admin"] },
  { prefix: "/dashboard", roles: ["user"] },
];

/** True when the given role may open the given in-app path. */
export function isPathAllowedForRole(path: string, role: AppRole | null): boolean {
  const match = ROLE_RESTRICTED_PREFIXES.find((r) => path.startsWith(r.prefix));
  if (!match) return true;
  return !!role && match.roles.includes(role);
}

/**
 * Resolve a post-login destination: honor `next` only when the role is
 * actually allowed there, otherwise fall back to the role's home route.
 */
export function resolvePostAuthTarget(next: string | null, role: AppRole | null): string {
  const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : null;
  if (safeNext && isPathAllowedForRole(safeNext, role)) return safeNext;
  return homeForRole(role);
}
