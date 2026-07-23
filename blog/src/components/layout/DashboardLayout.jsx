import { Link, NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, FileText, PenSquare, BarChart3, ClipboardCheck, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const NAV_ITEMS = [
  { label: "Overview", to: "/dashboard", icon: LayoutDashboard, end: true },
  { label: "My Articles", to: "/dashboard/articles", icon: FileText },
  { label: "New Article", to: "/dashboard/articles/new", icon: PenSquare },
  { label: "Analytics", to: "/dashboard/analytics", icon: BarChart3 },
];

export function DashboardLayout() {
  const { isEditor } = useAuth();

  return (
    <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8">
      <aside className="hidden w-56 shrink-0 md:block">
        <Link to="/" className="mb-6 flex items-center gap-1.5 text-sm text-body hover:text-ink">
          <ArrowLeft size={15} /> Back to site
        </Link>
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map(({ label, to, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium",
                  isActive ? "bg-ink text-paper" : "text-ink-soft hover:bg-slate-100"
                )
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
          {isEditor && (
            <NavLink
              to="/dashboard/review-queue"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium",
                  isActive ? "bg-ink text-paper" : "text-ink-soft hover:bg-slate-100"
                )
              }
            >
              <ClipboardCheck size={17} />
              Review Queue
            </NavLink>
          )}
        </nav>
      </aside>
      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  );
}
