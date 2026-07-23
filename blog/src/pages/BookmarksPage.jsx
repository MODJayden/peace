import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Bookmark } from "lucide-react";
import { fetchMyBookmarks } from "@/features/bookmarks/bookmarkSlice";
import { ArticleCard } from "@/components/article/ArticleCard";
import { ArticleCardSkeleton } from "@/components/common/Loaders";
import { EmptyState } from "@/components/common/EmptyState";
import { Pagination } from "@/components/common/Pagination";
import { useDocumentHead } from "@/hooks/useDocumentHead";

export default function BookmarksPage() {
  const dispatch = useDispatch();
  const { results, pagination, status } = useSelector((state) => state.bookmarks);

  useDocumentHead({ title: "Your Bookmarks", noIndex: true });

  useEffect(() => {
    dispatch(fetchMyBookmarks({ page: 1 }));
  }, [dispatch]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-display text-2xl font-bold text-ink">Your Bookmarks</h1>

      <div className="mt-8">
        {status === "loading" ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <ArticleCardSkeleton key={i} />
            ))}
          </div>
        ) : results.length === 0 ? (
          <EmptyState
            icon={Bookmark}
            title="No bookmarks yet"
            description="Save articles to read later by tapping the bookmark icon."
          />
        ) : (
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((b) => (
              <ArticleCard key={b._id} article={b.article} />
            ))}
          </div>
        )}
      </div>

      <Pagination pagination={pagination} onPageChange={(page) => dispatch(fetchMyBookmarks({ page }))} />
    </div>
  );
}
