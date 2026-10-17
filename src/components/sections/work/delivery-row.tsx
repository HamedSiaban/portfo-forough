"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { useUiStore } from "@/stores/ui-store";

import { useDragScroll } from "./use-drag-scroll";

type DeliveryRowProps = {
  title: string;
  note: string;
  cta: string;
  projectsLabel: string;
  /** Server-rendered <ProjectCard />s. */
  children: React.ReactNode;
};

/**
 * "Latest delivery": intro + a horizontally scrollable card row. The row is a focusable region
 * (arrow keys scroll natively), drag-scrolls with inertia on mouse, swipes natively on touch,
 * and fades at both edges.
 */
function DeliveryRow({ title, note, cta, projectsLabel, children }: DeliveryRowProps) {
  const openInquiry = useUiStore((state) => state.openInquiry);
  const trackRef = React.useRef<HTMLDivElement>(null);
  useDragScroll(trackRef);

  return (
    <div
      data-work-panel
      className="flex min-w-0 flex-col gap-6 rounded-panel bg-surface-muted p-4 md:p-6 lg:flex-row lg:items-center"
    >
      <div className="flex shrink-0 flex-col items-start gap-4 px-2 lg:w-56">
        <h3 className="text-display-md lg:text-heading">{title}</h3>
        <p className="text-body text-muted-foreground">{note}</p>
        <Button size="md" onClick={() => openInquiry()}>
          {cta}
        </Button>
      </div>
      <div
        ref={trackRef}
        role="region"
        aria-label={projectsLabel}
        tabIndex={0}
        className="min-w-0 flex-1 cursor-grab scrollbar-none overflow-x-auto rounded-card mask-[linear-gradient(to_right,transparent,black_1.5rem,black_calc(100%-1.5rem),transparent)] outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-scrollbar]:hidden"
      >
        <ul className="flex w-max gap-3 px-6">{children}</ul>
      </div>
    </div>
  );
}

export { DeliveryRow };
