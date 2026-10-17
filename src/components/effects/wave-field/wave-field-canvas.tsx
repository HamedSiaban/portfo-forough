"use client";

import * as React from "react";

import { cn } from "@/lib/cn";
import { gsap } from "@/lib/gsap";

import { TRAIL_LENGTH } from "./shaders";
import type { WaveFieldProps } from "./types";
import { WaveRenderer } from "./wave-renderer";

const MAX_DPR = 1.5;
const IDLE_DELAY_S = 0.9;
// Glow radius in CSS px: resting size, and the size reached at FULL_SPEED_PX_S or faster.
const REST_RADIUS_PX = 34;
const FAST_RADIUS_PX = 120;
const FULL_SPEED_PX_S = 2200;
// Exponential-smoothing rates (per second). Grows quickly with a fast flick, relaxes slowly
// back to rest — both directions are what make "faster = bigger, slower = smaller" readable.
const GROW_RATE = 14;
const SHRINK_RATE = 3.5;
const FADE_IN_RATE = 18;
const FADE_OUT_RATE = 9;
// Head spring (per second²/per second). ω = √stiffness ≈ 15 rad/s; damping ratio
// ζ = damping / (2ω) ≈ 0.4 → a ~25% overshoot that settles in ~0.5s.
const SPRING_STIFFNESS = 225;
const SPRING_DAMPING = 12;
const SPRING_MAX_STEP_S = 1 / 120;
// Comet tail: each trail point chases the one ahead of it at this rate (per second), so the
// tail stretches with speed and collapses onto the pointer within ~0.3s of stopping.
const TRAIL_FOLLOW_RATE = 40;
// How much the tail swells (and the head narrows) at full speed: head = 1 - X, end of tail = 1 + X.
const TAIL_SWELL = 0.7;
// Per-point brightness falloff along the tail.
const TAIL_FADE = 0.032;

