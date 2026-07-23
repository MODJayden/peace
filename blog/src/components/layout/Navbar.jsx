import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Search, Menu, X, Bell, Bookmark, LayoutDashboard, LogOut, User, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { logoutUser } from "@/features/auth/authSlice";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const NAV_CATEGORIES = ["Politics", "Business", "Technology", "Sports", "Entertainment", "World News"];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated, isAuthor, isAdmin } = useAuth();
  const unreadCount = useSelector((state) => state.notifications.unreadCount);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
    setQuery("");
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-6">
          <button
            className="md:hidden text-ink"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <Link to="/" className="font-display text-2xl font-bold tracking-tight text-ink">
            Sir<span className="text-accent">Peace</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-5">
            {NAV_CATEGORIES.map((name) => (
              <Link
                key={name}
                to={`/category/${name.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-sm font-medium text-ink-soft hover:text-accent transition-colors"
              >
                {name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {searchOpen ? (
            <form onSubmit={handleSearchSubmit} className="flex items-center">
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onBlur={() => !query && setSearchOpen(false)}
                placeholder="Search SirPeace..."
                className="w-48 sm:w-64 rounded-md border border-line-strong bg-paper px-3 py-1.5 text-sm focus-visible:outline-none focus-visible:border-accent"
              />
            </form>
          ) : (
            <button
              className="text-ink-soft hover:text-ink"
              onClick={() => setSearchOpen(true)}
              aria-label="Open search"
            >
              <Search size={20} />
            </button>
          )}

          {isAuthenticated ? (
            <>
              <Link to="/notifications" className="relative text-ink-soft hover:text-ink" aria-label="Notifications">
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-breaking px-1 text-[10px] font-bold text-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none">
                  <Avatar src={user?.avatar?.url} name={user?.name} size={36} />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-2.5 py-2 text-sm">
                    <p className="font-semibold text-ink truncate">{user?.name}</p>
                    <p className="text-xs text-muted truncate">@{user?.username}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={`/author/${user?.username}`}>
                      <User size={16} className="mr-2" /> Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/bookmarks">
                      <Bookmark size={16} className="mr-2" /> Bookmarks
                    </Link>
                  </DropdownMenuItem>
                  {isAuthor && (
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard">
                        <LayoutDashboard size={16} className="mr-2" /> Author dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin">
                        <ShieldCheck size={16} className="mr-2" /> Admin
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={handleLogout} className="text-breaking">
                    <LogOut size={16} className="mr-2" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Button as={Link} to="/login" variant="ghost" size="sm">
                Log in
              </Button>
              <Button as={Link} to="/register" variant="accent" size="sm">
                Sign up
              </Button>
            </div>
          )}
        </div>
      </div>

      {mobileOpen && (
        <nav className="lg:hidden border-t border-line bg-surface px-4 py-3 flex flex-col gap-3">
          {NAV_CATEGORIES.map((name) => (
            <Link
              key={name}
              to={`/category/${name.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-sm font-medium text-ink-soft"
              onClick={() => setMobileOpen(false)}
            >
              {name}
            </Link>
          ))}
          {!isAuthenticated && (
            <div className="flex gap-2 pt-2">
              <Button as={Link} to="/login" variant="outline" size="sm" className="flex-1">
                Log in
              </Button>
              <Button as={Link} to="/register" variant="accent" size="sm" className="flex-1">
                Sign up
              </Button>
            </div>
          )}
        </nav>
      )}
    </header>
  );
}
