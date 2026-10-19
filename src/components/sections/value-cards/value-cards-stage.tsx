"use client";

import { useGSAP } from "@gsap/react";
import * as React from "react";

import { gsap, ScrollTrigger } from "@/lib/gsap";

import { ENTER, EXIT, EXIT_UNITS, pinLength, stackState, STEP_VH, TAB_PX } from "./stack-config";

type ValueCardsStageProps = {
  headline: React.ReactNode;
  body: React.ReactNode;
  /** The <li> cards, in order. Their count sets the pin length. */
  children: React.ReactNode;
};

/**
 * Pinned card stack. One scrubbed master timeline, one segment per card:
 *   card i flies in from in front of the screen (z/scale large, rotateX strong, blurred) while
 *   every card already placed recedes one level (up, smaller, darker, tab edge left visible).
 * Each recede tween is an explicit fromTo with values from `stackState`, so any scroll
 * position maps to exactly one pose and forward/back is perfectly reversible. A final
 * half-unit lifts and fades the stack so whatever follows can overlap it.
 * Technique: ScrollTrigger pin on the inner stage (pin-spacer keeps the section self-contained,
 * no neighbour measuring), gsap.matchMedia for desktop/mobile/reduced-motion variants.
 */
function ValueCardsStage({ headline, body, children }: ValueCardsStageProps) {
  const rootRef = React.useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const stage = root.querySelector<HTMLElement>("[data-stage]");
      const stack = root.querySelector<HTMLElement>("[data-stack]");
      const headlineEl = root.querySelector<HTMLElement>("[data-headline]");
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]", root);
      if (!stage || !stack || !headlineEl || cards.length === 0) return;

      const shades = cards.map((card) => card.querySelector<HTMLElement>("[data-shade]"));
      const mm = gsap.matchMedia();

      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          wide: "(min-width: 768px)",
          coarse: "(pointer: coarse)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { motion, wide, coarse, reduce } = context.conditions as Record<string, boolean>;

          if (reduce) {
            // No pin, no 3D: the cards are a plain list (CSS) that simply fades in.
            gsap.set(cards, { opacity: 0 });
            cards.forEach((card) => {
              ScrollTrigger.create({
                trigger: card,
                start: "top 88%",
                once: true,
                onEnter: () => {
                  gsap.to(card, { opacity: 1, duration: 0.6, ease: "power2.out" });
                },
              });
            });
            return;
          }
          if (!motion) return;

          const tab = wide ? TAB_PX.desktop : TAB_PX.mobile;
          const stepPx = () => window.innerHeight * (wide ? STEP_VH.desktop : STEP_VH.mobile);
          const count = cards.length;

          const timeline = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: root,
              start: "top top",
              end: () => `+=${pinLength(count, stepPx())}`,
              pin: stage,
              scrub: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          gsap.set(cards, { transformOrigin: "50% 0" });

          cards.forEach((card, index) => {
            // Entering card: fly in over segment [index, index + 1].
            timeline.fromTo(
              card,
              {
                y: () => window.innerHeight * ENTER.yVh,
                z: ENTER.z,
                rotateX: ENTER.rotateX,
                scale: ENTER.scale,
              },
              { y: 0, z: 0, rotateX: 0, scale: 1, duration: 1, ease: "power2.out" },
              index,
            );
            timeline.fromTo(
              card,
              { opacity: 0 },
              { opacity: 1, duration: ENTER.opacityEnd },
              index,
            );
            if (!coarse) {
              // Blur is the one non-compositor property: one card at a time, never on touch.
              timeline.fromTo(
                card,
                { filter: `blur(${ENTER.blurPx}px)` },
                { filter: "blur(0px)", duration: ENTER.blurEnd },
                index,
              );
            }

            // Cards already placed recede one level during this segment.
            for (let placed = 0; placed < index; placed += 1) {
              const from = stackState(index - 1 - placed, tab);
              const to = stackState(index - placed, tab);
              timeline.fromTo(
                cards[placed] as HTMLElement,
                { y: from.y, scale: from.scale },
                { y: to.y, scale: to.scale, duration: 1 },
                index,
              );
              const shade = shades[placed];
              if (shade) {
                timeline.fromTo(
                  shade,
                  { opacity: from.shade },
                  { opacity: to.shade, duration: 1 },
                  index,
                );
              }
            }
          });

          // Exit: lift and fade the stack wrapper (its own element, no double-tweening).
          timeline.to(stack, { yPercent: EXIT.yPercent, opacity: 0, duration: EXIT_UNITS }, count);
          timeline.to(headlineEl, { opacity: 0, duration: EXIT_UNITS }, count);
        },
      );

      // Display type changes the headline height once fonts land.
      let cancelled = false;
      void document.fonts.ready.then(() => {
        if (!cancelled) ScrollTrigger.refresh();
      });

      return () => {
        cancelled = true;
        mm.revert();
      };
    },
    { scope: rootRef },
  );

  return (
    // Negative bottom margin = the exit scroll (EXIT_UNITS x STEP_VH), so whatever follows rises
    // over the lifting, fading stack instead of arriving after a blank pinned screen.
    <section
      ref={rootRef}
      id="approach"
      className="relative mb-[-35svh] motion-reduce:mb-0 md:mb-[-45svh]"
    >
      <div
        data-stage
        className="relative flex h-svh items-center justify-center overflow-hidden motion-reduce:block motion-reduce:h-auto motion-reduce:overflow-visible motion-reduce:py-24"
      >
        <div
          data-headline
          className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-4 text-center motion-reduce:static motion-reduce:translate-y-0"
        >
          {headline}
          {body}
        </div>
        <div data-stack className="absolute inset-0 motion-reduce:static">
          <ul className="grid h-full justify-center justify-items-center pt-[16svh] perspective-(--perspective-stack) perspective-origin-[50%_40%] motion-reduce:mt-16 motion-reduce:flex motion-reduce:h-auto motion-reduce:flex-col motion-reduce:items-center motion-reduce:gap-6 motion-reduce:pt-0 motion-reduce:perspective-none">
            {children}
          </ul>
        </div>
      </div>
    </section>
  );
}

export { ValueCardsStage };
