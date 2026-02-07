"use client";

import { cn } from "@/lib/utils";

interface TronScanlinesProps {
  className?: string;
  intensity?: "light" | "medium" | "heavy";
  animated?: boolean;
}

export function TronScanlines({
  className,
  intensity = "light",
  animated = false,
}: TronScanlinesProps) {
  const intensityOpacity = {
    light: "0.03",
    medium: "0.06",
    heavy: "0.1",
  };

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 z-50",
        animated && "overflow-hidden",
        className,
      )}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, ${intensityOpacity[intensity]}) 2px,
            rgba(0, 0, 0, ${intensityOpacity[intensity]}) 4px
          )`,
        }}
      />

      {animated && (
        <div
          className="absolute left-0 right-0 h-px bg-primary/20"
          style={{
            animation: "scanline 8s linear infinite",
          }}
        />
      )}

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(0,0,0,0.3) 100%)",
        }}
      />
    </div>
  );
}
