// ============================================
// components/auth/ProtectedRoute.jsx
// ============================================
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectIsAuthenticated,
  selectIsLoading,
  selectUser,
  selectIsInitialized,
} from "@/store/slices/authSlice";

export default function ProtectedRoute({
  children,
  requiredRole = null,
  redirectTo = "/",
}) {
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsLoading);
  const isInitialized = useSelector(selectIsInitialized);
  const user = useSelector(selectUser);

  // Wait for initial auth check
  if (!isInitialized || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check role-based access
  if (requiredRole && user?.role !== requiredRole) {
    // Redirect based on user role
    const roleRedirects = {
      admin: "/admin/dashboard",
      editor: "/editor/dashboard",
      viewer: "/",
    };

    return <Navigate to={roleRedirects[user.role] || "/"} replace />;
  }

  return children;
}
