import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useDocumentHead } from "@/hooks/useDocumentHead";

export default function NotFoundPage() {
  useDocumentHead({ title: "Page Not Found", noIndex: true });

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-7xl font-bold text-slate-200">404</p>
      <h1 className="mt-2 font-display text-xl font-bold text-ink">Page not found</h1>
      <p className="mt-2 text-sm text-body">The story you're looking for doesn't exist or has been moved.</p>
      <Button as={Link} to="/" variant="accent" className="mt-6">
        Back to homepage
      </Button>
    </div>
  );
}
