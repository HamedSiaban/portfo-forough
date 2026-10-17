"use client";

import { useGSAP } from "@gsap/react";
import * as React from "react";

import { useInViewport } from "@/hooks/use-in-viewport";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/cn";
import { gsap } from "@/lib/gsap";

import { cascadeConfig as config } from "./cascade-config";
import {
  type Card,
  cardSize,
  createRng,
  fadeFor,
  needsStamp,
  nextSpawnDelay,
  sampleTrail,
  spawnCard,
  stepCard,
  type World,
} from "./cascade-math";
import { buildSprites, type Sprites } from "./cascade-sprites";

/**
 * Solitaire-victory cascade (DESIGN_SPEC §5 "6 · CTA", ref 11). Pink cards launch one at a time
 * from the top-left, fall under gravity and bounce off the panel floor. The canvas is never
 * cleared between frames — every frame stamps all live cards at their new position, which leaves
 * the stepped waterfall trail. Trails fade by punching a low-alpha `destination-out` rect through
 * the same transparent canvas (so the panel's halftone/gradient shows through in both themes,
 * with no background colour to match), applied in coarser, rarer passes so 8-bit alpha rounding
 * can't leave ghost silhouettes. Cards stamp every few px of travel for the chunky stepped trail. Physics is a fixed-step sim in `cascade-math`.
 * Runs on `gsap.ticker`; idle while off-screen or the tab is hidden. Clicking the panel replays.
 * Reduced motion: one static composition of a few trails, no ticker. Touch uses the same loop.
 */
function CardCascade({ className }: { className?: string }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();
  const { inViewport } = useInViewport(canvasRef);
  // Read from the ticker without re-running the effect whenever visibility flips.
  const inViewportRef = React.useRef(false);
  React.useEffect(() => {
    inViewportRef.current = inViewport;
  }, [inViewport]);

  useGSAP(
    () => {
      const maybeCanvas = canvasRef.current;
      const maybeCtx = maybeCanvas?.getContext("2d");
      const maybePanel = maybeCanvas?.parentElement;
      if (!maybeCanvas || !maybeCtx || !maybePanel) return;
      // Re-bound so the narrowed (non-null) types reach the hoisted helpers below.
      const canvas: HTMLCanvasElement = maybeCanvas;
      const ctx: CanvasRenderingContext2D = maybeCtx;
      const panel: HTMLElement = maybePanel;

      let dpr = 1;
      let world: World = { width: 0, height: 0, size: 0 };
      let sprites: Sprites | null = null;
      let cards: Card[] = [];
      let rng = createRng(Math.floor(Math.random() * 2 ** 31));
      let spawnTimer = 0;
      let accumulator = 0;
      let fadeClock = 0;

      function clear(): void {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      function stamp(card: Pick<Card, "x" | "y" | "angle"> & { sprite: number }): void {
        const sprite = sprites?.canvases[card.sprite];
        if (!sprite) return;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.translate(card.x, card.y);
        ctx.rotate(card.angle);
        ctx.drawImage(sprite, -world.size / 2, -world.size / 2, world.size, world.size);
      }

      function drawStatic(): void {
        clear();
        if (!sprites) return;
        const staticRng = createRng(20250);
        for (let index = 0; index < config.staticTrails; index += 1) {
          const startX = world.width * (0.04 + index * 0.1);
          const sprite = index % sprites.canvases.length;
          for (const point of sampleTrail(staticRng, world, startX)) stamp({ ...point, sprite });
        }
      }

      function rebuildSprites(): void {
        sprites = buildSprites(panel, world.size, dpr);
        if (reducedMotion) drawStatic();
      }

      function resize(): void {
        const rect = panel.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        dpr = Math.min(window.devicePixelRatio || 1, config.dprCap);
        world = { width: rect.width, height: rect.height, size: cardSize(rect.width) };
        canvas.width = Math.round(rect.width * dpr);
        canvas.height = Math.round(rect.height * dpr);
        cards = [];
        spawnTimer = 0;
        rebuildSprites();
      }

      function replay(): void {
        clear();
        cards = [];
        spawnTimer = 0;
        accumulator = 0;
        rng = createRng(Math.floor(Math.random() * 2 ** 31));
      }

      function fade(dt: number): void {
        fadeClock += dt;
        if (fadeClock < config.fadeInterval) return;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = `rgb(0 0 0 / ${fadeFor(fadeClock)})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = "source-over";
        fadeClock = 0;
      }

      function tick(_time: number, deltaMs: number): void {
        if (!inViewportRef.current || document.hidden || !sprites) return;
        const dt = Math.min(deltaMs / 1000, config.maxFrame);

        spawnTimer -= dt;
        if (spawnTimer <= 0) {
          spawnTimer = nextSpawnDelay(rng);
          if (cards.length < config.maxCards) {
            cards.push(spawnCard(rng, world, sprites.canvases.length));
          }
        }

        accumulator += dt;
        while (accumulator >= config.step) {
          accumulator -= config.step;
          cards = cards.filter((card) => stepCard(card, world));
        }

        fade(dt);
        for (const card of cards) {
          if (!needsStamp(card, world)) continue;
          card.stampX = card.x;
          card.stampY = card.y;
          stamp(card);
        }
      }

      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(panel);
      resize();

      // Sprites bake theme colours in; rebuild when next-themes flips the class on <html>.
      const themeObserver = new MutationObserver(rebuildSprites);
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });

      if (reducedMotion) {
        return () => {
          resizeObserver.disconnect();
          themeObserver.disconnect();
        };
      }

      function handleClick(event: MouseEvent): void {
        // Ignore clicks that are really for the CTA button or links inside the panel.
        if ((event.target as Element).closest("a, button")) return;
        replay();
      }

      panel.addEventListener("click", handleClick);
      gsap.ticker.add(tick);
      return () => {
        gsap.ticker.remove(tick);
        panel.removeEventListener("click", handleClick);
        resizeObserver.disconnect();
        themeObserver.disconnect();
      };
    },
    { dependencies: [reducedMotion], scope: canvasRef, revertOnUpdate: true },
  );

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      role="presentation"
      className={cn("pointer-events-none absolute inset-0 size-full", className)}
    />
  );
}

export { CardCascade };
