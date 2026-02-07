import { Home, Search, Bell, UserCircle, type LucideIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/use-auth";
import { useNotifications } from "@/api/queries/notification.queries";
import { Badge } from "@/components/ui/badge";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  badge?: number;
}

export function AppSidebar() {
  const location = useLocation();
  const { user } = useAuth();
  const { data: notis } = useNotifications();

  const unreadCount =
    notis?.filter((n: { read: boolean }) => !n.read).length ?? 0;

  const navItems: NavItem[] = [
    { title: "Feed", url: "/", icon: Home },
    { title: "Search", url: "/search", icon: Search },
    {
      title: "Notifications",
      url: "/notifications",
      icon: Bell,
      badge: unreadCount,
    },
    {
      title: "Profile",
      url: `/profile/${user?.id}`,
      icon: UserCircle,
    },
  ];

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/" className="group">
                <div className="flex aspect-square size-8 items-center justify-center rounded-sm bg-primary/20 text-primary border border-primary/50 shadow-[0_0_10px_var(--tron-dim)] group-hover:shadow-[0_0_15px_var(--tron-glow)] transition-all">
                  <Home className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-heading text-primary tracking-wider">
                    PO
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    Social Network
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link to={item.url}>
                      <item.icon className="text-primary/70" />
                      <span>{item.title}</span>
                      {item.badge ? (
                        <Badge className="ml-auto" variant="destructive">
                          {item.badge}
                        </Badge>
                      ) : null}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
