import { useDispatch } from "react-redux";
import { Heart, Bookmark } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { toggleArticleLike } from "@/features/articles/articleSlice";
import { toggleBookmark } from "@/features/bookmarks/bookmarkSlice";

export function LikeButton({ articleId, likeCount, isLiked }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleClick = () => {
    if (!isAuthenticated) return navigate("/login");
    dispatch(toggleArticleLike(articleId));
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
        isLiked ? "border-breaking bg-red-50 text-breaking" : "border-line-strong text-ink-soft hover:border-breaking hover:text-breaking"
      )}
    >
      <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
      {likeCount}
    </button>
  );
}

export function BookmarkButton({ articleId }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleClick = async () => {
    if (!isAuthenticated) return navigate("/login");
    const result = await dispatch(toggleBookmark({ articleId })).unwrap();
    toast.success(result.bookmarked ? "Saved to bookmarks" : "Removed from bookmarks");
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 rounded-full border border-line-strong px-4 py-2 text-sm font-semibold text-ink-soft hover:border-accent hover:text-accent transition-colors"
    >
      <Bookmark size={16} />
      Save
    </button>
  );
}
