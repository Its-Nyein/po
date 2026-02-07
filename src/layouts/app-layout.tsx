import { AppSidebar } from "@/components/app-sidebar";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { ModeToggle } from "@/components/mode-toggle";
import { TronGrid3D } from "@/components/tron/TronGrid3D";
import { TronStatusStrip } from "@/components/tron/TronStatusStrip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useWebSocket } from "@/hooks/use-websocket";
import { useAuth } from "@/lib/use-auth";
import { LogOut, User } from "lucide-react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { routeTitles } from "./route-titles";

export function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const pageTitle = getRouteTitle(location.pathname);

  useWebSocket();

  function getRouteTitle(pathname: string): string {
    for (const [pattern, title] of Object.entries(routeTitles)) {
      const regexPattern = "^" + pattern.replace(/:[^/]+/g, "[^/]+") + "$";
      const regex = new RegExp(regexPattern);
      if (regex.test(pathname)) {
        return title;
      }
    }
    return "Po";
  }

  return (
    <SidebarProvider>
      <div className="fixed inset-0 -z-10 opacity-30">
        <TronGrid3D showParticles={false} showHorizon />
      </div>

      <div
        className="fixed inset-0 -z-5 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at bottom, var(--tron-dim) 0%, transparent 50%), linear-gradient(to bottom, var(--background) 0%, var(--background) 100%)",
        }}
      />

      <AppSidebar />
      <SidebarInset className="bg-transparent">
        <TronStatusStrip
          items={[
            { label: "Status", value: "Online", status: "normal" },
            { label: "User", value: user?.name || "Guest" },
          ]}
          className="border-b border-primary/20 bg-background/80 backdrop-blur-sm"
        />

        <header className="flex h-12 md:h-14 shrink-0 items-center gap-1 md:gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-background/50 backdrop-blur-sm border-b border-primary/10">
          <div className="flex min-w-0 flex-1 items-center gap-1.5 md:gap-2 px-2 md:px-4">
            <SidebarTrigger className="-ml-1 shrink-0 text-primary hover:text-primary/80 hover:bg-primary/10 hidden md:inline-flex" />
            <Separator
              orientation="vertical"
              className="mr-1 md:mr-2 h-4 hidden md:block"
            />
            <h2 className="truncate text-sm md:text-lg font-heading text-primary tracking-wider">
              {pageTitle}
            </h2>
          </div>
          <div className="flex shrink-0 items-center gap-2 md:gap-4 px-2 md:px-4">
            <ModeToggle />
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-7 w-7 md:h-8 md:w-8 cursor-pointer hover:ring-primary transition-all">
                    <AvatarFallback className="text-xs md:text-sm">
                      {user.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("") || "U"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none text-primary">
                        {user.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        @{user.username}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => navigate(`/profile/${user.id}`)}
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      logout();
                      toast.success("Logged out successfully");
                      navigate("/login");
                    }}
                    variant="destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-2 md:p-4 pt-2 md:pt-4 pb-16 md:pb-4">
          <div className="max-w-2xl mx-auto w-full">
            <Outlet />
          </div>
        </div>
        <MobileBottomNav />
      </SidebarInset>
    </SidebarProvider>
  );
}
