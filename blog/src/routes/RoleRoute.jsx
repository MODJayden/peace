import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { PageSpinner } from "@/components/common/Loaders";

export function RoleRoute({ minRole }) {
  const { isAuthenticated, isBootstrapping, hasMinRole } = useAuth();

  if (isBootstrapping) return <PageSpinner />;
/*   if (!isAuthenticated) return <Navigate to="/login" replace />; */
  if (!hasMinRole(minRole)) return <Navigate to="/" replace />;

  return <Outlet />;
}
