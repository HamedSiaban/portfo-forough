"use client";

import { Button } from "@/components/ui/button";
import { pricing } from "@/content/pricing";
import { useUiStore } from "@/stores/ui-store";

/** Recurring tab (ref 07): intro card, then two plan cards with hairline feature rows. */
function RecurringPanel() {
  const { recurring } = pricing;
  const openInquiry = useUiStore((state) => state.openInquiry);

  return (
    <div className="grid gap-4">
      <div className="rounded-card bg-surface p-8 md:max-w-[60%] md:p-14">
        <h3 className="text-heading">{recurring.title}</h3>
        <p className="mt-4 max-w-xs text-muted-foreground">{recurring.description}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {recurring.plans.map((plan) => (
          <article key={plan.id} className="flex flex-col rounded-card bg-surface p-8 md:p-14">
            <h4 className="text-label">{plan.name}</h4>
            <p className="mt-3 flex items-baseline gap-2">
              <span className="text-price">
                {new Intl.NumberFormat("en", {
                  style: "currency",
                  currency: plan.currency,
                  maximumFractionDigits: 0,
                }).format(plan.price)}
              </span>
              <span className="text-title">/{plan.period}</span>
            </p>
            <p className="mt-4 max-w-56 text-muted-foreground">{plan.fit}</p>
            <ul className="my-8 border-t border-border">
              {plan.features.map((feature) => (
                <li key={feature} className="border-b border-border py-3 text-sm">
                  {feature}
                </li>
              ))}
            </ul>
            <Button className="mt-auto h-12 w-full" onClick={() => openInquiry({ plan: plan.id })}>
              {plan.cta}
            </Button>
          </article>
        ))}
      </div>
    </div>
  );
}

export { RecurringPanel };
