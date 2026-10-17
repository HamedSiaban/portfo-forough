"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { pricing } from "@/content/pricing";
import {
  estimatePrice,
  isComplete,
  type PriceEstimate,
  type PricingSelection,
} from "@/lib/pricing";

/**
 * Estimate for the current selection. The queryFn is local today; wrapping it in
 * TanStack Query means moving the formula server-side later only swaps this function.
 */
function usePriceEstimate(selection: PricingSelection): PriceEstimate | null {
  const { data } = useQuery({
    queryKey: ["price-estimate", selection],
    queryFn: () => estimatePrice(selection, pricing.estimate),
    enabled: isComplete(selection),
    placeholderData: keepPreviousData,
  });
  // keepPreviousData would otherwise leave a stale estimate on screen after an earlier step resets.
  return isComplete(selection) ? (data ?? null) : null;
}

export { usePriceEstimate };
