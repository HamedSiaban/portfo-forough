import * as React from "react";

import { cn } from "@/lib/cn";

type PatternArtVariant = "steps" | "circles" | "diamond" | "snake";

type PatternArtProps = React.ComponentProps<"svg"> & {
  variant: PatternArtVariant;
  seed?: string | number;
};

const PALETTE = ["var(--accent-soft-1)", "var(--accent-soft-2)", "var(--accent-soft-3)"] as const;

/** Deterministic PRNG (mulberry32) so SSR and client render the same jitter from a seed. */
function createRng(seed: string | number) {
  let hash = typeof seed === "number" ? seed : 0;
  if (typeof seed === "string") {
    for (let index = 0; index < seed.length; index += 1) {
      hash = (Math.imul(31, hash) + seed.charCodeAt(index)) | 0;
    }
  }
  let state = hash >>> 0 || 1;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function StepsVariant({ rng }: { rng: () => number }) {
  const count = 6;
  return (
    <>
      {Array.from({ length: count }, (_, index) => {
        const size = 36 - index * 3;
        const offset = index * 18;
        const fill = PALETTE[index % PALETTE.length];
        const jitter = (rng() - 0.5) * 4;
        return (
          <rect
            key={index}
            x={offset + jitter}
            y={offset}
            width={size}
            height={size}
            rx={6}
            fill={fill}
          />
        );
      })}
    </>
  );
}

function CirclesVariant({ rng }: { rng: () => number }) {
  const count = 5;
  return (
    <>
      {Array.from({ length: count }, (_, index) => {
        const radius = 22;
        const cx = 24 + index * 26;
        const jitter = (rng() - 0.5) * 6;
        const fill = PALETTE[index % PALETTE.length];
        return <circle key={index} cx={cx} cy={64 + jitter} r={radius} fill={fill} />;
      })}
    </>
  );
}

function DiamondVariant({ rng }: { rng: () => number }) {
  const count = 4;
  return (
    <>
      {Array.from({ length: count }, (_, index) => {
        const size = 100 - index * 22;
        const fill = PALETTE[index % PALETTE.length];
        const jitter = (rng() - 0.5) * 4;
        return (
          <rect
            key={index}
            x={64 - size / 2 + jitter}
            y={64 - size / 2}
            width={size}
            height={size}
            fill={fill}
            transform={`rotate(45 ${64 + jitter} 64)`}
          />
        );
      })}
    </>
  );
}

function SnakeVariant({ rng }: { rng: () => number }) {
  const count = 7;
  return (
    <>
      {Array.from({ length: count }, (_, index) => {
        const size = 20;
        const x = 8 + index * 16;
        const wobble = Math.sin(index * 1.3) * 16 + (rng() - 0.5) * 3;
        const fill = PALETTE[index % PALETTE.length];
        return (
          <rect
            key={index}
            x={x}
            y={64 + wobble - size / 2}
            width={size}
            height={size}
            rx={4}
            fill={fill}
          />
        );
      })}
    </>
  );
}

const VARIANTS: Record<PatternArtVariant, React.ComponentType<{ rng: () => number }>> = {
  steps: StepsVariant,
  circles: CirclesVariant,
  diamond: DiamondVariant,
  snake: SnakeVariant,
};

/**
 * Generative accent-pink compositions used over halftone backgrounds
 * (DESIGN_SPEC §4). Deterministic per `seed` — no `Math.random`, so output is
 * stable across server and client renders.
 */
function PatternArt({ variant, seed = variant, className, ...props }: PatternArtProps) {
  const rng = createRng(seed);
  const Variant = VARIANTS[variant];

  return (
    <svg
      viewBox="0 0 128 128"
      aria-hidden
      role="presentation"
      className={cn("size-full", className)}
      {...props}
    >
      <Variant rng={rng} />
    </svg>
  );
}

export { PatternArt };
export type { PatternArtVariant };
