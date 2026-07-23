import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp } from "lucide-react";
import { fetchArticles, fetchTrendingArticles } from "@/features/articles/articleSlice";
import { fetchCategories } from "@/features/categories/categorySlice";
import api from "@/api/axiosInstance";
import { ArticleCard } from "@/components/article/ArticleCard";
import { ArticleGrid } from "@/components/article/ArticleGrid";
import { NewsletterForm } from "@/components/common/NewsletterForm";
import { useDocumentHead } from "@/hooks/useDocumentHead";

function PopularAuthors() {
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    api
      .get("/users/authors", { params: { limit: 5 } })
      .then(({ data }) => setAuthors(data.data.results))
      .catch(() => {});
  }, []);

  if (authors.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-14">
      <h2 className="font-display text-2xl font-bold text-ink">Popular Authors</h2>
      <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
        {authors.map(({ user, authorProfile }) => (
          <Link
            key={user._id}
            to={`/author/${user.username}`}
            className="flex flex-col items-center rounded-lg border border-line p-5 text-center hover:border-accent transition-colors"
          >
            {user.avatar?.url ? (
              <img src={user.avatar.url} alt={user.name} className="h-16 w-16 rounded-full object-cover" />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ink font-display text-lg text-paper">
                {user.name?.[0]}
              </div>
            )}
            <p className="mt-3 font-semibold text-ink text-sm">{user.name}</p>
            <p className="text-xs text-muted">{authorProfile?.stats?.followerCount || 0} followers</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  const dispatch = useDispatch();
  const { feed, trending } = useSelector((state) => state.articles);
  const categories = useSelector((state) => state.categories.list);

  useDocumentHead({
    description:
      "SirPeace is Ghana's premium digital newsroom, delivering trusted reporting on politics, business, technology, sports, and culture.",
  });

  useEffect(() => {
    dispatch(fetchArticles({ sort: "latest", limit: 13 }));
    dispatch(fetchTrendingArticles({ limit: 5 }));
    dispatch(fetchCategories());
  }, [dispatch]);

  const featured = feed.results.filter((a) => a.isFeatured).slice(0, 1)[0] || feed.results[0];
  const heroSecondary = feed.results.filter((a) => a._id !== featured?._id).slice(0, 4);
  const latest = feed.results.slice(5, 11);

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 pt-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {featured && (
            <Link to={`/article/${featured.slug}`} className="group lg:col-span-2">
              <div className="aspect-[16/9] overflow-hidden rounded-xl bg-slate-100">
                {featured.featuredImage?.url ? (
                  <img
                    src={featured.featuredImage.url}
                    alt={featured.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center font-display text-5xl text-slate-300">
                    SirPeace
                  </div>
                )}
              </div>
              <span className="mt-4 inline-block font-mono text-xs font-semibold uppercase tracking-wider text-accent">
                {featured.category?.name}
              </span>
              <h1 className="mt-2 font-display text-3xl font-bold leading-tight text-ink group-hover:text-accent transition-colors lg:text-4xl">
                {featured.title}
              </h1>
              <p className="mt-2 text-body line-clamp-2">{featured.excerpt}</p>
            </Link>
          )}

          <div className="space-y-5 divide-y divide-line">
            {heroSecondary.map((article) => (
              <div key={article._id} className="pt-5 first:pt-0">
                <ArticleCard article={article} variant="horizontal" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending */}
      {trending.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-14">
          <div className="flex items-center gap-2">
            <TrendingUp size={20} className="text-gold" />
            <h2 className="font-display text-2xl font-bold text-ink">Trending Now</h2>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-5">
            {trending.map((article, index) => (
              <Link key={article._id} to={`/article/${article.slug}`} className="group flex gap-3">
                <span className="font-display text-3xl font-bold text-slate-200">{index + 1}</span>
                <h3 className="font-semibold text-ink leading-snug line-clamp-3 group-hover:text-accent transition-colors">
                  {article.title}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Latest News */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-ink">Latest News</h2>
          <Link to="/search" className="flex items-center gap-1 text-sm font-semibold text-accent hover:underline">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="mt-6">
          <ArticleGrid articles={latest} isLoading={feed.status === "loading"} columns={3} />
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-14">
          <h2 className="font-display text-2xl font-bold text-ink">Browse by Category</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {categories.map((category) => (
              <Link
                key={category._id}
                to={`/category/${category.slug}`}
                className="flex items-center justify-center rounded-lg border border-line bg-surface px-4 py-6 text-center font-semibold text-ink-soft hover:border-accent hover:text-accent transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      <PopularAuthors />

      {/* Newsletter */}
      <section className="bg-ink py-16">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="font-display text-2xl font-bold text-paper">Stay ahead of the story</h2>
          <p className="mt-2 text-slate-400">
            Get breaking news alerts and our weekly digest, straight to your inbox.
          </p>
          <div className="mt-6">
            <NewsletterForm variant="dark" />
          </div>
        </div>
      </section>
    </div>
  );
}
