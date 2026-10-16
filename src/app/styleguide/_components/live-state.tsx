"use client";

import { useIsTouch } from "@/hooks/use-is-touch";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

function LiveState() {
  const reducedMotion = useReducedMotion();
  const isTouch = useIsTouch();

  return (
    <dl className="grid grid-cols-2 gap-4 text-sm">
      <div>
        <dt className="text-label text-muted-foreground">useReducedMotion()</dt>
        <dd>{String(reducedMotion)}</dd>
      </div>
      <div>
        <dt className="text-label text-muted-foreground">useIsTouch()</dt>
        <dd>{String(isTouch)}</dd>
      </div>
    </dl>
  );
}

export { LiveState };
