import { Link, NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Newspaper,
  MessageSquare,
  Megaphone,
  BarChart3,
  Settings,
  ScrollText,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const NAV_ITEMS = [
  { label: "Overview", to: "/admin", icon: LayoutDashboard, end: true },
  { label: "Users", to: "/admin/users", icon: Users },
  { label: "Articles", to: "/admin/articles", icon: Newspaper },
  { label: "Comments", to: "/admin/comments", icon: MessageSquare },
  { label: "Advertisements", to: "/admin/advertisements", icon: Megaphone },
  { label: "Analytics", to: "/admin/analytics", icon: BarChart3 },
];

export function AdminLayout() {
  const { isSuperAdmin } = useAuth();

  return (
    <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8">
      <aside className="hidden w-60 shrink-0 md:block">
        <Link to="/" className="mb-6 flex items-center gap-1.5 text-sm text-body hover:text-ink">
          <ArrowLeft size={15} /> Back to site
        </Link>
        <p className="mb-2 px-3 font-mono text-[11px] uppercase tracking-wider text-muted">Admin console</p>
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
          {isSuperAdmin && (
            <>
              <p className="mb-1 mt-4 px-3 font-mono text-[11px] uppercase tracking-wider text-muted">Super admin</p>
              <NavLink
                to="/admin/settings"
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium",
                    isActive ? "bg-ink text-paper" : "text-ink-soft hover:bg-slate-100"
                  )
                }
              >
                <Settings size={17} />
                Site Settings
              </NavLink>
              <NavLink
                to="/admin/logs"
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium",
                    isActive ? "bg-ink text-paper" : "text-ink-soft hover:bg-slate-100"
                  )
                }
              >
                <ScrollText size={17} />
                System Logs
              </NavLink>
            </>
          )}
        </nav>
      </aside>
      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  );
}
