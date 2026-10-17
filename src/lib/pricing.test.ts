import { describe, expect, it } from "vitest";

import { pricing } from "@/content/pricing";

import { estimatePrice, isComplete, isStepEnabled, setStep } from "./pricing";

const full = { type: "website", size: "medium", creativity: "focused", timeline: "standard" };

describe("estimatePrice", () => {
  it("returns null until all four steps are set", () => {
    expect(estimatePrice({}, pricing.estimate)).toBeNull();
    expect(estimatePrice({ type: "website", size: "small" }, pricing.estimate)).toBeNull();
  });

  it("returns null for unknown option values", () => {
    expect(estimatePrice({ ...full, type: "nope" }, pricing.estimate)).toBeNull();
  });

  it("uses the base range unchanged at multiplier 1", () => {
    expect(estimatePrice(full, pricing.estimate)).toEqual({
      currency: "EUR",
      price: { min: 3000, max: 5000 },
      weeks: { min: 3, max: 5 },
    });
  });

  it("costs more for larger sizes and rush timelines", () => {
    const medium = estimatePrice(full, pricing.estimate);
    const large = estimatePrice({ ...full, size: "large" }, pricing.estimate);
    const rush = estimatePrice({ ...full, timeline: "rush" }, pricing.estimate);
    expect(large!.price.min).toBeGreaterThan(medium!.price.min);
    expect(rush!.price.min).toBeGreaterThan(medium!.price.min);
    expect(rush!.weeks.max).toBeLessThan(medium!.weeks.max);
  });

  it("rounds to the configured multiple and never returns less than one week", () => {
    const result = estimatePrice(
      { type: "brand", size: "small", creativity: "bold", timeline: "rush" },
      pricing.estimate,
    )!;
    expect(result.price.min % pricing.estimate.roundTo).toBe(0);
    expect(result.weeks.min).toBeGreaterThanOrEqual(1);
    expect(result.price.max).toBeGreaterThanOrEqual(result.price.min);
  });
});

describe("step progression", () => {
  it("enables a step only when all earlier ones are set", () => {
    expect(isStepEnabled({}, 0)).toBe(true);
    expect(isStepEnabled({}, 1)).toBe(false);
    expect(isStepEnabled({ type: "website" }, 1)).toBe(true);
    expect(isStepEnabled({ type: "website" }, 2)).toBe(false);
  });

  it("clears later steps when an earlier one changes", () => {
    expect(isComplete(full)).toBe(true);
    expect(setStep(full, "size", "large")).toEqual({ type: "website", size: "large" });
    expect(setStep(full, "type", "brand")).toEqual({ type: "brand" });
  });

  it("keeps earlier steps when the last one changes", () => {
    expect(setStep(full, "timeline", "rush")).toEqual({ ...full, timeline: "rush" });
  });
});
