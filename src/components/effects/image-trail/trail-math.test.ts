import { describe, expect, it } from "vitest";

import { createTrailSpawner, tiltFromAngle } from "./trail-math";

describe("createTrailSpawner", () => {
  it("does not spawn on the first sample", () => {
    expect(createTrailSpawner(50).push(0, 0)).toBeNull();
  });

  it("spawns once the threshold distance is travelled, then resets the accumulator", () => {
    const spawner = createTrailSpawner(50);
    spawner.push(0, 0);
    expect(spawner.push(30, 0)).toBeNull();
    const spawn = spawner.push(60, 0);
    expect(spawn).toEqual({ x: 60, y: 0, angle: 0 });
    expect(spawner.push(80, 0)).toBeNull();
  });

  it("reports travel direction", () => {
    const spawner = createTrailSpawner(10);
    spawner.push(0, 0);
    expect(spawner.push(0, 20)?.angle).toBeCloseTo(90);
  });

  it("restarts after reset", () => {
    const spawner = createTrailSpawner(10);
    spawner.push(0, 0);
    spawner.reset();
    expect(spawner.push(500, 500)).toBeNull();
  });
});

describe("tiltFromAngle", () => {
  it("is zero for horizontal travel and max for vertical", () => {
    expect(tiltFromAngle(0, 12)).toBeCloseTo(0);
    expect(tiltFromAngle(90, 12)).toBeCloseTo(12);
    expect(tiltFromAngle(-90, 12)).toBeCloseTo(-12);
  });
});
