import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  handleOAuthCallback,
  selectIsLoading,
  selectError,
} from "@/store/slices/authSlice";

export default function AuthCallback() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const completeAuth = async () => {
      // Check if OAuth failed immediately
      const errorParam = searchParams.get("error");
      if (errorParam) {
        console.error("[AuthCallback] OAuth error from URL:", errorParam);
        navigate("/admin/login", {
          replace: true,
          state: { error: "Authentication failed. Please try again." },
        });
        return;
      }

      // Log URL parameters for debugging
      console.log("[AuthCallback] URL params:", {
        userId: searchParams.get("userId"),
        secret: searchParams.get("secret"),
        allParams: Object.fromEntries(searchParams.entries()),
      });

      try {
        // Wait longer for session to establish
        console.log("[AuthCallback] Waiting for session to establish...");
        await new Promise((resolve) => setTimeout(resolve, 2500));

        await dispatch(handleOAuthCallback()).unwrap();
        console.log("[AuthCallback] Admin authenticated, redirecting...");
        navigate("/admin/dashboard", { replace: true });
      } catch (err) {
        console.error("[AuthCallback] Admin authentication failed:", err);

        // Retry once with longer delay
        if (retryCount < 1) {
          console.log(
            "[AuthCallback] Retrying authentication after longer delay..."
          );
          setRetryCount((prev) => prev + 1);
          await new Promise((resolve) => setTimeout(resolve, 3000));

          try {
            await dispatch(handleOAuthCallback()).unwrap();
            console.log(
              "[AuthCallback] Admin authenticated on retry, redirecting..."
            );
            navigate("/admin/dashboard", { replace: true });
            return;
          } catch (retryErr) {
            console.error("[AuthCallback] Retry failed:", retryErr);
          }
        }

        navigate("/admin/login", {
          replace: true,
          state: {
            error:
              "Authentication failed. Please check your admin permissions and try again.",
          },
        });
      }
    };

    completeAuth();
  }, [dispatch, navigate, searchParams, retryCount]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
          <div className="mb-4">
            <svg
              className="w-16 h-16 text-red-500 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/admin/login")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">
          {retryCount > 0
            ? "Retrying authentication..."
            : "Verifying admin credentials..."}
        </p>
        <p className="text-gray-500 text-sm mt-2">Please wait...</p>
      </div>
    </div>
  );
}
