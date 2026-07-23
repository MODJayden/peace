import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FileText, Eye, Heart, MessageSquare, PenSquare } from "lucide-react";
import { fetchAuthorAnalytics } from "@/features/analytics/analyticsSlice";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useDocumentHead } from "@/hooks/useDocumentHead";

function StatCard({ icon: Icon, label, value }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-accent">
          <Icon size={20} />
        </div>
        <div>
          <p className="text-2xl font-bold text-ink">{value}</p>
          <p className="text-xs text-muted">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardOverviewPage() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { authorAnalytics } = useSelector((state) => state.analytics);

  useDocumentHead({ title: "Dashboard", noIndex: true });

  useEffect(() => {
    dispatch(fetchAuthorAnalytics());
  }, [dispatch]);

  const totals = authorAnalytics?.totals || { totalViews: 0, totalLikes: 0, totalComments: 0 };
  const recentArticles = authorAnalytics?.articles?.slice(0, 5) || [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Welcome back, {user?.name?.split(" ")[0]}</h1>
          <p className="mt-1 text-sm text-body">Here's how your stories are performing.</p>
        </div>
        <Button as={Link} to="/dashboard/articles/new" variant="accent">
          <PenSquare size={16} className="mr-2" /> New article
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard icon={FileText} label="Total Articles" value={authorAnalytics?.articles?.length || 0} />
        <StatCard icon={Eye} label="Total Views" value={totals.totalViews} />
        <StatCard icon={Heart} label="Total Likes" value={totals.totalLikes} />
        <StatCard icon={MessageSquare} label="Total Comments" value={totals.totalComments} />
      </div>

      <div className="mt-8">
        <h2 className="font-display text-lg font-semibold text-ink">Recent Articles</h2>
        <div className="mt-3 divide-y divide-line rounded-lg border border-line">
          {recentArticles.length === 0 ? (
            <p className="p-5 text-sm text-muted">You haven't written any articles yet.</p>
          ) : (
            recentArticles.map((a) => (
              <div key={a._id} className="flex items-center justify-between p-4">
                <div className="min-w-0">
                  <p className="truncate font-medium text-ink">{a.title}</p>
                  <p className="text-xs text-muted capitalize">{a.status.replace("_", " ")}</p>
                </div>
                <div className="flex shrink-0 items-center gap-4 text-xs text-muted">
                  <span>{a.viewCount} views</span>
                  <span>{a.likeCount} likes</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
