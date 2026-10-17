"use client";

import * as React from "react";

import { cn } from "@/lib/cn";
import { gsap } from "@/lib/gsap";

import { FluidSimulation } from "./fluid-simulation";
import type { InkFieldProps } from "./types";

const MAX_DPR = 1.5;
const IDLE_DELAY_MS = 900;
const POINTER_VELOCITY_CAP = 6;

function hexToRgbTuple(hex: string): [number, number, number] {
  const clean = hex.trim().replace("#", "");
  const value = parseInt(clean, 16);
  if (clean.length === 6 && !Number.isNaN(value)) {
    return [((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255];
  }
  return [1, 0.24, 0.44];
}

function resolveTint(palette: InkFieldProps["palette"], el: HTMLElement): [number, number, number] {
  if (palette && typeof palette === "object") return hexToRgbTuple(palette.core);
  const varName = palette === "dark" ? "--accent-soft-1" : "--accent";
  const raw = getComputedStyle(el).getPropertyValue(varName);
  return hexToRgbTuple(raw || "#ff3d71");
}

type InkFieldCanvasProps = InkFieldProps & {
  active: boolean;
  onError?: () => void;
};

/**
 * Mounts the WebGL canvas and drives it. Loaded via next/dynamic({ ssr: false }) from
 * ink-field.tsx so three.js never lands in a synchronous bundle (CLAUDE.md §5.1).
 */
function InkFieldCanvas({
  palette = "accent",
  intensity,
  dissipation,
  dotSize,
  pressureIterations,
  halftone,
  chromatic,
  idleDrift = false,
  active,
  className,
  onError,
}: InkFieldCanvasProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const simRef = React.useRef<FluidSimulation | null>(null);
  const activeRef = React.useRef(active);
  const lastPointer = React.useRef<{ x: number; y: number; t: number } | null>(null);
  const lastRealInput = React.useRef(0);
  const syntheticPos = React.useRef({ x: 0.5, y: 0.5 });
  const elapsed = React.useRef(0);

  React.useEffect(() => {
    activeRef.current = active;
  }, [active]);

  // Init engine once; disposed on unmount.
  React.useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let cancelled = false;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    let teardown: (() => void) | undefined;

    const createSim = (): FluidSimulation | null => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      try {
        return new FluidSimulation({
          canvas,
          width: Math.max(1, rect.width),
          height: Math.max(1, rect.height),
          dpr,
          tint: resolveTint(palette, container),
        });
      } catch {
        return null;
      }
    };

    const wire = (sim: FluidSimulation): void => {
      simRef.current = sim;

      const resizeObserver = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (!entry) return;
        const { width, height } = entry.contentRect;
        const nextDpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
        sim.resize(Math.max(1, width), Math.max(1, height), nextDpr);
      });
      resizeObserver.observe(container);

      const themeObserver = new MutationObserver(() => {
        sim.setOptions({ tint: resolveTint(palette, container) });
      });
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });

      const getUv = (clientX: number, clientY: number): { x: number; y: number } => {
        const r = container.getBoundingClientRect();
        return { x: (clientX - r.left) / r.width, y: (clientY - r.top) / r.height };
      };

      const handlePointerMove = (event: PointerEvent): void => {
        lastRealInput.current = elapsed.current;
        const { x, y } = getUv(event.clientX, event.clientY);
        const now = performance.now();
        const prev = lastPointer.current;
        lastPointer.current = { x, y, t: now };
        if (!prev) return;
        const dt = Math.max((now - prev.t) / 1000, 1 / 120);
        let dx = (x - prev.x) / dt;
        let dy = (y - prev.y) / dt;
        const speed = Math.hypot(dx, dy);
        if (speed > POINTER_VELOCITY_CAP) {
          const scale = POINTER_VELOCITY_CAP / speed;
          dx *= scale;
          dy *= scale;
        }
        sim.splat(x, y, dx, dy);
      };

      const handlePointerLeave = (): void => {
        lastPointer.current = null;
      };

      container.addEventListener("pointermove", handlePointerMove);
      container.addEventListener("pointerdown", handlePointerMove);
      container.addEventListener("pointerleave", handlePointerLeave);

      const tick = (_time: number, deltaTimeMs: number): void => {
        const dt = Math.min(deltaTimeMs / 1000, 1 / 30);
        elapsed.current += dt;
        if (!activeRef.current || document.hidden) return;

        if (idleDrift && elapsed.current - lastRealInput.current > IDLE_DELAY_MS / 1000) {
          const t = elapsed.current;
          const next = { x: 0.5 + 0.26 * Math.sin(t * 0.6), y: 0.5 + 0.2 * Math.cos(t * 0.45) };
          const prev = syntheticPos.current;
          const sdx = (next.x - prev.x) / dt;
          const sdy = (next.y - prev.y) / dt;
          syntheticPos.current = next;
          sim.splat(next.x, next.y, sdx * 0.4, sdy * 0.4);
        } else {
          syntheticPos.current = { x: 0.5, y: 0.5 };
        }

        sim.step(dt);
      };
      gsap.ticker.add(tick);

      teardown = () => {
        gsap.ticker.remove(tick);
        container.removeEventListener("pointermove", handlePointerMove);
        container.removeEventListener("pointerdown", handlePointerMove);
        container.removeEventListener("pointerleave", handlePointerLeave);
        resizeObserver.disconnect();
        themeObserver.disconnect();
        sim.dispose();
        simRef.current = null;
      };
    };

    const sim = createSim();
    if (sim) {
      wire(sim);
    } else {
      // A fresh canvas can transiently fail to yield a context right after a prior one was
      // force-lost on the same node (e.g. React StrictMode's dev-only double-invoke) — one
      // short retry clears this without weakening the forceContextLoss() disposal above.
      retryTimer = setTimeout(() => {
        if (cancelled) return;
        const retried = createSim();
        if (retried) {
          wire(retried);
        } else {
          onError?.();
        }
      }, 60);
    }

    return () => {
      cancelled = true;
      if (retryTimer) clearTimeout(retryTimer);
      teardown?.();
    };
    // Engine is created once per mount; prop changes are synced imperatively below.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional, see comment above
  }, []);

  React.useEffect(() => {
    simRef.current?.setOptions({
      intensity,
      dissipation,
      dotSize,
      pressureIterations,
      halftone,
      chromatic,
    });
  }, [intensity, dissipation, dotSize, pressureIterations, halftone, chromatic]);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container || !simRef.current) return;
    simRef.current.setOptions({ tint: resolveTint(palette, container) });
  }, [palette]);

  return (
    <div
      ref={containerRef}
      className={cn("absolute inset-0", className)}
      aria-hidden
      role="presentation"
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 size-full mix-blend-lighten dark:mix-blend-screen"
      />
    </div>
  );
}

export { InkFieldCanvas };
