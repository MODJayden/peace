import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/form-elements";
import { Button } from "@/components/ui/button";
import { loginUser, clearAuthError } from "@/features/auth/authSlice";
import { useDocumentHead } from "@/hooks/useDocumentHead";

const loginSchema = z.object({
  identifier: z.string().min(1, "Email or username is required"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { status } = useSelector((state) => state.auth);

  useDocumentHead({ title: "Log in", noIndex: true });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values) => {
    dispatch(clearAuthError());
    try {
      await dispatch(loginUser(values)).unwrap();
      toast.success("Welcome back!");
      navigate(location.state?.from?.pathname || "/", { replace: true });
    } catch (err) {
      toast.error(err || "Login failed");
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-10">
      <h1 className="font-display text-2xl font-bold text-ink">Welcome back</h1>
      <p className="mt-1 text-sm text-body">Log in to continue reading SirPeace.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <div>
          <Label htmlFor="identifier">Email or username</Label>
          <Input id="identifier" {...register("identifier")} placeholder="you@example.com" />
          {errors.identifier && <p className="mt-1 text-xs text-breaking">{errors.identifier.message}</p>}
        </div>
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-xs font-medium text-accent hover:underline">
              Forgot password?
            </Link>
          </div>
          <Input id="password" type="password" {...register("password")} placeholder="••••••••" />
          {errors.password && <p className="mt-1 text-xs text-breaking">{errors.password.message}</p>}
        </div>
        <Button type="submit" variant="accent" className="w-full" disabled={status === "loading"}>
          {status === "loading" ? "Logging in..." : "Log in"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-body">
        Don't have an account?{" "}
        <Link to="/register" className="font-semibold text-accent hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
