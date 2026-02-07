import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
        "h-9 w-full min-w-0 rounded-sm border border-primary/30 bg-background/50 px-3 py-1 text-base shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]",
        "transition-all duration-200 outline-none",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "md:text-sm font-body",
        "focus:border-primary focus:shadow-[0_0_10px_var(--tron-dim),inset_0_0_10px_rgba(0,0,0,0.5)] focus:ring-1 focus:ring-primary/50",
        "hover:border-primary/50",
        "aria-invalid:border-destructive aria-invalid:shadow-[0_0_10px_rgba(255,51,102,0.2)]",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
