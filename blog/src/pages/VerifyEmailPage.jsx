import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { CheckCircle2, XCircle } from "lucide-react";
import { verifyEmail } from "@/features/auth/authSlice";
import { useDocumentHead } from "@/hooks/useDocumentHead";

export default function VerifyEmailPage() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading"); // loading | success | error

  useDocumentHead({ title: "Verify email", noIndex: true });

  useEffect(() => {
    const token = searchParams.get("token");
    const id = searchParams.get("id");
    if (!token || !id) {
      setStatus("error");
      return;
    }
    dispatch(verifyEmail({ token, id }))
      .unwrap()
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
  }, [dispatch, searchParams]);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 py-10 text-center">
      {status === "loading" && <p className="text-sm text-muted">Verifying your email...</p>}

      {status === "success" && (
        <>
          <CheckCircle2 size={48} className="text-success" />
          <h1 className="mt-4 font-display text-xl font-bold text-ink">Email verified!</h1>
          <p className="mt-2 text-sm text-body">Your account is now fully active.</p>
          <Link to="/login" className="mt-5 font-semibold text-accent hover:underline">
            Continue to login
          </Link>
        </>
      )}

      {status === "error" && (
        <>
          <XCircle size={48} className="text-breaking" />
          <h1 className="mt-4 font-display text-xl font-bold text-ink">Verification failed</h1>
          <p className="mt-2 text-sm text-body">This link is invalid or has expired.</p>
          <Link to="/login" className="mt-5 font-semibold text-accent hover:underline">
            Back to login
          </Link>
        </>
      )}
    </div>
  );
}
