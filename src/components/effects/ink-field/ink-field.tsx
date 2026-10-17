"use client";

import dynamic from "next/dynamic";
import * as React from "react";

import { Halftone } from "@/components/effects/halftone";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/cn";

import type { InkFieldProps } from "./types";

const InkFieldCanvas = dynamic(
  () => import("./ink-field-canvas").then((mod) => mod.InkFieldCanvas),
  {
    ssr: false,
  },
);

/**
 * Pointer-reactive GPU ink-in-water field, displayed as halftone dots (DESIGN_SPEC §5
 * Hero). Reduced motion gets the static `<Halftone />` only — no WebGL context is ever
 * created. The canvas engine is lazy-mounted on first intersection and then only paused
 * (not torn down) when off-screen, so scrolling doesn't thrash WebGL context creation.
 */
function InkField(props: InkFieldProps) {
  const hostRef = React.useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [hasBeenVisible, setHasBeenVisible] = React.useState(false);
  const [isIntersecting, setIsIntersecting] = React.useState(false);
  const [isHidden, setIsHidden] = React.useState(false);
  const [engineFailed, setEngineFailed] = React.useState(false);

  React.useEffect(() => {
    const host = hostRef.current;
    if (!host || reducedMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting) setHasBeenVisible(true);
      },
      { rootMargin: "200px" },
    );
    observer.observe(host);

    const handleVisibility = (): void => setIsHidden(document.hidden);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [reducedMotion]);

  const showCanvas = !reducedMotion && !engineFailed && hasBeenVisible;

  return (
    <div ref={hostRef} className={cn("relative overflow-hidden", props.className)}>
      <Halftone />
      {showCanvas && (
        <InkFieldCanvas
          {...props}
          className={undefined}
          active={isIntersecting && !isHidden}
          onError={() => setEngineFailed(true)}
        />
      )}
    </div>
  );
}

export { InkField };
