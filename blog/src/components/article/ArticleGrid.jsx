import { ArticleCard } from "@/components/article/ArticleCard";
import { ArticleCardSkeleton } from "@/components/common/Loaders";
import { EmptyState } from "@/components/common/EmptyState";
import { Newspaper } from "lucide-react";

export function ArticleGrid({ articles, isLoading, columns = 3 }) {
  const colClass = columns === 4 ? "lg:grid-cols-4" : columns === 2 ? "sm:grid-cols-2" : "lg:grid-cols-3";

  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${colClass} gap-8`}>
        {Array.from({ length: columns * 2 }).map((_, i) => (
          <ArticleCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <EmptyState
        icon={Newspaper}
        title="No articles yet"
        description="Check back soon — new stories are published every day."
      />
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 ${colClass} gap-x-8 gap-y-10`}>
      {articles.map((article) => (
        <ArticleCard key={article._id} article={article} />
      ))}
    </div>
  );
}
