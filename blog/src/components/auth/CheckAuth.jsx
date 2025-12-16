import { Navigate, useLocation } from "react-router-dom";

const CheckAuth = ({ user, isAuthenticated, children }) => {
  const location = useLocation();
  const path = location.pathname;

   console.log(user);
  console.log(isAuthenticated);

  if (user?.role === "viewer" && path.includes("admin")) {
    return <Navigate to="/" />;
  }
  if (user?.role === "admin" && path.includes("viewer")) {
    return <Navigate to="/admin/dashboard" />;
  }
  if (user?.role === "admin" && !isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return children;
};
export default CheckAuth;
