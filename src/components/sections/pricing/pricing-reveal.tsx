"use client";

import { useGSAP } from "@gsap/react";
import * as React from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Section enter: direct children marked `data-pricing-panel` rise with a stagger once the
 * grid is 85% in view. Initial state is set from JS so content is visible without JS and
 * reduced-motion users get the final state untouched. `clearProps` drops the transform
 * afterwards so the sticky title column is never left inside a transformed ancestor state.
 */
function PricingReveal({ children, className }: { children: React.ReactNode; className?: string }) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || reducedMotion) return;
      const panels = gsap.utils.toArray<HTMLElement>("[data-pricing-panel]", root);

      gsap.from(panels, {
        y: 48,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
        clearProps: "transform,opacity",
        scrollTrigger: { trigger: root, start: "top 85%", once: true },
      });

      let cancelled = false;
      void document.fonts.ready.then(() => {
        if (!cancelled) ScrollTrigger.refresh();
      });
      return () => {
        cancelled = true;
      };
    },
    { dependencies: [reducedMotion], scope: rootRef, revertOnUpdate: true },
  );

  return (
    <div ref={rootRef} className={className}>
      {children}
    </div>
  );
}

export { PricingReveal };
