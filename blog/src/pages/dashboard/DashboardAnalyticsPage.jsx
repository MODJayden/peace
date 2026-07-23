import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuthorAnalytics } from "@/features/analytics/analyticsSlice";
import { useDocumentHead } from "@/hooks/useDocumentHead";

export default function DashboardAnalyticsPage() {
  const dispatch = useDispatch();
  const { authorAnalytics } = useSelector((state) => state.analytics);

  useDocumentHead({ title: "Analytics", noIndex: true });

  useEffect(() => {
    dispatch(fetchAuthorAnalytics());
  }, [dispatch]);

  const viewsOverTime = authorAnalytics?.viewsOverTime || [];
  const articles = authorAnalytics?.articles || [];
  const maxViews = Math.max(1, ...viewsOverTime.map((d) => d.views));

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">Analytics</h1>

      <div className="mt-6 rounded-lg border border-line p-5">
        <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted">Views (last 30 days)</p>
        {viewsOverTime.length === 0 ? (
          <p className="mt-4 text-sm text-muted">No view data yet for this period.</p>
        ) : (
          <div className="mt-5 flex h-40 items-end gap-1.5">
            {viewsOverTime.map((d) => (
              <div key={d._id} className="group relative flex-1">
                <div
                  className="rounded-t bg-accent/80 transition-colors group-hover:bg-accent"
                  style={{ height: `${Math.max(4, (d.views / maxViews) * 100)}%` }}
                />
                <span className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 rounded bg-ink px-1.5 py-0.5 text-[10px] text-paper opacity-0 group-hover:opacity-100">
                  {d.views}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8">
        <h2 className="font-display text-lg font-semibold text-ink">Article Performance</h2>
        <div className="mt-3 overflow-x-auto rounded-lg border border-line">
          <table className="w-full text-sm">
            <thead className="border-b border-line bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-muted">
              <tr>
                <th className="px-4 py-3">Article</th>
                <th className="px-4 py-3">Views</th>
                <th className="px-4 py-3">Likes</th>
                <th className="px-4 py-3">Comments</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {articles.map((a) => (
                <tr key={a._id}>
                  <td className="max-w-xs truncate px-4 py-3 font-medium text-ink">{a.title}</td>
                  <td className="px-4 py-3">{a.viewCount}</td>
                  <td className="px-4 py-3">{a.likeCount}</td>
                  <td className="px-4 py-3">{a.commentCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
