import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Mail } from "lucide-react";
import { NewsletterForm } from "@/components/common/NewsletterForm";
import { unsubscribeNewsletter } from "@/features/newsletter/newsletterSlice";
import { useDocumentHead } from "@/hooks/useDocumentHead";

const BENEFITS = [
  "Breaking news alerts the moment major stories break",
  "A curated weekly digest of the stories that matter most",
  "Early access to investigative features and special reports",
];

export default function NewsletterPage() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { message, status } = useSelector((state) => state.newsletter);
  const isUnsubscribe = searchParams.get("action") === "unsubscribe";

  useDocumentHead({ title: "Newsletter" });

  useEffect(() => {
    if (isUnsubscribe) {
      const email = searchParams.get("email");
      const token = searchParams.get("token");
      if (email) dispatch(unsubscribeNewsletter({ email, token }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUnsubscribe]);

  if (isUnsubscribe) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 py-14 text-center">
        <Mail size={40} className="text-muted" />
        <h1 className="mt-4 font-display text-xl font-bold text-ink">
          {status === "succeeded" ? "You've been unsubscribed" : "Processing..."}
        </h1>
        {message && <p className="mt-2 text-sm text-body">{message}</p>}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <Mail size={40} className="mx-auto text-accent" />
      <h1 className="mt-4 font-display text-3xl font-bold text-ink">The SirPeace Newsletter</h1>
      <p className="mt-3 text-body">Ghana's stories, delivered straight to your inbox — free, always.</p>

      <ul className="mx-auto mt-8 max-w-md space-y-3 text-left">
        {BENEFITS.map((benefit) => (
          <li key={benefit} className="flex items-start gap-2.5 text-sm text-ink-soft">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
            {benefit}
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <NewsletterForm source="newsletter-page" />
      </div>
    </div>
  );
}
