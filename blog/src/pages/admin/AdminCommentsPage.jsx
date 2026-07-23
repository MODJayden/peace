import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { CheckCircle2, XCircle, ShieldAlert } from "lucide-react";
import { fetchModerationQueue, moderateComment } from "@/features/comments/commentSlice";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/form-elements";
import { EmptyState } from "@/components/common/EmptyState";
import { Pagination } from "@/components/common/Pagination";
import { useDocumentHead } from "@/hooks/useDocumentHead";

export default function AdminCommentsPage() {
  const dispatch = useDispatch();
  const { moderationQueue } = useSelector((state) => state.comments);
  const [status, setStatus] = useState("spam");

  useDocumentHead({ title: "Comment Moderation", noIndex: true });

  useEffect(() => {
    dispatch(fetchModerationQueue({ page: 1, status }));
  }, [dispatch, status]);

  const handleModerate = async (id, decision) => {
    await dispatch(moderateComment({ id, decision })).unwrap();
    toast.success(`Comment ${decision === "approve" ? "approved" : "rejected"}`);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-ink">Comment Moderation</h1>
        <Select value={status} onChange={(e) => setStatus(e.target.value)} className="w-48">
          <option value="spam">Flagged as spam</option>
          <option value="pending">Pending</option>
        </Select>
      </div>

      <div className="mt-6 space-y-3">
        {moderationQueue.results.length === 0 && (
          <EmptyState icon={ShieldAlert} title="Nothing to moderate" description="No comments require attention right now." />
        )}

        {moderationQueue.results.map((c) => (
          <div key={c._id} className="rounded-lg border border-line p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs text-muted">
                  {c.author?.name} on{" "}
                  <Link to={`/article/${c.article?.slug}`} className="text-accent hover:underline">
                    {c.article?.title}
                  </Link>
                </p>
                <p className="mt-1.5 text-sm text-ink-soft">{c.content}</p>
                <p className="mt-1 text-xs text-muted">Spam score: {c.spamScore}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button size="sm" variant="accent" onClick={() => handleModerate(c._id, "approve")}>
                  <CheckCircle2 size={14} className="mr-1" /> Approve
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleModerate(c._id, "reject")}>
                  <XCircle size={14} className="mr-1" /> Reject
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Pagination pagination={moderationQueue.pagination} onPageChange={(page) => dispatch(fetchModerationQueue({ page, status }))} />
    </div>
  );
}
