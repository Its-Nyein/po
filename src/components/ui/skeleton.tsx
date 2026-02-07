import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "rounded-sm bg-primary/10 relative overflow-hidden",
        "after:absolute after:inset-0 after:translate-x-[-100%] after:bg-linear-to-r after:from-transparent after:via-primary/5 after:to-transparent after:animate-[shimmer_2s_infinite]",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
