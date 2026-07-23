import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchActivityLogs } from "@/features/admin/adminSlice";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/common/Pagination";
import { useDocumentHead } from "@/hooks/useDocumentHead";

export default function AdminLogsPage() {
  const dispatch = useDispatch();
  const { activityLogs } = useSelector((state) => state.admin);

  useDocumentHead({ title: "System Logs", noIndex: true });

  useEffect(() => {
    dispatch(fetchActivityLogs({ page: 1 }));
  }, [dispatch]);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">System Logs</h1>

      <div className="mt-6 divide-y divide-line rounded-lg border border-line">
        {activityLogs.results.map((log) => (
          <div key={log._id} className="flex items-center justify-between gap-4 p-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{log.action.replace("_", " ")}</Badge>
                <span className="text-xs text-muted">{log.targetType}</span>
              </div>
              <p className="mt-1 truncate text-sm text-ink-soft">
                {log.actor?.name} &mdash; {log.description || `${log.action} on ${log.targetType}`}
              </p>
            </div>
            <span className="shrink-0 text-xs text-muted">{new Date(log.createdAt).toLocaleString()}</span>
          </div>
        ))}
      </div>

      <Pagination pagination={activityLogs.pagination} onPageChange={(page) => dispatch(fetchActivityLogs({ page }))} />
    </div>
  );
}
