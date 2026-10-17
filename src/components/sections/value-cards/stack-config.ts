/**
 * Tuning constants and pure maths for the value-card timeline. Kept free of GSAP/DOM so the
 * numbers are unit-testable and the timeline file stays readable. One "unit" of the master
 * timeline is one card segment; the exit takes EXIT_UNITS more.
 */

/** Scroll distance per card segment, as a fraction of viewport height. */
const STEP_VH = { desktop: 0.9, mobile: 0.7 } as const;

/** Extra timeline units after the last card lands: the stack lifts and fades. */
const EXIT_UNITS = 0.5;

/** Visible tab edge per receded card, in px. */
const TAB_PX = { desktop: 18, mobile: 12 } as const;

/** Each level of depth shrinks the card by this much (1 → 0.93 → 0.86 → …). */
const SCALE_STEP = 0.07;

/** Each level of depth darkens the card by this overlay opacity, capped. */
const SHADE_STEP = 0.14;
const SHADE_MAX = 0.5;

/** Entering card start pose: in front of the screen, tipped back, soft. */
const ENTER = {
  yVh: 1.05,
  z: 520,
  rotateX: 52,
  scale: 1.3,
  blurPx: 10,
  /** Fractions of the segment over which opacity and blur resolve. */
  opacityEnd: 0.3,
  blurEnd: 0.6,
} as const;

/** Exit pose for the stack wrapper. */
const EXIT = { yPercent: -14 } as const;

type StackState = { y: number; scale: number; shade: number };

/** Resting pose of a card `depth` levels behind the newest one (0 = newest, on top). */
function stackState(depth: number, tabPx: number): StackState {
  return {
    y: -depth * tabPx,
    scale: 1 - depth * SCALE_STEP,
    shade: Math.min(depth * SHADE_STEP, SHADE_MAX),
  };
}

/** Total pinned scroll distance in px, derived from the card count. */
function pinLength(cardCount: number, stepPx: number): number {
  return (cardCount + EXIT_UNITS) * stepPx;
}

export { ENTER, EXIT, EXIT_UNITS, pinLength, stackState, STEP_VH, TAB_PX };
export type { StackState };
