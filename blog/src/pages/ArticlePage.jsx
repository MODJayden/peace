import { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Clock, ChevronRight } from "lucide-react";
import { fetchArticleBySlug, clearCurrentArticle } from "@/features/articles/articleSlice";
import { trackAnalyticsEvent } from "@/features/analytics/analyticsSlice";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TableOfContents } from "@/components/article/TableOfContents";
import { ShareButtons } from "@/components/article/ShareButtons";
import { LikeButton, BookmarkButton } from "@/components/article/ArticleActions";
import { CommentSection } from "@/components/article/CommentSection";
import { ArticleCard } from "@/components/article/ArticleCard";
import { PageSpinner } from "@/components/common/Loaders";
import { useDocumentHead } from "@/hooks/useDocumentHead";
import api from "@/api/axiosInstance";

export default function ArticlePage() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { current: article, related, currentStatus } = useSelector((state) => state.articles);
  const [structuredData, setStructuredData] = useState(null);

  useEffect(() => {
    dispatch(fetchArticleBySlug(slug));
    return () => dispatch(clearCurrentArticle());
  }, [dispatch, slug]);

  useEffect(() => {
    if (!article) return;
    dispatch(trackAnalyticsEvent({ eventType: "view", articleId: article._id }));
    api
      .get(`/seo/structured-data/article/${slug}`)
      .then(({ data }) => setStructuredData(data.data))
      .catch(() => {});
  }, [dispatch, article, slug]);

  const url = article ? `${window.location.origin}/article/${article.slug}` : "";

  useDocumentHead({
    title: article?.seo?.metaTitle || article?.title,
    description: article?.seo?.metaDescription || article?.excerpt,
    image: article?.featuredImage?.url,
    canonical: article?.seo?.canonicalUrl || url,
    noIndex: article?.seo?.noIndex,
    structuredData,
  });

  if (currentStatus === "loading") return <PageSpinner />;
  if (currentStatus === "failed") return <Navigate to="/404" replace />;
  if (!article) return null;

  return (
    <article className="mx-auto max-w-7xl px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-muted" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-ink">
          Home
        </Link>
        <ChevronRight size={12} />
        <Link to={`/category/${article.category?.slug}`} className="hover:text-ink">
          {article.category?.name}
        </Link>
      </nav>

      <div className="mt-4 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="accent">{article.category?.name}</Badge>
            {article.isBreaking && <Badge variant="breaking">Breaking</Badge>}
            {article.isSponsored && <Badge variant="gold">Sponsored{article.sponsorName ? ` · ${article.sponsorName}` : ""}</Badge>}
          </div>

          <h1 className="mt-4 font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">{article.title}</h1>
          {article.excerpt && <p className="mt-3 text-lg text-body">{article.excerpt}</p>}

          <div className="mt-6 flex items-center justify-between border-y border-line py-4">
            <Link to={`/author/${article.author?.username}`} className="flex items-center gap-3">
              <Avatar src={article.author?.avatar?.url} name={article.author?.name} size={44} />
              <div>
                <p className="font-semibold text-ink">{article.author?.name}</p>
                <p className="flex items-center gap-1.5 text-xs text-muted">
                  {new Date(article.publishedAt || article.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                  <span aria-hidden>&middot;</span>
                  <Clock size={12} /> {article.readTimeMinutes} min read
                </p>
              </div>
            </Link>
            <ShareButtons articleId={article._id} title={article.title} url={url} />
          </div>

          {article.featuredImage?.url && (
            <img
              src={article.featuredImage.url}
              alt={article.featuredImage.altText || article.title}
              className="mt-6 w-full rounded-xl object-cover"
            />
          )}

          <div className="article-body mt-8" dangerouslySetInnerHTML={{ __html: article.content }} />

          {article.tags?.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Link key={tag._id} to={`/tag/${tag.slug}`}>
                  <Badge variant="outline">#{tag.name}</Badge>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-8 flex items-center gap-3">
            <LikeButton articleId={article._id} likeCount={article.likeCount} isLiked={article.isLikedByMe} />
            <BookmarkButton articleId={article._id} />
          </div>

          <div className="mt-12 border-t border-line pt-8">
            <CommentSection articleId={article._id} allowComments={article.allowComments} />
          </div>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <TableOfContents items={article.tableOfContents} />

          {related?.length > 0 && (
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted">Related stories</p>
              <div className="mt-3 space-y-4">
                {related.map((r) => (
                  <ArticleCard key={r._id} article={r} variant="horizontal" />
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </article>
  );
}
