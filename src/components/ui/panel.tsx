import * as React from "react";

import { Halftone } from "@/components/effects/halftone";
import { cn } from "@/lib/cn";

/**
 * Shared frame used by Hero, CTA and the dark Quote panel (DESIGN_SPEC §4).
 * Insets 16px from the viewport edge, holds a halftone + gradient backdrop,
 * and a slot for a background effect (WaveField lands in Phase 03).
 */
function Panel({ className, children, ...props }: React.ComponentProps<"section">) {
  return (
    <section
      data-slot="panel"
      className={cn(
        "relative mx-4 overflow-hidden rounded-panel bg-linear-to-b from-surface-muted to-background md:mx-12",
        className,
      )}
      {...props}
    >
      <Halftone />
      <div className="relative">{children}</div>
    </section>
  );
}

export { Panel };
