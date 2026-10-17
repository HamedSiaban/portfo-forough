import { z } from "zod";

/**
 * Selection schema for the estimator. Fields are optional because the form fills
 * progressively; `isComplete()` in lib/pricing.ts gates the estimate itself.
 */
const pricingSelectionSchema = z.object({
  type: z.string().optional(),
  size: z.string().optional(),
  creativity: z.string().optional(),
  timeline: z.string().optional(),
});

type PricingSelectionValues = z.infer<typeof pricingSelectionSchema>;

export { pricingSelectionSchema };
export type { PricingSelectionValues };
