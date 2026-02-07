import { AppSidebar } from "@/components/app-sidebar";
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
import { useAuth } from "@/lib/use-auth";
import { useWebSocket } from "@/hooks/use-websocket";
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

        <header className="flex h-14 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-background/50 backdrop-blur-sm border-b border-primary/10">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1 text-primary hover:text-primary/80 hover:bg-primary/10" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h2 className="text-lg font-heading text-primary tracking-wider">
              {pageTitle}
            </h2>
          </div>
          <div className="ml-auto flex items-center gap-4 px-4">
            <ModeToggle />
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-8 w-8 cursor-pointer hover:ring-primary transition-all">
                    <AvatarFallback>
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
        <div className="flex flex-1 flex-col gap-4 p-4 pt-4">
          <div className="max-w-2xl mx-auto w-full">
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
