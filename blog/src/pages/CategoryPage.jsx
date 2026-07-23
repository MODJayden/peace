import { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategoryBySlug } from "@/features/categories/categorySlice";
import { ArticleGrid } from "@/components/article/ArticleGrid";
import { Pagination } from "@/components/common/Pagination";
import { useDocumentHead } from "@/hooks/useDocumentHead";

export default function CategoryPage() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { current, currentArticles, currentStatus } = useSelector((state) => state.categories);
  const page = parseInt(searchParams.get("page"), 10) || 1;

  useEffect(() => {
    dispatch(fetchCategoryBySlug({ slug, params: { page } }));
  }, [dispatch, slug, page]);

  useDocumentHead({
    title: current?.seo?.metaTitle || current?.name,
    description: current?.seo?.metaDescription || current?.description,
  });

  const handlePageChange = (newPage) => setSearchParams({ page: String(newPage) });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <span className="font-mono text-xs font-semibold uppercase tracking-wider text-accent">Category</span>
      <h1 className="mt-1 font-display text-3xl font-bold text-ink">{current?.name || "Loading..."}</h1>
      {current?.description && <p className="mt-2 max-w-2xl text-body">{current.description}</p>}

      <div className="mt-8">
        <ArticleGrid articles={currentArticles.results} isLoading={currentStatus === "loading"} columns={3} />
      </div>

      <Pagination pagination={currentArticles.pagination} onPageChange={handlePageChange} />
    </div>
  );
}
