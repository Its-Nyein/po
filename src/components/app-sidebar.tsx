import { useNotifications } from "@/api/queries/notification.queries";
import { PoLogo } from "@/components/po-logo";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/use-auth";
import { Bell, Home, Search, UserCircle, type LucideIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

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
                <div className="flex aspect-square size-8 items-center justify-center text-primary group-hover:drop-shadow-[0_0_8px_var(--tron-glow)] transition-all">
                  <PoLogo size={28} />
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
