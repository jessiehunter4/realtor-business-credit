import { useAuthRole } from "@/hooks/useAuthRole";
import type { AppRole } from "@/lib/roles";

/** Renders children only when the signed-in user holds one of `roles`. */
export default function ShowForRole({
  roles,
  children,
  fallback = null,
}: {
  roles: AppRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { role, loading } = useAuthRole();
  if (loading) return <>{fallback}</>;
  if (!role || !roles.includes(role)) return <>{fallback}</>;
  return <>{children}</>;
}
