// ============================================
// components/auth/RoleBasedRoute.jsx
// ============================================
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectUser,
  selectIsAuthenticated,
  selectIsLoading,
  selectIsInitialized,
} from "@/store/slices/authSlice";

export default function RoleBasedRoute({ children, allowedRoles = [] }) {
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

  // Not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user's role is allowed
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // Redirect to appropriate dashboard based on role
    const roleRedirects = {
      admin: "/admin/dashboard",
      editor: "/editor/dashboard",
      viewer: "/",
    };

    return <Navigate to={roleRedirects[user.role] || "/"} replace />;
  }

  return children;
}
