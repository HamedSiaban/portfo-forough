"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence } from "motion/react";
import { Controller, useForm, useWatch } from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StepRow } from "@/components/ui/step-row";
import { pricing } from "@/content/pricing";
import { usePriceEstimate } from "@/hooks/use-price-estimate";
import { isStepEnabled, setStep } from "@/lib/pricing";
import { pricingSelectionSchema, type PricingSelectionValues } from "@/lib/schemas/pricing";

import { EstimateCard } from "./estimate-card";

/**
 * Single-project estimator. Steps unlock one at a time; changing an earlier step clears
 * the later ones (`setStep`) so the estimate can never mix stale answers.
 */
function SingleProjectCard() {
  const { single } = pricing;
  const { control, getValues, reset } = useForm<PricingSelectionValues>({
    resolver: zodResolver(pricingSelectionSchema),
    defaultValues: {},
  });
  const selection = useWatch({ control });
  const estimate = usePriceEstimate(selection);

  return (
    <div>
      <div className="rounded-card bg-surface p-8 md:p-14">
        <h3 className="text-heading">{single.title}</h3>
        <p className="mt-4 max-w-xs text-muted-foreground">{single.description}</p>

        <form className="mt-12 grid gap-6" onSubmit={(event) => event.preventDefault()}>
          {single.steps.map((step, index) => {
            const enabled = isStepEnabled(selection, index);
            const labelId = `pricing-step-${step.key}`;
            return (
              <div key={step.key} className="grid gap-3">
                <StepRow
                  step={index + 1}
                  label={step.label}
                  active={enabled}
                  disabled={false}
                  id={labelId}
                />
                <Controller
                  control={control}
                  name={step.key}
                  render={({ field }) => (
                    <Select
                      items={step.options}
                      disabled={!enabled}
                      value={field.value ?? null}
                      onValueChange={(value) => {
                        if (typeof value !== "string") return;
                        reset(setStep(getValues(), step.key, value));
                      }}
                    >
                      <SelectTrigger
                        aria-labelledby={labelId}
                        className="h-14 w-full px-5 text-base"
                      >
                        <SelectValue placeholder={step.placeholder} />
                      </SelectTrigger>
                      <SelectContent alignItemWithTrigger={false}>
                        {step.options.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            );
          })}
        </form>

        <div aria-live="polite">
          <AnimatePresence>
            {estimate ? <EstimateCard estimate={estimate} /> : null}
          </AnimatePresence>
        </div>
      </div>
      <p className="mt-6 text-center text-sm text-subtle-foreground">{single.footnote}</p>
    </div>
  );
}

export { SingleProjectCard };
