"use client";

import * as React from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { gsap } from "@/lib/gsap";

const DRAG_THRESHOLD_PX = 4;
/** How far (in ms of release velocity) the row keeps gliding after the pointer lets go. */
const INERTIA_MS = 320;

/**
 * Mouse drag-to-scroll with inertia for a natively scrollable row. Touch and keyboard keep the
 * browser's own scrolling; this only adds the desktop grab gesture. A drag longer than
 * `DRAG_THRESHOLD_PX` swallows the click that follows so links inside don't fire.
 */
function useDragScroll<T extends HTMLElement>(ref: React.RefObject<T | null>): void {
  const reducedMotion = useReducedMotion();

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const track: T = element;

    let startX = 0;
    let startScroll = 0;
    let lastX = 0;
    let lastTime = 0;
    let velocity = 0;
    let moved = false;
    let active = false;

    function handleMove(event: PointerEvent): void {
      const dx = event.clientX - startX;
      if (!moved && Math.abs(dx) < DRAG_THRESHOLD_PX) return;
      moved = true;
      track.scrollLeft = startScroll - dx;
      const now = performance.now();
      const dt = now - lastTime;
      if (dt > 0) velocity = (lastX - event.clientX) / dt;
      lastX = event.clientX;
      lastTime = now;
    }

    function end(): void {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", end);
      if (!active) return;
      active = false;
      track.style.cursor = "";
      track.style.userSelect = "";
      if (moved) {
        track.addEventListener("click", (event) => event.preventDefault(), {
          capture: true,
          once: true,
        });
        // A drag that ends without a click leaves the one-shot listener behind; drop it soon.
        if (!reducedMotion && Math.abs(velocity) > 0.05) {
          gsap.to(track, {
            scrollLeft: track.scrollLeft + velocity * INERTIA_MS,
            duration: 0.9,
            ease: "power3.out",
            overwrite: true,
          });
        }
      }
    }

    function handleDown(event: PointerEvent): void {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      gsap.killTweensOf(track);
      active = true;
      moved = false;
      velocity = 0;
      startX = lastX = event.clientX;
      startScroll = track.scrollLeft;
      lastTime = performance.now();
      track.style.cursor = "grabbing";
      track.style.userSelect = "none";
      window.addEventListener("pointermove", handleMove);
      window.addEventListener("pointerup", end);
      window.addEventListener("pointercancel", end);
    }

    function handleDragStart(event: Event): void {
      event.preventDefault();
    }

    track.addEventListener("pointerdown", handleDown);
    track.addEventListener("dragstart", handleDragStart);
    return () => {
      track.removeEventListener("pointerdown", handleDown);
      track.removeEventListener("dragstart", handleDragStart);
      gsap.killTweensOf(track);
      end();
    };
  }, [ref, reducedMotion]);
}

export { useDragScroll };
