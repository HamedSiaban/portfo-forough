"use client";

import { useGSAP } from "@gsap/react";
import * as React from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { gsap } from "@/lib/gsap";

/**
 * Masked line-rise: each line sits in an overflow mask (rendered by the server) and its inner
 * span rises from below once the statement is 80% into view. The initial offset is set from JS
 * only, so the text is fully visible without JS and under reduced motion.
 */
function InterludeReveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const rootRef = React.useRef<HTMLHeadingElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || reducedMotion) return;
      gsap.from(gsap.utils.toArray<HTMLElement>("[data-interlude-line]", root), {
        yPercent: 110,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: { trigger: root, start: "top 80%", once: true },
      });
    },
    { dependencies: [reducedMotion], scope: rootRef, revertOnUpdate: true },
  );

  return (
    <h2 ref={rootRef} id="interlude-heading" className={className}>
      {children}
    </h2>
  );
}

export { InterludeReveal };
