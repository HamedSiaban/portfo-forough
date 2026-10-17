"use client";

import * as React from "react";

/**
 * Tracks whether an element is within the viewport (plus `rootMargin`). `hasBeenInViewport`
 * latches true so lazy work (attaching a video src) happens once.
 */
function useInViewport<T extends Element>(
  ref: React.RefObject<T | null>,
  rootMargin = "0px",
): { inViewport: boolean; hasBeenInViewport: boolean } {
  const [state, setState] = React.useState({ inViewport: false, hasBeenInViewport: false });

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        if (!entry) return;
        setState((prev) => ({
          inViewport: entry.isIntersecting,
          hasBeenInViewport: prev.hasBeenInViewport || entry.isIntersecting,
        }));
      },
      { rootMargin },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, rootMargin]);

  return state;
}

export { useInViewport };
