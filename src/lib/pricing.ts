import type { PricingContent, Range, StepKey } from "@/content/pricing";

/** Ordered keys — step N is enabled once step N-1 has a value. */
const STEP_ORDER: readonly StepKey[] = ["type", "size", "creativity", "timeline"];

type PricingSelection = Partial<Record<StepKey, string>>;

type PriceEstimate = { price: Range; weeks: Range; currency: string };

function isComplete(selection: PricingSelection): boolean {
  return STEP_ORDER.every((key) => Boolean(selection[key]));
}

/** A step is enabled only when every earlier step is set. */
function isStepEnabled(selection: PricingSelection, index: number): boolean {
  return STEP_ORDER.slice(0, index).every((key) => Boolean(selection[key]));
}

/** Sets one step and clears every later one, so stale answers can't leak into the estimate. */
function setStep(selection: PricingSelection, key: StepKey, value: string): PricingSelection {
  const index = STEP_ORDER.indexOf(key);
  const next: PricingSelection = {};
  STEP_ORDER.forEach((step, i) => {
    if (i < index) {
      const kept = selection[step];
      if (kept) next[step] = kept;
    }
  });
  next[key] = value;
  return next;
}

function roundTo(value: number, multiple: number): number {
  return Math.round(value / multiple) * multiple;
}

/**
 * Price = type base range × size × creativity × timeline multipliers, rounded.
 * Weeks = type base weeks × size × timeline. Returns null until all four steps are set
 * or when a value isn't in the config.
 */
function estimatePrice(
  selection: PricingSelection,
  config: PricingContent["estimate"],
): PriceEstimate | null {
  if (!isComplete(selection)) return null;
  const { type, size, creativity, timeline } = selection;
  const base = type ? config.base[type] : undefined;
  const sizeMul = size ? config.size[size] : undefined;
  const creativityMul = creativity ? config.creativity[creativity] : undefined;
  const timelineMul = timeline ? config.timeline[timeline] : undefined;
  const sizeWeeks = size ? config.sizeWeeks[size] : undefined;
  const timelineWeeks = timeline ? config.timelineWeeks[timeline] : undefined;
  if (
    !base ||
    sizeMul === undefined ||
    creativityMul === undefined ||
    timelineMul === undefined ||
    sizeWeeks === undefined ||
    timelineWeeks === undefined
  ) {
    return null;
  }

  const priceMul = sizeMul * creativityMul * timelineMul;
  const weeksMul = sizeWeeks * timelineWeeks;
  return {
    currency: config.currency,
    price: {
      min: roundTo(base.price.min * priceMul, config.roundTo),
      max: roundTo(base.price.max * priceMul, config.roundTo),
    },
    weeks: {
      min: Math.max(1, Math.round(base.weeks.min * weeksMul)),
      max: Math.max(1, Math.round(base.weeks.max * weeksMul)),
    },
  };
}

export { estimatePrice, isComplete, isStepEnabled, setStep, STEP_ORDER };
export type { PriceEstimate, PricingSelection };
