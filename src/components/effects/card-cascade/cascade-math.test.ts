import { describe, expect, it } from "vitest";

import { cascadeConfig as config } from "./cascade-config";
import {
  cardSize,
  createRng,
  nextSpawnDelay,
  sampleTrail,
  spawnCard,
  stepCard,
  trailAlpha,
} from "./cascade-math";

const world = { width: 1440, height: 800, size: 120 };

describe("cascade math", () => {
  it("spawns in the top-left region, above the floor, with a bounded launch", () => {
    const rng = createRng(7);
    for (let index = 0; index < 100; index += 1) {
      const card = spawnCard(rng, world, 4);
      expect(card.x).toBeGreaterThanOrEqual(world.width * config.spawnX.min);
      expect(card.x).toBeLessThanOrEqual(world.width * config.spawnX.max);
      expect(card.y).toBeLessThan(0);
      expect(Math.abs(card.vx)).toBeGreaterThanOrEqual(config.vx.min * 0.99);
      expect(Math.abs(card.vx)).toBeLessThanOrEqual(config.vx.max);
      expect(Math.abs(card.angle)).toBeLessThanOrEqual(config.angle);
      expect(card.sprite).toBeLessThan(4);
    }
  });

  it("spawn delay stays within the configured interval", () => {
    const rng = createRng(3);
    for (let index = 0; index < 100; index += 1) {
      const delay = nextSpawnDelay(rng);
      expect(delay).toBeGreaterThanOrEqual(config.spawnInterval.min);
      expect(delay).toBeLessThanOrEqual(config.spawnInterval.max);
    }
  });

  it("falls under gravity and bounces off the floor with damping", () => {
    const card = { ...spawnCard(createRng(1), world, 1), vx: 0 };
    let impactVy = 0;
    let reboundVy = 0;
    for (let step = 0; step < 600 && reboundVy === 0; step += 1) {
      const before = card.vy;
      stepCard(card, world);
      if (card.vy < 0) {
        // The bounce happens in the same step that gravity was applied.
        impactVy = before + config.gravity * config.step;
        reboundVy = card.vy;
      }
    }
    expect(impactVy).toBeGreaterThan(0);
    expect(Math.abs(reboundVy)).toBeCloseTo(impactVy * config.bounceDamping, 3);
    expect(card.y).toBeLessThanOrEqual(world.height - world.size / 2);
  });

  it("stops bouncing, rolls, and is eventually removed", () => {
    const card = { ...spawnCard(createRng(2), world, 1), vx: 200 };
    let alive = true;
    for (let step = 0; step < 3000 && alive; step += 1) alive = stepCard(card, world);
    // Either rolled to a stop or left the panel — never stuck forever.
    expect(alive).toBe(false);
  });

  it("removes cards that leave the side edges", () => {
    const card = {
      ...spawnCard(createRng(4), world, 1),
      x: world.width + world.size + 1,
      vx: 100,
    };
    expect(stepCard(card, world)).toBe(false);
  });

  it("trail alpha fades monotonically from trailAlpha to zero", () => {
    expect(trailAlpha(0)).toBeCloseTo(config.trailAlpha);
    expect(trailAlpha(config.trailLife / 2)).toBeLessThan(trailAlpha(0));
    expect(trailAlpha(config.trailLife)).toBe(0);
    expect(trailAlpha(config.trailLife * 3)).toBe(0);
  });

  it("builds deterministic static trails", () => {
    const a = sampleTrail(createRng(11), world, 100);
    const b = sampleTrail(createRng(11), world, 100);
    expect(a.length).toBeGreaterThan(5);
    expect(a).toEqual(b);
  });

  it("clamps card size", () => {
    expect(cardSize(200)).toBe(config.size.min);
    expect(cardSize(5000)).toBe(config.size.max);
  });
});
