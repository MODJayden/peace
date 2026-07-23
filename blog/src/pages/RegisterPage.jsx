import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/form-elements";
import { Button } from "@/components/ui/button";
import { registerUser, clearAuthError } from "@/features/auth/authSlice";
import { useDocumentHead } from "@/hooks/useDocumentHead";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .regex(/^[a-z0-9_.]+$/, "Lowercase letters, numbers, underscores and dots only"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status } = useSelector((state) => state.auth);

  useDocumentHead({ title: "Create an account", noIndex: true });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerSchema) });

  const onSubmit = async ({ confirmPassword, ...values }) => {
    dispatch(clearAuthError());
    try {
      await dispatch(registerUser(values)).unwrap();
      toast.success("Account created! Please check your email to verify.");
      navigate("/login");
    } catch (err) {
      toast.error(err || "Registration failed");
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-10">
      <h1 className="font-display text-2xl font-bold text-ink">Join SirPeace</h1>
      <p className="mt-1 text-sm text-body">Create your free account to comment, bookmark, and follow authors.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <div>
          <Label htmlFor="name">Full name</Label>
          <Input id="name" {...register("name")} placeholder="Ama Mensah" />
          {errors.name && <p className="mt-1 text-xs text-breaking">{errors.name.message}</p>}
        </div>
        <div>
          <Label htmlFor="username">Username</Label>
          <Input id="username" {...register("username")} placeholder="amamensah" />
          {errors.username && <p className="mt-1 text-xs text-breaking">{errors.username.message}</p>}
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} placeholder="you@example.com" />
          {errors.email && <p className="mt-1 text-xs text-breaking">{errors.email.message}</p>}
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" {...register("password")} placeholder="At least 8 characters" />
          {errors.password && <p className="mt-1 text-xs text-breaking">{errors.password.message}</p>}
        </div>
        <div>
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input id="confirmPassword" type="password" {...register("confirmPassword")} />
          {errors.confirmPassword && <p className="mt-1 text-xs text-breaking">{errors.confirmPassword.message}</p>}
        </div>
        <Button type="submit" variant="accent" className="w-full" disabled={status === "loading"}>
          {status === "loading" ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-body">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-accent hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
