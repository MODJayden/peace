import { useSelector } from "react-redux";
import {
  selectAdmin,
  selectIsAuthenticated,
  selectIsLoading,
  selectError,
} from "@/store/slices/authSlice";

export function useAuth() {
  const admin = useSelector(selectAdmin);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);

  return {
    admin,
    isAuthenticated,
    isAdmin: isAuthenticated, // Since only admins can authenticate
    isLoading,
    error,
  };
}
