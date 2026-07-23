import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold font-mono uppercase tracking-wide",
  {
    variants: {
      variant: {
        default: "border-transparent bg-ink text-paper",
        accent: "border-transparent bg-blue-50 text-accent",
        gold: "border-transparent bg-amber-50 text-amber-700",
        breaking: "border-transparent bg-red-50 text-breaking",
        outline: "border-line-strong text-body",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export function Badge({ className, variant, ...props }) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
