import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/form-elements";
import { Button } from "@/components/ui/button";
import { forgotPassword } from "@/features/auth/authSlice";
import { useDocumentHead } from "@/hooks/useDocumentHead";

const schema = z.object({ email: z.string().email("Please enter a valid email") });

export default function ForgotPasswordPage() {
  const dispatch = useDispatch();
  const [sent, setSent] = useState(false);
  useDocumentHead({ title: "Forgot password", noIndex: true });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async ({ email }) => {
    await dispatch(forgotPassword(email));
    setSent(true);
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-10">
      <h1 className="font-display text-2xl font-bold text-ink">Reset your password</h1>
      <p className="mt-1 text-sm text-body">Enter your email and we'll send you a reset link.</p>

      {sent ? (
        <div className="mt-6 rounded-lg border border-line bg-slate-50 p-4 text-sm text-body">
          If an account with that email exists, a reset link has been sent. Please check your inbox.
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} placeholder="you@example.com" />
            {errors.email && <p className="mt-1 text-xs text-breaking">{errors.email.message}</p>}
          </div>
          <Button type="submit" variant="accent" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send reset link"}
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-body">
        <Link to="/login" className="font-semibold text-accent hover:underline">
          Back to login
        </Link>
      </p>
    </div>
  );
}
