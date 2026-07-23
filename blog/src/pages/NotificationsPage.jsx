import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Bell, CheckCheck } from "lucide-react";
import { fetchMyNotifications, markNotificationRead, markAllNotificationsRead } from "@/features/notifications/notificationSlice";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/EmptyState";
import { Pagination } from "@/components/common/Pagination";
import { useDocumentHead } from "@/hooks/useDocumentHead";
import { cn } from "@/lib/utils";

const timeAgo = (dateStr) => {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
};

export default function NotificationsPage() {
  const dispatch = useDispatch();
  const { results, pagination, unreadCount, status } = useSelector((state) => state.notifications);

  useDocumentHead({ title: "Notifications", noIndex: true });

  useEffect(() => {
    dispatch(fetchMyNotifications({ page: 1 }));
  }, [dispatch]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-ink">Notifications</h1>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={() => dispatch(markAllNotificationsRead())}>
            <CheckCheck size={15} className="mr-1.5" /> Mark all read
          </Button>
        )}
      </div>

      <div className="mt-6 space-y-2">
        {status === "succeeded" && results.length === 0 && (
          <EmptyState icon={Bell} title="No notifications" description="You're all caught up." />
        )}

        {results.map((n) => (
          <Link
            key={n._id}
            to={n.link || "#"}
            onClick={() => !n.isRead && dispatch(markNotificationRead(n._id))}
            className={cn(
              "flex items-start gap-3 rounded-lg border border-line p-4 transition-colors hover:border-accent",
              !n.isRead && "bg-blue-50/50"
            )}
          >
            <Avatar src={n.sender?.avatar?.url} name={n.sender?.name || "SirPeace"} size={36} />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-ink-soft">{n.message}</p>
              <p className="mt-1 text-xs text-muted">{timeAgo(n.createdAt)}</p>
            </div>
            {!n.isRead && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" />}
          </Link>
        ))}
      </div>

      <Pagination pagination={pagination} onPageChange={(page) => dispatch(fetchMyNotifications({ page }))} />
    </div>
  );
}
