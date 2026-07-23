import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/api/axiosInstance";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/form-elements";
import { Pagination } from "@/components/common/Pagination";
import { useDocumentHead } from "@/hooks/useDocumentHead";

const STATUS_VARIANT = {
  draft: "outline",
  in_review: "gold",
  rejected: "breaking",
  scheduled: "gold",
  published: "accent",
  archived: "outline",
};

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [status, setStatus] = useState("published");
  const [page, setPage] = useState(1);

  useDocumentHead({ title: "Manage Articles", noIndex: true });

  useEffect(() => {
    const params = status === "in_review" ? { page } : { page, status: status || undefined };
    const endpoint = status === "in_review" ? "/articles/review/queue" : "/articles";
    api.get(endpoint, { params }).then(({ data }) => {
      setArticles(data.data.results);
      setPagination(data.data.pagination);
    });
  }, [status, page]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-ink">Manage Articles</h1>
        <Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="w-48">
          <option value="published">Published</option>
          <option value="in_review">In review</option>
          <option value="draft">Draft</option>
          <option value="scheduled">Scheduled</option>
          <option value="rejected">Rejected</option>
        </Select>
      </div>

      <div className="mt-6 divide-y divide-line rounded-lg border border-line">
        {articles.map((a) => (
          <div key={a._id} className="flex items-center justify-between gap-3 p-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <Badge variant={STATUS_VARIANT[a.status] || "outline"}>{a.status.replace("_", " ")}</Badge>
                <span className="text-xs text-muted">{a.category?.name}</span>
              </div>
              <p className="mt-1 truncate font-medium text-ink">{a.title}</p>
              <p className="text-xs text-muted">by {a.author?.name}</p>
            </div>
            {a.status === "published" && (
              <Link to={`/article/${a.slug}`} target="_blank" className="shrink-0 text-sm font-medium text-accent hover:underline">
                View
              </Link>
            )}
          </div>
        ))}
      </div>

      <Pagination pagination={pagination} onPageChange={setPage} />
    </div>
  );
}
