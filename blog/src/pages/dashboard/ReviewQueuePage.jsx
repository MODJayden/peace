import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { CheckCircle2, XCircle, ClipboardCheck } from "lucide-react";
import { fetchReviewQueue, reviewArticle } from "@/features/articles/articleSlice";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/form-elements";
import { EmptyState } from "@/components/common/EmptyState";
import { useDocumentHead } from "@/hooks/useDocumentHead";

export default function ReviewQueuePage() {
  const dispatch = useDispatch();
  const { reviewQueue } = useSelector((state) => state.articles);
  const [rejectingId, setRejectingId] = useState(null);
  const [reason, setReason] = useState("");

  useDocumentHead({ title: "Review Queue", noIndex: true });

  useEffect(() => {
    dispatch(fetchReviewQueue({ page: 1 }));
  }, [dispatch]);

  const handleApprove = async (id) => {
    await dispatch(reviewArticle({ id, decision: "approve" })).unwrap();
    toast.success("Article approved and published");
  };

  const handleReject = async (id) => {
    await dispatch(reviewArticle({ id, decision: "reject", rejectionReason: reason })).unwrap();
    toast.success("Article rejected");
    setRejectingId(null);
    setReason("");
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">Editorial Review Queue</h1>
      <p className="mt-1 text-sm text-body">{reviewQueue.pagination?.total || 0} articles awaiting review</p>

      <div className="mt-6 space-y-4">
        {reviewQueue.results.length === 0 && (
          <EmptyState icon={ClipboardCheck} title="Queue is clear" description="No articles are currently pending review." />
        )}

        {reviewQueue.results.map((article) => (
          <div key={article._id} className="rounded-lg border border-line p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs text-muted">
                  By {article.author?.name} &middot; {article.category?.name}
                </p>
                <Link to={`/article/${article.slug}`} target="_blank" className="font-display text-lg font-semibold text-ink hover:text-accent">
                  {article.title}
                </Link>
                <p className="mt-1 text-sm text-body line-clamp-2">{article.excerpt}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button size="sm" variant="accent" onClick={() => handleApprove(article._id)}>
                  <CheckCircle2 size={15} className="mr-1.5" /> Approve
                </Button>
                <Button size="sm" variant="outline" onClick={() => setRejectingId(article._id)}>
                  <XCircle size={15} className="mr-1.5 text-breaking" /> Reject
                </Button>
              </div>
            </div>

            {rejectingId === article._id && (
              <div className="mt-4 flex gap-2 border-t border-line pt-4">
                <Textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Reason for rejection (shown to the author)"
                  className="min-h-[60px] flex-1"
                />
                <Button variant="destructive" size="sm" onClick={() => handleReject(article._id)}>
                  Confirm
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
