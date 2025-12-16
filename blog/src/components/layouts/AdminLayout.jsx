// ============================================
// components/layouts/AdminLayout.jsx
// ============================================
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectAdmin } from "@/store/slices/authSlice";

export default function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const admin = useSelector(selectAdmin);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
     
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
