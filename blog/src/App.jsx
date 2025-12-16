// ============================================
// App.jsx
// ============================================
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { checkAuthSession } from "@/store/slices/authSlice";

// Public Pages
import Home from "@/pages/Home";
/* import BlogList from "@/pages/BlogList";
import BlogPost from "@/pages/BlogPost";
import About from "@/pages/About";
import Contact from "@/pages/Contact"; */

// Admin Pages
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
/* import CreatePost from "@/pages/admin/CreatePost";
import EditPost from "@/pages/admin/EditPost";
import ManagePosts from "@/pages/admin/ManagePosts"; */

// Components
import AuthCallback from "@/components/auth/AuthCallback";
import AdminRoute from "@/components/auth/AdminRoute";
import AdminLayout from "@/components/layouts/AdminLayout";
import PublicLayout from "@/components/layouts/PublicLayout";

function App() {
  const dispatch = useDispatch();

  // Check for existing admin session on mount (silent check)
  useEffect(() => {
    dispatch(checkAuthSession());
  }, [dispatch]);

  return (
    <Routes>
      {/* Public Routes - No authentication required */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        {/*  <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} /> */}
      </Route>

      {/* Auth Callback */}
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* Admin Login - Public but redirects if already authenticated */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected Admin Routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        {/*  <Route path="posts" element={<ManagePosts />} />
        <Route path="posts/new" element={<CreatePost />} />
        <Route path="posts/edit/:id" element={<EditPost />} /> */}
      </Route>

      {/* 404 - Redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
