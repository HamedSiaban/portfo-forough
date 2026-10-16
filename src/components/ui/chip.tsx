import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/cn";

const chipVariants = cva(
  "inline-flex w-fit items-center gap-1.5 rounded-full bg-surface-muted px-3 py-1 text-foreground",
  {
    variants: {
      font: {
        mono: "text-mono-ui",
        sans: "text-label",
      },
    },
    defaultVariants: {
      font: "sans",
    },
  },
);

function Chip({
  className,
  font = "sans",
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof chipVariants>) {
  return <span data-slot="chip" className={cn(chipVariants({ font, className }))} {...props} />;
}

export { Chip, chipVariants };
