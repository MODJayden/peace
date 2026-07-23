import { forwardRef } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-ink text-paper hover:bg-ink-soft",
        accent: "bg-accent text-white hover:bg-blue-700",
        gold: "bg-gold text-ink hover:bg-amber-500",
        outline: "border border-line-strong bg-transparent text-ink hover:bg-slate-100",
        ghost: "bg-transparent text-ink hover:bg-slate-100",
        link: "bg-transparent text-accent underline-offset-4 hover:underline p-0 h-auto",
        destructive: "bg-breaking text-white hover:bg-red-700",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = forwardRef(({ className, variant, size, as: Comp = "button", ...props }, ref) => (
  <Comp className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />
));
Button.displayName = "Button";

export { Button, buttonVariants };
