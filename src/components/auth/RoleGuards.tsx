import { Navigate, useLocation } from "react-router-dom";
import { useAuthRole, type AppRole } from "@/hooks/useAuthRole";

function Spinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  );
}

export function RequireRole({
  roles,
  children,
}: {
  roles: AppRole[];
  children: React.ReactNode;
}) {
  const { session, role, loading } = useAuthRole();
  const location = useLocation();
  if (loading) return <Spinner />;
  if (!session) {
    return <Navigate to={`/mock-login?next=${encodeURIComponent(location.pathname)}`} replace />;
  }
  if (!role || !roles.includes(role)) return <Navigate to="/unauthorized" replace />;
  return <>{children}</>;
}

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuthRole();
  const location = useLocation();
  if (loading) return <Spinner />;
  if (!session) return <Navigate to={`/mock-login?next=${encodeURIComponent(location.pathname)}`} replace />;
  return <>{children}</>;
}

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { session, role, loading } = useAuthRole();
  const location = useLocation();
  if (loading) return <Spinner />;
  if (!session) return <Navigate to={`/mock-login?next=${encodeURIComponent(location.pathname)}`} replace />;
  if (role !== "admin") return <Navigate to="/unauthorized" replace />;
  return <>{children}</>;
}

export function RequireVisitor({ children }: { children: React.ReactNode }) {
  const { session, role, loading } = useAuthRole();
  const location = useLocation();
  if (loading) return <Spinner />;
  if (!session) return <Navigate to={`/mock-login?next=${encodeURIComponent(location.pathname)}`} replace />;
  if (role === "admin") return <Navigate to="/admin" replace />;
  return <>{children}</>;
}