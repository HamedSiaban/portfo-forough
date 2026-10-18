import { cascadeConfig as config } from "./cascade-config";

type World = { width: number; height: number; size: number };

type Card = {
  /** Centre position. */
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  spin: number;
  /** Index into the sprite list. */
  sprite: number;
  rolling: boolean;
  /** Where the card was last stamped onto the canvas (Infinity = not yet). */
  stampX: number;
  stampY: number;
};

type Rng = () => number;

/** Deterministic PRNG (mulberry32) so the reduced-motion composition is stable. */
function createRng(seed: number): Rng {
  let state = seed >>> 0 || 1;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function between(rng: Rng, min: number, max: number): number {
  return min + (max - min) * rng();
}

function cardSize(panelWidth: number): number {
  const { ratio, min, max } = config.size;
  return Math.min(max, Math.max(min, panelWidth * ratio));
}

function nextSpawnDelay(rng: Rng): number {
  return between(rng, config.spawnInterval.min, config.spawnInterval.max);
}

/** Launch from the top-left region with a random horizontal velocity and a slight angle. */
function spawnCard(rng: Rng, world: World, spriteCount: number, startX?: number): Card {
  const widthScale = world.width / config.referenceWidth;
  const direction = rng() < config.rightBias ? 1 : -1;
  return {
    x: startX ?? world.width * between(rng, config.spawnX.min, config.spawnX.max),
    y: -world.size * 0.3,
    vx: direction * between(rng, config.vx.min, config.vx.max) * Math.max(0.5, widthScale),
    vy: 0,
    angle: between(rng, -config.angle, config.angle),
    spin: between(rng, -config.spin, config.spin),
    sprite: Math.floor(rng() * spriteCount),
    rolling: false,
    stampX: Infinity,
    stampY: Infinity,
  };
}

function gravityFor(world: World): number {
  return config.gravity * Math.max(0.6, world.height / config.referenceHeight);
}

/**
 * Advances one fixed step in place. Gravity, floor bounce with damping + friction, then a roll
 * phase once the bounce is too small to read. Returns false when the card should be removed
 * (off the side edges, or rolled to a stop).
 */
function stepCard(card: Card, world: World, dt: number = config.step): boolean {
  card.vy += gravityFor(world) * dt;
  card.x += card.vx * dt;
  card.y += card.vy * dt;
  card.angle += card.spin * dt;

  const floor = world.height - world.size / 2;
  if (card.y >= floor) {
    card.y = floor;
    if (Math.abs(card.vy) * config.bounceDamping < config.restVy) {
      card.vy = 0;
      card.rolling = true;
    } else {
      card.vy = -card.vy * config.bounceDamping;
      card.vx *= config.bounceFriction;
    }
  }
  if (card.rolling) {
    card.vx *= config.rollFriction;
    card.spin *= 0.9;
    if (Math.abs(card.vx) < config.minRollVx) return false;
  }
  return card.x > -world.size && card.x < world.width + world.size;
}

/** Trail opacity for a stamp of the given age (seconds): eased fade from `trailAlpha` to 0. */
function trailAlpha(age: number): number {
  const t = Math.min(Math.max(age / config.trailLife, 0), 1);
  return config.trailAlpha * (1 - t) * (1 - t);
}

/**
 * One full ballistic path sampled at a wider spacing than the live cascade — the reduced-motion
 * composition draws a sprite at each point, so the frozen trails stay lighter and never bury
 * the heading.
 */
function sampleTrail(rng: Rng, world: World, startX: number): Pick<Card, "x" | "y" | "angle">[] {
  const card = spawnCard(rng, world, 1, startX);
  // Force a rightward launch: a static composition should fan across the panel, not pile up.
  card.vx = Math.abs(card.vx);
  const points: Pick<Card, "x" | "y" | "angle">[] = [];
  for (let step = 0; step < config.staticMaxSteps; step += 1) {
    if (!stepCard(card, world)) break;
    if (needsStamp(card, world, config.staticSpacing)) {
      card.stampX = card.x;
      card.stampY = card.y;
      points.push({ x: card.x, y: card.y, angle: card.angle });
    }
  }
  return points;
}

/** True when the card has moved far enough since its last stamp to leave the next step. */
function needsStamp(card: Card, world: World, spacing: number = config.stampDistance): boolean {
  return Math.hypot(card.x - card.stampX, card.y - card.stampY) >= world.size * spacing;
}

export {
  cardSize,
  createRng,
  needsStamp,
  nextSpawnDelay,
  sampleTrail,
  spawnCard,
  stepCard,
  trailAlpha,
};
export type { Card, Rng, World };
