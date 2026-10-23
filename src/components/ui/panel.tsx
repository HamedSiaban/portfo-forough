import * as React from "react";

import { Halftone } from "@/components/effects/halftone";
import { cn } from "@/lib/cn";

/**
 * Shared frame used by Hero, CTA and the dark Quote panel (DESIGN_SPEC §4).
 * Insets 16px from the viewport edge, holds a halftone + gradient backdrop,
 * and a slot for a background effect (WaveField lands in Phase 03).
 */
type PanelProps = React.ComponentProps<"section"> & {
  /** Rendered above the content, non-interactive — for effects that must tint the text (Hero wave glow). */
  overlay?: React.ReactNode;
  /** Classes for the inner content wrapper (layout of the panel's children). */
  contentClassName?: string;
  /** Set false for panels whose own effect replaces the dot pattern (CTA image trail). */
  halftone?: boolean;
};

function Panel({
  className,
  contentClassName,
  children,
  overlay,
  halftone = true,
  ...props
}: PanelProps) {
  return (
    <section
      data-slot="panel"
      className={cn(
        "relative mx-4 overflow-hidden rounded-panel bg-linear-to-b from-surface-muted to-background md:mx-12",
        className,
      )}
      {...props}
    >
      {halftone && <Halftone />}
      <div className={cn("relative", contentClassName)}>{children}</div>
      {overlay && <div className="pointer-events-none absolute inset-0">{overlay}</div>}
    </section>
  );
}

export { Panel };
