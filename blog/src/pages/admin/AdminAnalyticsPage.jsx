import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOverviewAnalytics,
  fetchPopularArticles,
  fetchTopCategories,
  fetchTopAuthors,
  fetchRevenueDashboard,
} from "@/features/analytics/analyticsSlice";
import { Card, CardContent } from "@/components/ui/card";
import { useDocumentHead } from "@/hooks/useDocumentHead";

function StatBlock({ label, value }) {
  return (
    <Card>
      <CardContent>
        <p className="text-2xl font-bold text-ink">{value ?? 0}</p>
        <p className="mt-1 text-xs text-muted">{label}</p>
      </CardContent>
    </Card>
  );
}

export default function AdminAnalyticsPage() {
  const dispatch = useDispatch();
  const { overview, popularArticles, topCategories, topAuthors, revenue } = useSelector((state) => state.analytics);

  useDocumentHead({ title: "Platform Analytics", noIndex: true });

  useEffect(() => {
    dispatch(fetchOverviewAnalytics());
    dispatch(fetchPopularArticles({ limit: 8 }));
    dispatch(fetchTopCategories());
    dispatch(fetchTopAuthors());
    dispatch(fetchRevenueDashboard());
  }, [dispatch]);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">Platform Analytics</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatBlock label="Total Views (30d)" value={overview?.totalViews} />
        <StatBlock label="Completed Reads" value={overview?.totalReads} />
        <StatBlock label="Unique Sessions" value={overview?.uniqueSessions} />
        <StatBlock label="Articles Published" value={overview?.articlesPublished} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-line p-5">
          <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted">Popular Articles</p>
          <div className="mt-3 space-y-3">
            {popularArticles.map((p) => (
              <div key={p._id} className="flex items-center justify-between text-sm">
                <span className="truncate text-ink-soft">{p.article.title}</span>
                <span className="shrink-0 font-semibold text-ink">{p.views} views</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-line p-5">
          <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted">Top Categories</p>
          <div className="mt-3 space-y-3">
            {topCategories.map((c) => (
              <div key={c._id} className="flex items-center justify-between text-sm">
                <span className="text-ink-soft">{c.category.name}</span>
                <span className="font-semibold text-ink">{c.views} views</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-line p-5">
          <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted">Top Authors</p>
          <div className="mt-3 space-y-3">
            {topAuthors.map((a) => (
              <div key={a._id} className="flex items-center justify-between text-sm">
                <span className="text-ink-soft">{a.author.name}</span>
                <span className="font-semibold text-ink">{a.views} views</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-line p-5">
          <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted">Revenue Dashboard</p>
          {revenue && (
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted">Impressions</p>
                <p className="font-semibold text-ink">{revenue.totals.totalImpressions}</p>
              </div>
              <div>
                <p className="text-muted">Clicks</p>
                <p className="font-semibold text-ink">{revenue.totals.totalClicks}</p>
              </div>
              <div>
                <p className="text-muted">Revenue Earned</p>
                <p className="font-semibold text-ink">GHS {revenue.totals.totalRevenue.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-muted">Total Budget</p>
                <p className="font-semibold text-ink">GHS {revenue.totals.totalBudget.toFixed(2)}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
