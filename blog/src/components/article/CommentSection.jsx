import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { CommentItem } from "@/components/article/CommentItem";
import { Textarea } from "@/components/ui/form-elements";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Pagination } from "@/components/common/Pagination";
import { useAuth } from "@/hooks/useAuth";
import { fetchArticleComments, createComment } from "@/features/comments/commentSlice";

export function CommentSection({ articleId, allowComments = true }) {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useAuth();
  const { results, pagination, status } = useSelector((state) => state.comments.byArticle);
  const repliesByComment = useSelector((state) => state.comments.repliesByComment);
  const [content, setContent] = useState("");

  useEffect(() => {
    if (articleId) dispatch(fetchArticleComments({ articleId, params: { page: 1 } }));
  }, [dispatch, articleId]);

  const handlePageChange = (page) => {
    dispatch(fetchArticleComments({ articleId, params: { page } }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      const result = await dispatch(createComment({ articleId, content })).unwrap();
      setContent("");
      toast.success(
        result.status === "spam" ? "Comment submitted for moderation" : "Comment posted"
      );
    } catch (err) {
      toast.error(err || "Could not post comment");
    }
  };

  if (!allowComments) {
    return (
      <div className="rounded-lg border border-line bg-slate-50 p-6 text-center text-sm text-muted">
        Comments are closed for this article.
      </div>
    );
  }

  return (
    <section aria-label="Comments">
      <h2 className="font-display text-xl font-semibold text-ink">
        Comments {pagination?.total ? `(${pagination.total})` : ""}
      </h2>

      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mt-4 flex gap-3">
          <Avatar src={user?.avatar?.url} name={user?.name} size={40} />
          <div className="flex-1">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts..."
              className="min-h-[80px]"
            />
            <div className="mt-2 flex justify-end">
              <Button type="submit" variant="accent" disabled={!content.trim()}>
                Post comment
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <p className="mt-4 rounded-lg border border-line bg-slate-50 p-4 text-sm text-body">
          <Link to="/login" className="font-semibold text-accent">
            Log in
          </Link>{" "}
          to join the conversation.
        </p>
      )}

      <div className="mt-8 space-y-6">
        {status === "loading" && results.length === 0 ? (
          <p className="text-sm text-muted">Loading comments...</p>
        ) : results.length === 0 ? (
          <p className="text-sm text-muted">Be the first to comment.</p>
        ) : (
          results.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              articleId={articleId}
              replies={repliesByComment[comment._id] || []}
            />
          ))
        )}
      </div>

      <Pagination pagination={pagination} onPageChange={handlePageChange} />
    </section>
  );
}
