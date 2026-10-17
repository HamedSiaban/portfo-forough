"use client";

import { useGSAP } from "@gsap/react";
import * as React from "react";

import { WaveField } from "@/components/effects/wave-field";
import { Panel } from "@/components/ui/panel";
import { useIsTouch } from "@/hooks/use-is-touch";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { gsap } from "@/lib/gsap";

type QuotePanelProps = { lines: string[]; author: string; role: string };

/**
 * Inverse-surface testimonial with the shared wave glow (palette "dark") over a halftone.
 * Each quote line sits in an overflow mask and rises into place on enter. The header flips to
 * its dark variant while this panel is under it (`data-header-theme`).
 */
function QuotePanel({ lines, author, role }: QuotePanelProps) {
  const panelRef = React.useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const isTouch = useIsTouch();

  useGSAP(
    () => {
      const panel = panelRef.current;
      if (!panel || reducedMotion) return;
      gsap.from(gsap.utils.toArray<HTMLElement>("[data-quote-line]", panel), {
        yPercent: 110,
        duration: 1,
        ease: "power4.out",
        stagger: 0.09,
        scrollTrigger: { trigger: panel, start: "top 70%", once: true },
      });
    },
    { dependencies: [reducedMotion], scope: panelRef, revertOnUpdate: true },
  );

  return (
    <Panel
      ref={panelRef}
      data-work-panel
      data-header-theme="dark"
      className="mx-0 min-h-112 bg-surface-inverse bg-none text-on-inverse [--halftone-dot:rgb(255_255_255/0.08)] md:mx-0 lg:min-h-[85svh] dark:[--halftone-dot:rgb(0_0_0/0.08)]"
      contentClassName="flex h-full min-h-[inherit] flex-col justify-between gap-12 p-6 md:p-10"
      overlay={
        <WaveField
          className="absolute inset-0"
          palette="dark"
          halftone
          backdrop={false}
          idleDrift={isTouch}
          pointerTarget={panelRef}
        />
      }
    >
      <figure className="flex flex-1 flex-col justify-between gap-12">
        <blockquote>
          <span aria-hidden className="block text-display-md">
            “
          </span>
          <p className="text-display-md">
            {lines.map((line) => (
              <span key={line} className="block overflow-hidden pb-[0.08em]">
                <span data-quote-line className="block">
                  {line}
                </span>
              </span>
            ))}
          </p>
        </blockquote>
        <figcaption className="text-body-lg">
          — {author}, {role}
        </figcaption>
      </figure>
    </Panel>
  );
}

export { QuotePanel };
