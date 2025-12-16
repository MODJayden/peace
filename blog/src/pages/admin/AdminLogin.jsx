import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  loginWithGoogle,
  selectIsLoading,
  selectError,
  selectIsAuthenticated,
} from "@/store/slices/authSlice";
import { useEffect } from "react";
import { account } from "@/lib/appwrite"; // Import account directly

export default function AdminLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleGoogleLogin = () => {
    dispatch(loginWithGoogle());
  };

  // DIAGNOSTIC: Test OAuth directly (remove after testing)
  /* const handleDirectOAuth = async () => {
    try {
      console.log("[DIAGNOSTIC] Testing direct OAuth...");
      console.log("[DIAGNOSTIC] Current origin:", window.location.origin);
      console.log(
        "[DIAGNOSTIC] Success URL:",
        `${window.location.origin}/auth/callback`
      );
      console.log(
        "[DIAGNOSTIC] Failure URL:",
        `${window.location.origin}/admin/login`
      );

      await account.createOAuth2Session(
        "google",
        `${window.location.origin}/auth/callback`,
        `${window.location.origin}/admin/login`
      );
    } catch (err) {
      console.error("[DIAGNOSTIC] Direct OAuth failed:", err);
      alert("OAuth Error: " + err.message);
    }
  }; */

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h1>
          <p className="text-gray-600">Sign in to manage your blog</p>
        </div>

        {(error || location.state?.error) && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 mr-2 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{error || location.state?.error}</span>
            </div>
          </div>
        )}

        {/* Normal Redux Login Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium mb-4"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-700"></div>
              Authenticating...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </>
          )}
        </button>

        {/* DIAGNOSTIC: Direct OAuth Test Button */}
      {/*   <button
          onClick={handleDirectOAuth}
          className="w-full flex items-center justify-center gap-3 bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition font-medium"
        >
          🔍 Test Direct OAuth (Debug)
        </button>
        <p className="text-xs text-gray-500 text-center mt-2">
          Click this to test OAuth without Redux. Check console for logs.
        </p> */}

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Admin access only</p>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <button
            onClick={() => navigate("/")}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            ← Back to Blog
          </button>
        </div>
      </div>
    </div>
  );
}
