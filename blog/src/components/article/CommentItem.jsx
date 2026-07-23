import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { MessageSquare, Trash2, Heart } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/form-elements";
import { useAuth } from "@/hooks/useAuth";
import { createComment, deleteComment, fetchCommentReplies } from "@/features/comments/commentSlice";
import api from "@/api/axiosInstance";

const timeAgo = (dateStr) => {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
};

export function CommentItem({ comment, articleId, replies = [] }) {
  const dispatch = useDispatch();
  const { isAuthenticated, user, isEditor } = useAuth();
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [likeCount, setLikeCount] = useState(comment.likeCount || 0);
  const [liked, setLiked] = useState(false);

  const canDelete = isAuthenticated && (user._id === comment.author?._id || isEditor);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    await dispatch(createComment({ articleId, content: replyText, parentCommentId: comment._id })).unwrap();
    setReplyText("");
    setShowReplyBox(false);
    setShowReplies(true);
  };

  const handleLoadReplies = () => {
    if (!showReplies) dispatch(fetchCommentReplies(comment._id));
    setShowReplies((v) => !v);
  };

  const handleLike = async () => {
    try {
      const { data } = await api.post("/likes/toggle", { targetType: "Comment", targetId: comment._id });
      setLiked(data.data.liked);
      setLikeCount((c) => c + (data.data.liked ? 1 : -1));
    } catch {
      toast.error("Please log in to like comments");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this comment?")) return;
    await dispatch(deleteComment(comment._id)).unwrap();
    toast.success("Comment deleted");
  };

  return (
    <div id={`comment-${comment._id}`} className="flex gap-3">
      <Avatar src={comment.author?.avatar?.url} name={comment.author?.name} size={36} className="mt-0.5" />
      <div className="flex-1 min-w-0">
        <div className="rounded-lg bg-slate-50 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-ink">{comment.author?.name}</span>
            <span className="text-xs text-muted">{timeAgo(comment.createdAt)}</span>
            {comment.isEdited && <span className="text-xs text-muted">(edited)</span>}
          </div>
          <p className="mt-1 text-sm text-ink-soft whitespace-pre-wrap">{comment.content}</p>
        </div>

        <div className="mt-1.5 flex items-center gap-4 pl-1 text-xs font-medium text-muted">
          <button onClick={handleLike} className={`flex items-center gap-1 hover:text-breaking ${liked ? "text-breaking" : ""}`}>
            <Heart size={14} fill={liked ? "currentColor" : "none"} /> {likeCount > 0 ? likeCount : "Like"}
          </button>
          {isAuthenticated && (
            <button onClick={() => setShowReplyBox((v) => !v)} className="flex items-center gap-1 hover:text-accent">
              <MessageSquare size={14} /> Reply
            </button>
          )}
          {comment.replyCount > 0 && (
            <button onClick={handleLoadReplies} className="hover:text-accent">
              {showReplies ? "Hide" : `View`} {comment.replyCount} {comment.replyCount === 1 ? "reply" : "replies"}
            </button>
          )}
          {canDelete && (
            <button onClick={handleDelete} className="flex items-center gap-1 hover:text-breaking">
              <Trash2 size={14} /> Delete
            </button>
          )}
        </div>

        {showReplyBox && (
          <form onSubmit={handleReplySubmit} className="mt-2 flex gap-2">
            <Textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Reply to ${comment.author?.name}...`}
              className="min-h-[60px] flex-1"
            />
            <Button type="submit" size="sm" variant="accent">
              Post
            </Button>
          </form>
        )}

        {showReplies && replies.length > 0 && (
          <div className="mt-3 space-y-3 border-l-2 border-line pl-4">
            {replies.map((reply) => (
              <CommentItem key={reply._id} comment={reply} articleId={articleId} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
