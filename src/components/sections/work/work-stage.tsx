"use client";

import { useGSAP } from "@gsap/react";
import * as React from "react";

import { useSmoothScroll } from "@/components/motion/smooth-scroll";
import { work } from "@/content/work";
import { cn } from "@/lib/cn";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/** Wheel/touch distance (px) of "pushing" needed to fill the gate. */
const GATE_DISTANCE_PX = 4000;
/** How far the content lifts (px) at full resistance; also what reveals the indicator. */
const RUBBER_PX = 72;
/** Seconds without input before the gate starts draining again. */
const IDLE_S = 0.25;
const DRAIN_PER_S = 0.9;
const RING_RADIUS = 18;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

/**
 * Work section shell: a full-screen frame with an "overscroll resistance" exit.
 * 1. When the section's bottom reaches the viewport (scrolling down) the page is held in place
 *    (Lenis paused) and wheel/touch/keys feed a 0→1 gate instead of scrolling.
 * 2. The content rubber-bands up and a progress ring + "Want to know me more?" is revealed
 *    beneath it; the gate drains if the user stops, and releases upward if they scroll back.
 * 3. At 1 the page scrolls on and the section stays pinned (no pin spacing) while whatever
 *    follows slides over it, scaling and dimming it (the section never measures its neighbour).
 * Technique: ScrollTrigger (pin + gate arming), gsap.ticker for the drain, gsap.quickSetter for
 * the rubber/ring. Desktop + motion only: under `md` the section is taller than the viewport,
 * and reduced motion gets a plain static section. Keyboard users can press Down/PageDown/Space
 * or the label button to pass the gate at once.
 */
