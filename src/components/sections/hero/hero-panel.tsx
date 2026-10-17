"use client";

import { useGSAP } from "@gsap/react";
import * as React from "react";

import { WaveField } from "@/components/effects/wave-field";
import { Panel } from "@/components/ui/panel";
import { useIsTouch } from "@/hooks/use-is-touch";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Client shell for the hero panel. Two jobs:
 * 1. Mount the wave glow ABOVE the (server-rendered) text so it can colour letters; the canvas
 *    is pointer-events-none, so the panel itself is the pointer target.
 * 2. Scroll-out: the panel drifts up faster than the page and shrinks slightly, scrubbed on the
 *    hero section only. The section's negative bottom margin lets whatever follows sit
 *    underneath, so it is uncovered as the panel leaves (ref 02) without this file knowing
 *    anything about its neighbour.
 */
function HeroPanel({ children }: { children: React.ReactNode }) {
  const panelRef = React.useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const isTouch = useIsTouch();

  useGSAP(
    () => {
      const panel = panelRef.current;
      if (!panel || reducedMotion) return;

      gsap.to(panel, {
        yPercent: -8,
        scale: 0.95,
        transformOrigin: "50% 100%",
        ease: "none",
        scrollTrigger: {
          trigger: panel,
          start: "bottom bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      // Display type changes the panel height once fonts land.
      let cancelled = false;
      void document.fonts.ready.then(() => {
        if (!cancelled) ScrollTrigger.refresh();
      });
      return () => {
        cancelled = true;
      };
    },
    { dependencies: [reducedMotion], scope: panelRef, revertOnUpdate: true },
  );

  return (
    <Panel
      ref={panelRef}
      className="min-h-[calc(100svh-2rem)] text-center"
      contentClassName="flex min-h-[calc(100svh-2rem)] flex-col items-center justify-center px-4 pt-28 pb-12 md:pt-32"
      overlay={
        <WaveField
          className="absolute inset-0"
          palette="accent"
          chromatic
          halftone
          backdrop={false}
          idleDrift={isTouch}
          pointerTarget={panelRef}
        />
      }
    >
      {children}
    </Panel>
  );
}

export { HeroPanel };
