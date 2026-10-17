"use client";

import { useGSAP } from "@gsap/react";
import * as React from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Section enter: header and list (`data-faq-block`) rise with a stagger once the section is 85%
 * in view. State is set from JS so content stays visible without it; skipped under reduced motion.
 */
function FaqReveal({ children, className }: { children: React.ReactNode; className?: string }) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || reducedMotion) return;
      gsap.from(gsap.utils.toArray<HTMLElement>("[data-faq-block]", root), {
        y: 40,
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

export { FaqReveal };
