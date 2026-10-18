import * as React from "react";

import { cn } from "@/lib/cn";

type StepRowProps = React.ComponentProps<"div"> & {
  step: number;
  label: string;
  active?: boolean;
  disabled?: boolean;
  /** Visually dim without blocking input, so keyboard users are never trapped behind an earlier step. */
  dimmed?: boolean;
};

/**
 * Numbered step row (DESIGN_SPEC §4): badge · hairline · uppercase label.
 * Used by the inquiry form. Disabled steps dim until the
 * previous step is valid.
 */
function StepRow({
  step,
  label,
  active = true,
  disabled = false,
  dimmed = false,
  className,
  ...props
}: StepRowProps) {
  return (
    <div
      data-slot="step-row"
      className={cn(
        "flex items-center gap-4 transition-opacity",
        disabled && "pointer-events-none opacity-50",
        dimmed && "opacity-50",
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "flex size-6 shrink-0 items-center justify-center rounded-input text-xs font-medium",
          active ? "bg-foreground text-background" : "bg-surface-muted text-subtle-foreground",
        )}
      >
        {step}
      </span>
      <span className="h-px flex-1 bg-border" />
      <span className={cn("text-label", active ? "text-foreground" : "text-subtle-foreground")}>
        {label}
      </span>
    </div>
  );
}

export { StepRow };
