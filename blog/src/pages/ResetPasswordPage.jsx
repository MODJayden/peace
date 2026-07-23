import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/form-elements";
import { Button } from "@/components/ui/button";
import { resetPassword } from "@/features/auth/authSlice";
import { useDocumentHead } from "@/hooks/useDocumentHead";

const schema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function ResetPasswordPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const id = searchParams.get("id");

  useDocumentHead({ title: "Set new password", noIndex: true });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async ({ newPassword }) => {
    if (!token || !id) {
      toast.error("This reset link is invalid or has expired");
      return;
    }
    try {
      await dispatch(resetPassword({ token, id, newPassword })).unwrap();
      toast.success("Password reset. Please log in.");
      navigate("/login");
    } catch (err) {
      toast.error(err || "Could not reset password");
    }
  };

  if (!token || !id) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-10 text-center">
        <h1 className="font-display text-xl font-bold text-ink">Invalid link</h1>
        <p className="mt-2 text-sm text-body">
          This password reset link is missing required information. Please request a new one.
        </p>
        <Link to="/forgot-password" className="mt-4 font-semibold text-accent hover:underline">
          Request new link
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-10">
      <h1 className="font-display text-2xl font-bold text-ink">Choose a new password</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <div>
          <Label htmlFor="newPassword">New password</Label>
          <Input id="newPassword" type="password" {...register("newPassword")} />
          {errors.newPassword && <p className="mt-1 text-xs text-breaking">{errors.newPassword.message}</p>}
        </div>
        <div>
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input id="confirmPassword" type="password" {...register("confirmPassword")} />
          {errors.confirmPassword && <p className="mt-1 text-xs text-breaking">{errors.confirmPassword.message}</p>}
        </div>
        <Button type="submit" variant="accent" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Reset password"}
        </Button>
      </form>
    </div>
  );
}
