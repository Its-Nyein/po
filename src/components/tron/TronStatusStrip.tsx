"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface StatusItem {
  label: string;
  value: string | number;
  status?: "normal" | "warning" | "critical";
}

interface TronStatusStripProps {
  items?: StatusItem[];
  className?: string;
  showTime?: boolean;
}

export function TronStatusStrip({
  items = [],
  className,
  showTime = true,
}: TronStatusStripProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    if (!showTime) return;
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [showTime]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  const statusColors = {
    normal: "text-primary",
    warning: "text-yellow-500",
    critical: "text-destructive",
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between px-4 py-2 border-b border-primary/20",
        "bg-background/50 backdrop-blur-sm",
        className,
      )}
    >
      <div className="flex items-center gap-6">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-heading">
              {item.label}:
            </span>
            <span
              className={cn(
                "text-sm font-medium",
                statusColors[item.status || "normal"],
              )}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {showTime && (
        <div className="flex items-center gap-4">
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-heading">
            {formatDate(currentTime)}
          </span>
          <span className="text-sm font-medium text-primary font-heading tracking-widest">
            {formatTime(currentTime)}
          </span>
        </div>
      )}
    </div>
  );
}
