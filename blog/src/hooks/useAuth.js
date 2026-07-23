import { useSelector } from "react-redux";
import { USER_ROLES, ROLE_HIERARCHY } from "@/constants/roles";

export function useAuth() {
  const { user, isBootstrapping, status, error } = useSelector((state) => state.auth);

  const hasMinRole = (minRole) => {
    if (!user) return false;
    const userLevel = ROLE_HIERARCHY.indexOf(user.role);
    const minLevel = ROLE_HIERARCHY.indexOf(minRole);
    return userLevel >= minLevel;
  };

  return {
    user,
    isAuthenticated: !!user,
    isBootstrapping,
    status,
    error,
    hasMinRole,
    isAuthor: user ? hasMinRole(USER_ROLES.AUTHOR) : false,
    isEditor: user ? hasMinRole(USER_ROLES.EDITOR) : false,
    isAdmin: user ? hasMinRole(USER_ROLES.ADMIN) : false,
    isSuperAdmin: user?.role === USER_ROLES.SUPER_ADMIN,
  };
}
