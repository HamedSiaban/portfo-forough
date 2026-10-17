"use client";

import * as React from "react";

import { ImageTrail } from "@/components/effects/image-trail/image-trail";

/** Left bento panel: heading + cursor image trail. The panel itself is the pointer target. */
function TrailPanel({ heading, images }: { heading: React.ReactNode; images: React.ReactNode[] }) {
  const panelRef = React.useRef<HTMLDivElement>(null);

  return (
    <div
      ref={panelRef}
      data-work-panel
      className="relative min-h-112 overflow-hidden rounded-panel bg-surface p-6 md:p-10 lg:min-h-[85svh]"
    >
      <ImageTrail images={images} targetRef={panelRef} />
      <div className="relative">{heading}</div>
    </div>
  );
}

export { TrailPanel };