function hexToRgbTuple(hex: string): [number, number, number] {
  const clean = hex.trim().replace("#", "");
  const value = parseInt(clean, 16);
  if (clean.length === 6 && !Number.isNaN(value)) {
    return [((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255];
  }
  return [1, 0.24, 0.44];
}

function resolveTint(
  palette: WaveFieldProps["palette"],
  el: HTMLElement,
): [number, number, number] {
  if (palette && typeof palette === "object") return hexToRgbTuple(palette.core);
  const varName = palette === "dark" ? "--accent-soft-1" : "--accent";
  const raw = getComputedStyle(el).getPropertyValue(varName);
  return hexToRgbTuple(raw || "#ff3d71");
}

const approach = (current: number, target: number, rate: number, dt: number): number =>
  target + (current - target) * Math.exp(-rate * dt);

type WaveFieldCanvasProps = WaveFieldProps & {
  active: boolean;
  onError?: () => void;
};

/**
 * Mounts the WebGL canvas and drives it. Loaded via next/dynamic({ ssr: false }) from
 * wave-field.tsx so three.js never lands in a synchronous bundle (CLAUDE.md §5.1).
 *
 * The glow is centred exactly on the pointer every frame (no lag, no trail). Pointer speed is
 * measured per frame and smoothed into the radius; leaving the panel only fades the glow out.
 */
function WaveFieldCanvas({
  palette = "accent",
  intensity = 1,
  dotSize,
  halftone,
  chromatic,
  idleDrift = false,
  pointerTarget,
  active,
  className,
  onError,
}: WaveFieldCanvasProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const rendererRef = React.useRef<WaveRenderer | null>(null);
  const activeRef = React.useRef(active);
  const intensityRef = React.useRef(intensity);
  const idleDriftRef = React.useRef(idleDrift);

  React.useEffect(() => {
    activeRef.current = active;
    intensityRef.current = intensity;
    idleDriftRef.current = idleDrift;
  }, [active, intensity, idleDrift]);

  // Init engine once; disposed on unmount.
  React.useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const rect = container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    let renderer: WaveRenderer;
    try {
      renderer = new WaveRenderer({
        canvas,
        width: Math.max(1, rect.width),
        height: Math.max(1, rect.height),
        dpr,
        tint: resolveTint(palette, container),
      });
    } catch {
      onError?.();
      return;
    }
    rendererRef.current = renderer;

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      renderer.resize(
        Math.max(1, width),
        Math.max(1, height),
        Math.min(window.devicePixelRatio || 1, MAX_DPR),
      );
    });
    resizeObserver.observe(container);

    const themeObserver = new MutationObserver(() => {
      renderer.setOptions({ tint: resolveTint(palette, container) });
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Live state, read and advanced by the ticker.
    const pointer = { x: 0, y: 0, inside: false };
    const shown = {
      x: 0,
      y: 0,
      lastX: 0,
      lastY: 0,
      vx: 0,
      vy: 0,
      radius: REST_RADIUS_PX,
      strength: 0,
      spread: 0,
    };
    // Chain of positions, head first; index i chases index i-1.
    const chain = Array.from({ length: TRAIL_LENGTH }, () => ({ x: 0, y: 0 }));
    const points = new Float32Array(TRAIL_LENGTH * 4);
    let elapsed = 0;
    let lastRealInput = 0;

    const handlePointerMove = (event: PointerEvent): void => {
      const r = container.getBoundingClientRect();
      pointer.x = event.clientX - r.left;
      pointer.y = event.clientY - r.top;
      if (!pointer.inside) {
        // Entering: snap to the pointer so the entry jump isn't read as a fast flick.
        shown.x = shown.lastX = pointer.x;
        shown.y = shown.lastY = pointer.y;
        shown.vx = 0;
        shown.vy = 0;
        for (const c of chain) {
          c.x = pointer.x;
          c.y = pointer.y;
        }
      }
      pointer.inside = true;
      lastRealInput = elapsed;
    };
    const handlePointerLeave = (): void => {
      pointer.inside = false;
    };

    // Coordinates stay relative to the field's own rect; the target only decides who listens.
    const target = pointerTarget?.current ?? container;
    target.addEventListener("pointermove", handlePointerMove);
    target.addEventListener("pointerdown", handlePointerMove);
    target.addEventListener("pointerleave", handlePointerLeave);

    const tick = (_time: number, deltaTimeMs: number): void => {
      const dt = Math.min(deltaTimeMs / 1000, 1 / 20);
      elapsed += dt;
      if (!activeRef.current || document.hidden || dt <= 0) return;

      const drifting =
        !pointer.inside && idleDriftRef.current && elapsed - lastRealInput > IDLE_DELAY_S;
      // Where the head is being pulled to: the pointer (which keeps its last position after
      // leaving, so the head still settles there), or the synthetic idle path.
      let targetX = pointer.x;
      let targetY = pointer.y;
      if (drifting) {
        const r = container.getBoundingClientRect();
        targetX = r.width * (0.5 + 0.26 * Math.sin(elapsed * 0.6));
        targetY = r.height * (0.5 + 0.2 * Math.cos(elapsed * 0.45));
      }

      // Underdamped spring: eases into motion on start (momentum builds before it catches the
      // pointer) and overshoots a little on stop before settling back. Substepped so the
      // integration stays stable at low frame rates.
      const steps = Math.ceil(dt / SPRING_MAX_STEP_S);
      const h = dt / steps;
      for (let n = 0; n < steps; n++) {
        shown.vx += (SPRING_STIFFNESS * (targetX - shown.x) - SPRING_DAMPING * shown.vx) * h;
        shown.vy += (SPRING_STIFFNESS * (targetY - shown.y) - SPRING_DAMPING * shown.vy) * h;
        shown.x += shown.vx * h;
        shown.y += shown.vy * h;
      }

      const speed = Math.hypot(shown.x - shown.lastX, shown.y - shown.lastY) / dt;
      shown.lastX = shown.x;
      shown.lastY = shown.y;

      const k = intensityRef.current;
      const t = Math.min(speed / FULL_SPEED_PX_S, 1);
      const targetRadius = (REST_RADIUS_PX + (FAST_RADIUS_PX - REST_RADIUS_PX) * t) * k;
      const rate = targetRadius > shown.radius ? GROW_RATE : SHRINK_RATE;
      shown.radius = approach(shown.radius, targetRadius, rate, dt);

      // Tail shape eases with the same grow/shrink asymmetry as the radius.
      shown.spread = approach(shown.spread, t, t > shown.spread ? GROW_RATE : SHRINK_RATE, dt);
      const swell = TAIL_SWELL * (0.15 + 0.85 * shown.spread);

      const present = pointer.inside || drifting;
      shown.strength = approach(
        shown.strength,
        present ? 1 : 0,
        present ? FADE_IN_RATE : FADE_OUT_RATE,
        dt,
      );

      const follow = 1 - Math.exp(-TRAIL_FOLLOW_RATE * dt);
      chain.forEach((c, i) => {
        if (i === 0) {
          c.x = shown.x;
          c.y = shown.y;
        } else {
          const ahead = chain[i - 1];
          if (ahead) {
            c.x += (ahead.x - c.x) * follow;
            c.y += (ahead.y - c.y) * follow;
          }
        }
        const o = i * 4;
        points[o] = c.x;
        points[o + 1] = c.y;
        points[o + 2] = shown.radius * (1 - swell + (2 * swell * i) / (TRAIL_LENGTH - 1));
        points[o + 3] = shown.strength * Math.exp(-i * TAIL_FADE);
      });
      renderer.draw(points);
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      target.removeEventListener("pointermove", handlePointerMove);
      target.removeEventListener("pointerdown", handlePointerMove);
      target.removeEventListener("pointerleave", handlePointerLeave);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      renderer.dispose();
      rendererRef.current = null;
    };
    // Engine is created once per mount; prop changes are synced imperatively below.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional, see comment above
  }, []);

  React.useEffect(() => {
    rendererRef.current?.setOptions({ dotSize, halftone, chromatic });
  }, [dotSize, halftone, chromatic]);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container || !rendererRef.current) return;
    rendererRef.current.setOptions({ tint: resolveTint(palette, container) });
  }, [palette]);

  return (
    <div
      ref={containerRef}
      className={cn("absolute inset-0", className)}
      aria-hidden
      role="presentation"
    >
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 size-full" />
    </div>
  );
}

export { WaveFieldCanvas };
