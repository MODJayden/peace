import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { PageSpinner } from "@/components/common/Loaders";

export function ProtectedRoute() {
  const { isAuthenticated, isBootstrapping } = useAuth();
  const location = useLocation();

  if (isBootstrapping) return <PageSpinner />;
 /*  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} /> */;

  return <Outlet />;
}
