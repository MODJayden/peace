import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { PenSquare, Trash2, Send, Eye } from "lucide-react";
import { toast } from "sonner";
import { fetchMyArticles, deleteArticle, submitForReview } from "@/features/articles/articleSlice";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/form-elements";
import { Pagination } from "@/components/common/Pagination";
import { EmptyState } from "@/components/common/EmptyState";
import { useDocumentHead } from "@/hooks/useDocumentHead";

const STATUS_VARIANT = {
  draft: "outline",
  in_review: "gold",
  approved: "accent",
  rejected: "breaking",
  scheduled: "gold",
  published: "accent",
  archived: "outline",
};

export default function MyArticlesPage() {
  const dispatch = useDispatch();
  const { myArticles } = useSelector((state) => state.articles);
  const [statusFilter, setStatusFilter] = useState("");

  useDocumentHead({ title: "My Articles", noIndex: true });

  useEffect(() => {
    dispatch(fetchMyArticles({ page: 1, status: statusFilter || undefined }));
  }, [dispatch, statusFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this article? This cannot be undone.")) return;
    await dispatch(deleteArticle(id)).unwrap();
    toast.success("Article deleted");
  };

  const handleSubmitReview = async (id) => {
    await dispatch(submitForReview(id)).unwrap();
    toast.success("Submitted for editorial review");
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-ink">My Articles</h1>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-48">
          <option value="">All statuses</option>
          <option value="draft">Draft</option>
          <option value="in_review">In review</option>
          <option value="rejected">Rejected</option>
          <option value="scheduled">Scheduled</option>
          <option value="published">Published</option>
        </Select>
      </div>

      <div className="mt-6 divide-y divide-line rounded-lg border border-line">
        {myArticles.results.length === 0 ? (
          <EmptyState
            icon={PenSquare}
            title="No articles found"
            description="Start writing your first story for SirPeace."
            action={
              <Button as={Link} to="/dashboard/articles/new" variant="accent">
                Write an article
              </Button>
            }
          />
        ) : (
          myArticles.results.map((article) => (
            <div key={article._id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant={STATUS_VARIANT[article.status]}>{article.status.replace("_", " ")}</Badge>
                  {article.category?.name && <span className="text-xs text-muted">{article.category.name}</span>}
                </div>
                <p className="mt-1 truncate font-medium text-ink">{article.title}</p>
                {article.rejectionReason && article.status === "rejected" && (
                  <p className="mt-0.5 text-xs text-breaking">Reason: {article.rejectionReason}</p>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {article.status === "published" && (
                  <Button as={Link} to={`/article/${article.slug}`} variant="ghost" size="sm">
                    <Eye size={15} />
                  </Button>
                )}
                {["draft", "rejected"].includes(article.status) && (
                  <Button variant="ghost" size="sm" onClick={() => handleSubmitReview(article._id)}>
                    <Send size={15} />
                  </Button>
                )}
                <Button as={Link} to={`/dashboard/articles/${article._id}/edit`} variant="ghost" size="sm">
                  <PenSquare size={15} />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(article._id)}>
                  <Trash2 size={15} className="text-breaking" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <Pagination pagination={myArticles.pagination} onPageChange={(page) => dispatch(fetchMyArticles({ page }))} />
    </div>
  );
}
