import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search as SearchIcon } from "lucide-react";
import api from "@/api/axiosInstance";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { ArticleGrid } from "@/components/article/ArticleGrid";
import { EmptyState } from "@/components/common/EmptyState";
import { useDebounce } from "@/hooks/useDebounce";
import { useDocumentHead } from "@/hooks/useDocumentHead";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState(null);
  const [status, setStatus] = useState("idle");
  const debouncedQuery = useDebounce(query, 400);

  useDocumentHead({ title: query ? `Search: ${query}` : "Search", noIndex: true });

  useEffect(() => {
    if (debouncedQuery.trim().length < 2) {
      setResults(null);
      return;
    }
    setSearchParams({ q: debouncedQuery }, { replace: true });
    setStatus("loading");
    api
      .get("/search", { params: { q: debouncedQuery } })
      .then(({ data }) => setResults(data.data))
      .finally(() => setStatus("succeeded"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-display text-2xl font-bold text-ink">Search SirPeace</h1>
      <div className="relative mt-5">
        <SearchIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <Input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search articles, categories, tags, authors..."
          className="pl-10 h-12 text-base"
        />
      </div>

      {status === "loading" && <p className="mt-8 text-sm text-muted">Searching...</p>}

      {results && (
        <div className="mt-10 space-y-12">
          {results.categories?.length > 0 && (
            <section>
              <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-muted">Categories</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {results.categories.map((c) => (
                  <Link key={c._id} to={`/category/${c.slug}`}>
                    <Badge variant="accent">{c.name}</Badge>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {results.tags?.length > 0 && (
            <section>
              <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-muted">Tags</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {results.tags.map((t) => (
                  <Link key={t._id} to={`/tag/${t.slug}`}>
                    <Badge variant="outline">#{t.name}</Badge>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {results.authors?.length > 0 && (
            <section>
              <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-muted">Authors</h2>
              <div className="mt-3 flex flex-wrap gap-4">
                {results.authors.map((a) => (
                  <Link key={a._id} to={`/author/${a.username}`} className="flex items-center gap-2">
                    <Avatar src={a.avatar?.url} name={a.name} size={32} />
                    <span className="text-sm font-medium text-ink">{a.name}</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-muted">Articles</h2>
            <div className="mt-4">
              {results.articles?.length > 0 ? (
                <ArticleGrid articles={results.articles} isLoading={false} columns={3} />
              ) : (
                <EmptyState icon={SearchIcon} title="No articles found" description="Try a different search term." />
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
