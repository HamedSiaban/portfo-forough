import * as React from "react";

import { cn } from "@/lib/cn";

const densitySizes = {
  sm: "6px 6px",
  md: "10px 10px",
  lg: "16px 16px",
} as const;

type HalftoneProps = React.ComponentProps<"div"> & {
  density?: keyof typeof densitySizes;
};

/**
 * Static halftone dot texture (DESIGN_SPEC §1/§4). Decorative only — the
 * fluid/WebGL variant that reacts to the pointer lands in Phase 03.
 */
function Halftone({ density = "md", className, style, ...props }: HalftoneProps) {
  return (
    <div
      data-slot="halftone"
      aria-hidden
      role="presentation"
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{
        backgroundImage: "radial-gradient(var(--halftone-dot) 1px, transparent 1px)",
        backgroundSize: densitySizes[density],
        ...style,
      }}
      {...props}
    />
  );
}

export { Halftone };
