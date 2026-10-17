"use client";

import { motion } from "motion/react";

import { Button } from "@/components/ui/button";
import { pricing } from "@/content/pricing";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { PriceEstimate } from "@/lib/pricing";
import { useUiStore } from "@/stores/ui-store";

import { NumberRoll } from "./number-roll";

const currencyFormat = (currency: string) => (value: number) =>
  new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);

/**
 * Estimate reveal. Motion owns the card's mount; GSAP (NumberRoll) owns only the
 * digits inside it — separate elements, per the motion ownership rule.
 */
function EstimateCard({ estimate }: { estimate: PriceEstimate }) {
  const reducedMotion = useReducedMotion();
  const openInquiry = useUiStore((state) => state.openInquiry);
  const { labels } = pricing.estimate;
  const format = currencyFormat(estimate.currency);

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reducedMotion ? undefined : { opacity: 0, y: 8 }}
      transition={{ duration: reducedMotion ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="mt-10 grid gap-6 rounded-card bg-surface-muted p-6 md:grid-cols-2"
    >
      <div>
        <p className="text-label text-muted-foreground">{labels.timeline}</p>
        <p className="mt-3 text-heading">
          <NumberRoll value={estimate.weeks.min} />–<NumberRoll value={estimate.weeks.max} />{" "}
          {labels.weeks}
        </p>
      </div>
      <div>
        <p className="text-label text-muted-foreground">{labels.price}</p>
        <p className="mt-3 text-heading">
          <NumberRoll value={estimate.price.min} format={format} />–
          <NumberRoll value={estimate.price.max} format={format} />
        </p>
      </div>
      <Button
        className="h-12 md:col-span-2"
        onClick={() => openInquiry({ plan: "single-project" })}
      >
        {labels.cta}
      </Button>
    </motion.div>
  );
}

export { EstimateCard };
