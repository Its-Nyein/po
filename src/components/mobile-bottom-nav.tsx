import { useNotifications } from "@/api/queries/notification.queries";
import { useAuth } from "@/lib/use-auth";
import { Bell, Home, Search, UserCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { title: "Feed", url: "/", icon: Home },
  { title: "Search", url: "/search", icon: Search },
  { title: "Notifications", url: "/notifications", icon: Bell },
  { title: "Profile", url: "/profile", icon: UserCircle },
] as const;

export function MobileBottomNav() {
  const location = useLocation();
  const { user } = useAuth();
  const { data: notis } = useNotifications();

  const unreadCount =
    notis?.filter((n: { read: boolean }) => !n.read).length ?? 0;

  function isActive(url: string) {
    if (url === "/") return location.pathname === "/";
    return location.pathname.startsWith(url);
  }

  function getUrl(item: (typeof navItems)[number]) {
    if (item.title === "Profile") return `/profile/${user?.id}`;
    return item.url;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden border-t border-primary/30 bg-background/80 backdrop-blur-md">
      {navItems.map((item) => {
        const active = isActive(item.url);
        return (
          <Link
            key={item.title}
            to={getUrl(item)}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2 transition-colors ${
              active
                ? "text-primary"
                : "text-muted-foreground hover:text-primary/70"
            }`}
          >
            <span className="relative">
              <item.icon
                className={`size-5 ${active ? "drop-shadow-[0_0_6px_var(--tron-glow)]" : ""}`}
              />
              {item.title === "Notifications" && unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </span>
            <span
              className={`text-[10px] font-body tracking-wide ${active ? "font-semibold" : ""}`}
            >
              {item.title}
            </span>
            {active && (
              <span className="absolute top-0 h-0.5 w-10 rounded-b bg-primary shadow-[0_0_8px_var(--tron-glow)]" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
