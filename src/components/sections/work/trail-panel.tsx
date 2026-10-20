import * as React from "react";

import { ImageTrail } from "@/components/effects/image-trail/image-trail";

/** Left bento panel: heading + cursor image trail. The panel is the pointer target. */
function TrailPanel({ heading, images }: { heading: React.ReactNode; images: React.ReactNode[] }) {
  return (
    <div
      data-work-panel
      className="relative min-h-[calc(100svh-1.5rem)] overflow-hidden rounded-panel bg-surface p-6 md:p-10"
    >
      <ImageTrail images={images} />
      <div className="relative">{heading}</div>
    </div>
  );
}

export { TrailPanel };
