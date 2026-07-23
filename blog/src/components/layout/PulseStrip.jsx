import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBreakingNews, fetchTrendingArticles } from "@/features/articles/articleSlice";

export function PulseStrip() {
  const dispatch = useDispatch();
  const breaking = useSelector((state) => state.articles.breaking);
  const trending = useSelector((state) => state.articles.trending);

  useEffect(() => {
    dispatch(fetchBreakingNews());
    dispatch(fetchTrendingArticles({ limit: 6 }));
  }, [dispatch]);

  const items = breaking.length > 0 ? breaking : trending;
  if (items.length === 0) return null;

  const isBreaking = breaking.length > 0;
  const doubled = [...items, ...items];

  return (
    <div className="bg-ink text-paper">
      <div className="mx-auto flex max-w-7xl items-center">
        <div className="flex shrink-0 items-center gap-2 bg-breaking px-3 py-2 font-mono text-[11px] font-semibold uppercase tracking-wider">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-paper" />
          </span>
          {isBreaking ? "Breaking" : "Trending"}
        </div>
        <div className="relative flex-1 overflow-hidden py-2">
          <div className="flex w-max animate-ticker gap-10 whitespace-nowrap pl-6">
            {doubled.map((item, index) => (
              <Link
                key={`${item._id}-${index}`}
                to={`/article/${item.slug}`}
                className="font-mono text-xs text-slate-200 hover:text-gold transition-colors"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
