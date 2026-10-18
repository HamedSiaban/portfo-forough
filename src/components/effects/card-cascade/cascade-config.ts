/**
 * Solitaire-victory cascade tuning (DESIGN_SPEC §5 "6 · CTA"). Distances are CSS px, velocities
 * px/s, times seconds. Horizontal speeds and gravity are scaled by panel size in `cascade-math`
 * so the arc looks the same on a phone and a 1440 desktop.
 */
const cascadeConfig = {
  /** Physics runs on a fixed step so 60/120/144Hz displays and dropped frames behave alike. */
  step: 1 / 60,
  /** Longest frame we simulate (tab refocus etc.) before dropping time. */
  maxFrame: 0.1,
  spawnInterval: { min: 0.9, max: 1.5 },
  /** Spawn x range as a fraction of panel width — the top-left region. */
  spawnX: { min: 0.03, max: 0.22 },
  /** Share of cards launched to the right, so the cascade crosses the panel. */
  rightBias: 0.65,
  vx: { min: 120, max: 300 },
  /** Max launch angle (rad) and spin (rad/s). */
  angle: 0.12,
  spin: 0.25,
  gravity: 1900,
  /** Reference panel height/width the gravity and vx are tuned for. */
  referenceHeight: 800,
  referenceWidth: 1440,
  /** vy kept after a floor bounce. */
  bounceDamping: 0.7,
  /** vx kept after a floor bounce. */
  bounceFriction: 0.92,
  /** Below this |vy| after a bounce the card stops bouncing and rolls. */
  restVy: 60,
  /** Per-step vx multiplier while rolling on the floor. */
  rollFriction: 0.985,
  /** A rolling card slower than this is removed (its trail stays and fades). */
  minRollVx: 8,
  maxCards: 5,
  /** Card side as a fraction of panel width, clamped to px bounds. */
  size: { ratio: 0.08, min: 56, max: 110 },
  /**
   * Trails are a list of timestamped stamps redrawn every frame with alpha falling by age (the
   * canvas is cleared each frame), so they fade smoothly with no residue or pulsing.
   */
  trailLife: 1.4,
  trailAlpha: 0.8,
  /** Cards stamp after travelling this fraction of their size — the stepped trail. */
  stampDistance: 0.3,
  /** Reduced motion: how many static trails, and the longest path simulated for each. */
  staticTrails: 2,
  /** Stamp spacing (fraction of card size) for the static trails — wider than `stampDistance`. */
  staticSpacing: 0.5,
  staticMaxSteps: 600,
  dprCap: 1.5,
} as const;

export { cascadeConfig };
