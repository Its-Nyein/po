import { cva } from "class-variance-authority";

export const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-sm border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none transition-all overflow-hidden font-body tracking-wide",
  {
    variants: {
      variant: {
        default:
          "border-primary/50 bg-primary/10 text-primary shadow-[0_0_10px_var(--tron-dim)] [a&]:hover:bg-primary/20",
        secondary:
          "border-primary/30 bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/80",
        destructive:
          "border-destructive/50 bg-destructive/10 text-destructive shadow-[0_0_10px_rgba(255,51,102,0.2)] [a&]:hover:bg-destructive/20",
        outline:
          "text-foreground border-primary/30 [a&]:hover:bg-primary/10 [a&]:hover:text-primary",
        glow: "border-primary bg-primary/20 text-primary animate-pulse shadow-[0_0_15px_var(--tron-glow)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);
