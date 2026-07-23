import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const timeAgo = (dateStr) => {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

export function ArticleCard({ article, variant = "default" }) {
  const isHorizontal = variant === "horizontal";

  return (
    <article className={cn("group", isHorizontal && "flex gap-4")}>
      <Link
        to={`/article/${article.slug}`}
        className={cn("block overflow-hidden rounded-lg bg-slate-100", isHorizontal ? "w-32 shrink-0 aspect-[4/3]" : "aspect-[16/10]")}
      >
        {article.featuredImage?.url ? (
          <img
            src={article.featuredImage.url}
            alt={article.featuredImage.altText || article.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-display text-3xl text-slate-300">
            SP
          </div>
        )}
      </Link>

      <div className={cn(isHorizontal ? "flex-1 min-w-0" : "mt-3")}>
        <div className="flex items-center gap-2">
          {article.category && (
            <Link to={`/category/${article.category.slug}`}>
              <Badge variant="accent">{article.category.name}</Badge>
            </Link>
          )}
          {article.isSponsored && <Badge variant="gold">Sponsored</Badge>}
        </div>

        <Link to={`/article/${article.slug}`}>
          <h3
            className={cn(
              "mt-2 font-display font-semibold text-ink group-hover:text-accent transition-colors",
              isHorizontal ? "text-base leading-snug line-clamp-2" : "text-xl leading-snug line-clamp-2"
            )}
          >
            {article.title}
          </h3>
        </Link>

        {!isHorizontal && article.excerpt && (
          <p className="mt-1.5 text-sm text-body line-clamp-2">{article.excerpt}</p>
        )}

        <div className="mt-2.5 flex items-center gap-2 text-xs text-muted">
          {article.author?.name && <span className="font-medium text-ink-soft">{article.author.name}</span>}
          <span aria-hidden>&middot;</span>
          <span>{timeAgo(article.publishedAt || article.createdAt)}</span>
          {article.readTimeMinutes && (
            <>
              <span aria-hidden>&middot;</span>
              <span className="flex items-center gap-1">
                <Clock size={12} /> {article.readTimeMinutes} min read
              </span>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
