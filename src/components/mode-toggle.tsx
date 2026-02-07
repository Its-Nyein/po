import { Palette } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/lib/use-theme";
import { cn } from "@/lib/utils";

const colorThemes = [
  { id: "tron", name: "Tron", color: "#00d4ff", description: "Cyan" },
  { id: "ares", name: "Ares", color: "#ff4444", description: "Red" },
  { id: "clu", name: "Clu", color: "#ff9500", description: "Orange" },
  { id: "athena", name: "Athena", color: "#a855f7", description: "Purple" },
  { id: "aphrodite", name: "Aphrodite", color: "#ec4899", description: "Pink" },
  { id: "poseidon", name: "Poseidon", color: "#3b82f6", description: "Blue" },
] as const;

export function ModeToggle() {
  const { colorTheme, setColorTheme } = useTheme();

  const currentTheme =
    colorThemes.find((t) => t.id === colorTheme) || colorThemes[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative overflow-hidden border-primary/30 hover:border-primary hover:bg-primary/10"
        >
          <div
            className="absolute inset-0 opacity-20"
            style={{ backgroundColor: currentTheme.color }}
          />
          <Palette
            className="h-[1.2rem] w-[1.2rem] transition-all"
            style={{ color: currentTheme.color }}
          />
          <span className="sr-only">Select theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48 tron-glass border-primary/30"
      >
        <DropdownMenuLabel className="font-heading text-xs tracking-wider text-primary/80">
          COLOR THEME
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-primary/20" />
        {colorThemes.map((theme) => (
          <DropdownMenuItem
            key={theme.id}
            onClick={() => setColorTheme(theme.id)}
            className={cn(
              "flex items-center gap-3 cursor-pointer transition-all",
              colorTheme === theme.id && "bg-primary/10",
            )}
          >
            <div
              className={cn(
                "w-4 h-4 rounded-full transition-all",
                colorTheme === theme.id &&
                  "ring-2 ring-offset-2 ring-offset-background",
              )}
              style={{
                backgroundColor: theme.color,
                boxShadow:
                  colorTheme === theme.id
                    ? `0 0 10px ${theme.color}, 0 0 20px ${theme.color}50`
                    : "none",
                // @ts-expect-error CSS custom property for ring color
                "--tw-ring-color": theme.color,
              }}
            />
            <div className="flex flex-col">
              <span
                className={cn(
                  "text-sm font-medium",
                  colorTheme === theme.id && "text-primary",
                )}
              >
                {theme.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {theme.description}
              </span>
            </div>
            {colorTheme === theme.id && (
              <div
                className="ml-auto w-2 h-2 rounded-full animate-pulse"
                style={{
                  backgroundColor: theme.color,
                  boxShadow: `0 0 8px ${theme.color}`,
                }}
              />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
