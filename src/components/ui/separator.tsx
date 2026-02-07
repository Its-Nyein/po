import * as React from "react";
import { Separator as SeparatorPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        "data-[orientation=horizontal]:bg-linear-to-r data-[orientation=horizontal]:from-transparent data-[orientation=horizontal]:via-primary/50 data-[orientation=horizontal]:to-transparent",
        "data-[orientation=vertical]:bg-linear-to-b data-[orientation=vertical]:from-transparent data-[orientation=vertical]:via-primary/50 data-[orientation=vertical]:to-transparent",
        className,
      )}
      {...props}
    />
  );
}

export { Separator };
