import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/cn";

const cardVariants = cva("rounded-card p-6", {
  variants: {
    variant: {
      surface: "bg-surface text-foreground",
      muted: "bg-surface-muted text-foreground",
      inverse: "bg-surface-inverse text-on-inverse",
    },
  },
  defaultVariants: {
    variant: "surface",
  },
});

function Card({
  className,
  variant = "surface",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof cardVariants>) {
  return <div data-slot="card" className={cn(cardVariants({ variant, className }))} {...props} />;
}

export { Card, cardVariants };
