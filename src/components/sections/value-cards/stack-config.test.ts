import { describe, expect, it } from "vitest";

import { EXIT_UNITS, pinLength, stackState } from "./stack-config";

describe("stackState", () => {
  it("leaves the newest card untouched", () => {
    expect(stackState(0, 18)).toEqual({ y: -0, scale: 1, shade: 0 });
  });

  it("recedes up, smaller and darker per level", () => {
    const one = stackState(1, 18);
    const two = stackState(2, 18);
    expect(one.y).toBe(-18);
    expect(two.y).toBe(-36);
    expect(one.scale).toBeCloseTo(0.93);
    expect(two.scale).toBeCloseTo(0.86);
    expect(two.shade).toBeGreaterThan(one.shade);
  });

  it("caps the shade so buried cards stay legible as tabs", () => {
    expect(stackState(20, 18).shade).toBe(0.5);
  });
});

describe("pinLength", () => {
  it("derives from card count plus the exit", () => {
    expect(pinLength(4, 100)).toBe((4 + EXIT_UNITS) * 100);
    expect(pinLength(5, 100)).toBeGreaterThan(pinLength(4, 100));
  });
});
