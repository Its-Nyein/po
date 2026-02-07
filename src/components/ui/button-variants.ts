import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-medium font-body tracking-wide transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 border border-primary shadow-[0_0_10px_var(--tron-dim)] hover:shadow-[0_0_15px_var(--tron-glow)]",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 border border-destructive shadow-[0_0_10px_rgba(255,51,102,0.3)]",
        outline:
          "border border-primary/50 bg-transparent hover:bg-primary/10 hover:border-primary text-primary shadow-[inset_0_0_10px_var(--tron-dim)] hover:shadow-[0_0_10px_var(--tron-dim)]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-primary/30",
        ghost:
          "hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/30",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/80",
        tron: "relative bg-transparent border-2 border-primary text-primary font-heading tracking-widest uppercase hover:bg-primary hover:text-primary-foreground shadow-[0_0_15px_var(--tron-dim),inset_0_0_15px_var(--tron-dim)] hover:shadow-[0_0_25px_var(--tron-glow),inset_0_0_25px_var(--tron-glow)] before:absolute before:inset-0 before:bg-primary/5",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3 rounded-sm",
        xs: "h-6 gap-1 rounded-sm px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 rounded-sm gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-sm px-6 has-[>svg]:px-4",
        icon: "size-9 rounded-sm",
        "icon-xs": "size-6 rounded-sm [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8 rounded-sm",
        "icon-lg": "size-10 rounded-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);
