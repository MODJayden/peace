import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Users, Newspaper, Clock, MessageSquare, ShieldAlert, Mail } from "lucide-react";
import { fetchAdminDashboard } from "@/features/admin/adminSlice";
import { Card, CardContent } from "@/components/ui/card";
import { useDocumentHead } from "@/hooks/useDocumentHead";

function StatCard({ icon: Icon, label, value }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-accent">
          <Icon size={20} />
        </div>
        <div>
          <p className="text-2xl font-bold text-ink">{value ?? "—"}</p>
          <p className="text-xs text-muted">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminOverviewPage() {
  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state.admin);

  useDocumentHead({ title: "Admin Dashboard", noIndex: true });

  useEffect(() => {
    dispatch(fetchAdminDashboard());
  }, [dispatch]);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">Admin Dashboard</h1>
      <p className="mt-1 text-sm text-body">A snapshot of SirPeace's platform-wide activity.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard icon={Users} label="Total Users" value={dashboard?.totalUsers} />
        <StatCard icon={Newspaper} label="Published Articles" value={dashboard?.publishedArticles} />
        <StatCard icon={Clock} label="Pending Review" value={dashboard?.pendingReview} />
        <StatCard icon={MessageSquare} label="Approved Comments" value={dashboard?.totalComments} />
        <StatCard icon={ShieldAlert} label="Spam Comments" value={dashboard?.spamComments} />
        <StatCard icon={Mail} label="Newsletter Subscribers" value={dashboard?.subscribers} />
      </div>
    </div>
  );
}
