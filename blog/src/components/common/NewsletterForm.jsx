import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { subscribeNewsletter } from "@/features/newsletter/newsletterSlice";
import { cn } from "@/lib/utils";

export function NewsletterForm({ variant = "light", source = "website" }) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const isDark = variant === "dark";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    try {
      await dispatch(subscribeNewsletter({ email, source })).unwrap();
      toast.success("You're subscribed! Check your inbox to confirm.");
      setEmail("");
    } catch (err) {
      toast.error(err || "Could not subscribe. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className={cn(
          "flex-1 rounded-md border px-4 py-2.5 text-sm focus-visible:outline-none",
          isDark
            ? "border-slate-700 bg-slate-800 text-paper placeholder:text-slate-500 focus-visible:border-gold"
            : "border-line-strong bg-surface text-ink focus-visible:border-accent"
        )}
      />
      <Button type="submit" variant={isDark ? "gold" : "accent"} disabled={submitting}>
        {submitting ? "Subscribing..." : "Subscribe"}
      </Button>
    </form>
  );
}
