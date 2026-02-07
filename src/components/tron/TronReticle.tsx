"use client";

import { cn } from "@/lib/utils";

interface TronReticleProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  animated?: boolean;
}

export function TronReticle({
  size = "md",
  className,
  animated = true,
}: TronReticleProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      <div
        className={cn(
          "absolute inset-0 rounded-full border-2 border-primary/50",
          animated && "animate-spin",
        )}
        style={{ animationDuration: "8s" }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-primary rounded-full" />
      </div>

      <div
        className={cn(
          "absolute inset-2 rounded-full border border-primary/30",
          animated && "animate-spin",
        )}
        style={{ animationDuration: "4s", animationDirection: "reverse" }}
      />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute w-full h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />
        <div className="absolute w-px h-full bg-linear-to-b from-transparent via-primary/50 to-transparent" />
      </div>

      <div
        className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full",
          animated && "animate-pulse",
        )}
        style={{ boxShadow: "0 0 8px var(--tron)" }}
      />
    </div>
  );
}
