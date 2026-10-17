"use client";

import { useGSAP } from "@gsap/react";
import * as React from "react";

import { useInViewport } from "@/hooks/use-in-viewport";
import { useIsTouch } from "@/hooks/use-is-touch";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/cn";
import { gsap } from "@/lib/gsap";

import { trailConfig } from "./trail-config";
import { createTrailSpawner, tiltFromAngle, type TrailSpawn } from "./trail-math";

type ImageTrailProps = {
  /** Tiles to cycle through. Any node works (next/image, PatternArt, ...); they are cosmetic. */
  images: React.ReactNode[];
  /** Element whose pointer movement drives the trail (the panel); the layer itself is inert. */
  targetRef: React.RefObject<HTMLElement | null>;
  className?: string;
};

const COLLAGE = [
  "left-[48%] top-[50%] -rotate-6",
  "left-[64%] top-[60%] rotate-3",
  "left-[54%] top-[72%] rotate-[9deg]",
] as const;

function Tile({ children, className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn(
        "w-32 overflow-hidden rounded-card bg-surface-muted p-3 shadow-lg md:w-44",
        className,
      )}
    >
      <div className="aspect-square">{children}</div>
    </div>
  );
}

/**
 * Cursor image trail (DESIGN_SPEC §5). A fixed pool of tiles is recycled: every time the pointer
 * has travelled `spawnDistance` px, the oldest slot jumps to the cursor, lands on top, tilts with
 * the travel direction and plays one GSAP timeline (scale-in → hold → fade out, ~1s). Recycling
 * kills the slot's previous timeline, so at most `poolSize` tiles ever exist and the trail can't
 * pile up. An accent dot eases after the cursor via `quickTo`. Touch: the same spawner is fed by
 * a slow scripted path on the GSAP ticker, only while on screen. Reduced motion: a static
 * three-tile collage, no listeners.
 */
function ImageTrail({ images, targetRef, className }: ImageTrailProps) {
  const layerRef = React.useRef<HTMLDivElement>(null);
  const dotRef = React.useRef<HTMLSpanElement>(null);
  const slotRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const reducedMotion = useReducedMotion();
  const isTouch = useIsTouch();
  const { inViewport } = useInViewport(layerRef);
  // Read from the ticker without re-running the effect on every visibility change.
  const inViewportRef = React.useRef(false);
  React.useEffect(() => {
    inViewportRef.current = inViewport;
  }, [inViewport]);

  useGSAP(
    () => {
      const target = targetRef.current;
      const dot = dotRef.current;
      const slots = slotRefs.current.filter((slot): slot is HTMLDivElement => slot !== null);
      if (!target || !dot || reducedMotion || slots.length === 0) return;

      gsap.set(slots, { autoAlpha: 0, xPercent: -50, yPercent: -50 });
      const timelines: (gsap.core.Timeline | undefined)[] = [];
      const spawner = createTrailSpawner(trailConfig.spawnDistance);
      let nextSlot = 0;
      let zIndex = 1;

      const dotX = gsap.quickTo(dot, "x", { duration: 0.45, ease: "power3.out" });
      const dotY = gsap.quickTo(dot, "y", { duration: 0.45, ease: "power3.out" });

      function spawn({ x, y, angle }: TrailSpawn): void {
        const index = nextSlot;
        const slot = slots[index];
        if (!slot) return;
        nextSlot = (nextSlot + 1) % slots.length;
        timelines[index]?.kill();
        zIndex += 1;
        gsap.set(slot, {
          x,
          y,
          zIndex,
          rotation: tiltFromAngle(angle, trailConfig.maxTilt),
          scale: 0.6,
          autoAlpha: 0,
        });
        timelines[index] = gsap
          .timeline()
          .to(slot, { scale: 1, autoAlpha: 1, duration: trailConfig.scaleIn, ease: "power3.out" })
          .to(slot, { autoAlpha: 1, duration: trailConfig.hold })
          .to(slot, {
            scale: 0.85,
            autoAlpha: 0,
            duration: trailConfig.scaleOut,
            ease: "power2.in",
          });
      }

      function follow(x: number, y: number): void {
        dotX(x);
        dotY(y);
        const spawnPoint = spawner.push(x, y);
        if (spawnPoint) spawn(spawnPoint);
      }

      if (isTouch) {
        const started = gsap.ticker.time;
        gsap.set(dot, { opacity: 1 });
        const tick = (): void => {
          if (!inViewportRef.current || document.hidden) return;
          const phase = ((gsap.ticker.time - started) / trailConfig.autoplayLoop) * Math.PI * 2;
          follow(
            target.clientWidth * (0.5 + 0.32 * Math.sin(phase)),
            target.clientHeight * (0.58 + 0.22 * Math.sin(phase * 2 + 1)),
          );
        };
        gsap.ticker.add(tick);
        return () => {
          gsap.ticker.remove(tick);
          timelines.forEach((timeline) => timeline?.kill());
        };
      }

      function handleMove(event: PointerEvent): void {
        if (event.pointerType === "touch" || !target) return;
        const rect = target.getBoundingClientRect();
        follow(event.clientX - rect.left, event.clientY - rect.top);
      }
      function handleEnter(): void {
        spawner.reset();
        gsap.to(dot, { opacity: 1, duration: 0.2 });
      }
      function handleLeave(): void {
        spawner.reset();
        gsap.to(dot, { opacity: 0, duration: 0.2 });
      }

      target.addEventListener("pointermove", handleMove);
      target.addEventListener("pointerenter", handleEnter);
      target.addEventListener("pointerleave", handleLeave);
      return () => {
        target.removeEventListener("pointermove", handleMove);
        target.removeEventListener("pointerenter", handleEnter);
        target.removeEventListener("pointerleave", handleLeave);
        timelines.forEach((timeline) => timeline?.kill());
      };
    },
    { dependencies: [reducedMotion, isTouch], scope: layerRef, revertOnUpdate: true },
  );

  if (reducedMotion) {
    return (
      <div
        ref={layerRef}
        aria-hidden
        role="presentation"
        className={cn("pointer-events-none absolute inset-0", className)}
      >
        {COLLAGE.map((position, index) => (
          <Tile key={position} className={cn("absolute -translate-1/2", position)}>
            {images[index % images.length]}
          </Tile>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={layerRef}
      aria-hidden
      role="presentation"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {/* Own stacking context: the tiles' ever-growing z-index must never outrank the dot. */}
      <div className="absolute inset-0 isolate">
        {Array.from({ length: trailConfig.poolSize }, (_, index) => (
          <Tile
            key={index}
            ref={(node) => {
              slotRefs.current[index] = node;
            }}
            className="invisible absolute top-0 left-0 will-change-transform"
          >
            {images[index % images.length]}
          </Tile>
        ))}
      </div>
      <span
        ref={dotRef}
        className="absolute top-0 left-0 -mt-1.5 -ml-1.5 size-3 rounded-full bg-accent opacity-0"
      />
    </div>
  );
}

export { ImageTrail };