function WorkStage({
  children,
  bodyClassName,
  ...props
}: React.ComponentProps<"section"> & { children: React.ReactNode; bodyClassName?: string }) {
  const rootRef = React.useRef<HTMLElement>(null);
  const { scrollTo, setPaused } = useSmoothScroll();
  const passGate = React.useRef<() => void>(() => {});

  useGSAP(
    () => {
      const root = rootRef.current;
      const body = root?.querySelector<HTMLElement>("[data-stage-body]");
      const rubber = root?.querySelector<HTMLElement>("[data-stage-rubber]");
      const shade = root?.querySelector<HTMLElement>("[data-stage-shade]");
      const gate = root?.querySelector<HTMLElement>("[data-stage-gate]");
      const ring = root?.querySelector<SVGElement>("[data-gate-ring]");
      if (!root || !body || !rubber || !shade || !gate || !ring) return;

      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const pin = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root,
            start: "bottom bottom",
            end: () => `+=${window.innerHeight * 0.5}`,
            pin: true,
            pinSpacing: false,
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
        pin.to(body, { scale: 0.94, transformOrigin: "50% 100%" }, 0);
        pin.to(shade, { opacity: 0.6 }, 0);

        let armed = false;
        let progress = 0;
        let idle = 0;
        let anchor = 0;
        let touchY = 0;
        const setRubber = gsap.quickSetter(rubber, "y", "px");
        const setGate = gsap.quickSetter(gate, "opacity");

        const render = () => {
          // Ease-out so the first push moves the content most: it feels like it pushes back.
          setRubber(-RUBBER_PX * (1 - (1 - progress) ** 2));
          setGate(Math.min(1, progress * 3));
          gsap.set(ring, { strokeDashoffset: RING_LENGTH * (1 - progress) });
          gate.style.pointerEvents = progress > 0 ? "auto" : "none";
        };

        const drain = (_time: number, deltaMs: number) => {
          idle += deltaMs / 1000;
          if (idle > IDLE_S && progress > 0) {
            progress = Math.max(0, progress - (DRAIN_PER_S * deltaMs) / 1000);
            render();
          }
        };

        const detach = () => {
          armed = false;
          gsap.ticker.remove(drain);
          window.removeEventListener("wheel", onWheel);
          window.removeEventListener("touchstart", onTouchStart);
          window.removeEventListener("touchmove", onTouchMove);
          window.removeEventListener("keydown", onKey);
          window.removeEventListener("scroll", onScroll);
        };

        const release = () => {
          if (!armed) return;
          detach();
          setPaused(false);
          gsap.to(progressProxy, {
            p: 0,
            duration: 0.4,
            ease: "power2.out",
            onUpdate: () => {
              progress = progressProxy.p;
              render();
            },
          });
        };

        const complete = () => {
          if (!armed) return;
          detach();
          progress = 1;
          render();
          setPaused(false);
          const target = root.getBoundingClientRect().bottom + window.scrollY;
          scrollTo(target, { duration: 1.4 });
          progressProxy.p = 1;
          gsap.to(progressProxy, {
            p: 0,
            duration: 0.6,
            delay: 0.5,
            ease: "power2.inOut",
            onUpdate: () => {
              progress = progressProxy.p;
              render();
            },
          });
        };
        passGate.current = complete;

        const push = (delta: number) => {
          idle = 0;
          if (delta < 0 && progress <= 0.01) {
            release();
            return;
          }
          progress = Math.min(1, Math.max(0, progress + delta / GATE_DISTANCE_PX));
          render();
          if (progress >= 1) complete();
        };

        function onWheel(event: WheelEvent) {
          event.preventDefault();
          push(event.deltaY);
        }
        function onTouchStart(event: TouchEvent) {
          touchY = event.touches[0]?.clientY ?? 0;
        }
        function onTouchMove(event: TouchEvent) {
          const y = event.touches[0]?.clientY ?? touchY;
          event.preventDefault();
          push((touchY - y) * 1.6);
          touchY = y;
        }
        function onKey(event: KeyboardEvent) {
          if (["ArrowDown", "PageDown", " ", "End"].includes(event.key)) {
            event.preventDefault();
            complete();
          } else if (["ArrowUp", "PageUp", "Home"].includes(event.key)) {
            release();
          }
        }
        // Focus or anchor jumps can still move the page while Lenis is paused: let go then.
        function onScroll() {
          if (Math.abs(window.scrollY - anchor) > 80) release();
        }

        const progressProxy = { p: 0 };

        const arm = (start: number) => {
          if (armed) return;
          armed = true;
          anchor = start;
          progress = 0;
          idle = 0;
          gsap.killTweensOf(progressProxy);
          setPaused(true);
          scrollTo(start, { immediate: true });
          gsap.ticker.add(drain);
          window.addEventListener("wheel", onWheel, { passive: false });
          window.addEventListener("touchstart", onTouchStart, { passive: true });
          window.addEventListener("touchmove", onTouchMove, { passive: false });
          window.addEventListener("keydown", onKey);
          window.addEventListener("scroll", onScroll, { passive: true });
        };

        // Arms only on the way down: scrolling back up into the section is never held.
        const trigger = ScrollTrigger.create({
          trigger: root,
          start: "bottom bottom",
          end: "+=1",
          onEnter: (self) => arm(self.start),
        });

        return () => {
          detach();
          trigger.kill();
          gsap.killTweensOf(progressProxy);
          setPaused(false);
          gsap.set([rubber, gate], { clearProps: "all" });
          passGate.current = () => {};
        };
      });

      // Display type changes the section height once fonts land.
      let cancelled = false;
      void document.fonts.ready.then(() => {
        if (!cancelled) ScrollTrigger.refresh();
      });
      return () => {
        cancelled = true;
        mm.revert();
      };
    },
    { scope: rootRef, dependencies: [scrollTo, setPaused] },
  );

  return (
    <section ref={rootRef} className="relative" {...props}>
      <div
        data-stage-gate
        className="pointer-events-none absolute inset-x-0 bottom-0 flex h-24 items-center justify-center opacity-0 max-md:hidden"
      >
        <button
          type="button"
          onClick={() => passGate.current()}
          className="flex items-center gap-3 rounded-full px-3 py-2 text-mono-ui text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground"
        >
          <svg aria-hidden viewBox="0 0 44 44" className="size-9 -rotate-90">
            <circle
              cx="22"
              cy="22"
              r={RING_RADIUS}
              fill="none"
              strokeWidth="2"
              className="stroke-border"
            />
            <circle
              data-gate-ring
              cx="22"
              cy="22"
              r={RING_RADIUS}
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={RING_LENGTH}
              strokeDashoffset={RING_LENGTH}
              className="stroke-accent"
            />
          </svg>
          {work.gate.label}
        </button>
      </div>
      <div data-stage-body className={cn("relative flex min-h-svh flex-col", bodyClassName)}>
        <div data-stage-rubber className="flex flex-1 flex-col">
          {children}
        </div>
      </div>
      <div
        data-stage-shade
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-background opacity-0"
      />
    </section>
  );
}

export { WorkStage };
