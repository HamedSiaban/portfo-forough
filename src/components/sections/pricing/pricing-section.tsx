import { pricing } from "@/content/pricing";

import { PricingReveal } from "./pricing-reveal";
import { PricingTabs } from "./pricing-tabs";

/**
 * Pricing (DESIGN_SPEC §5, refs 04/07/10): sticky title + copy on the left (static under
 * `lg`), segmented estimator / plans on the right. Self-contained; renders nothing when
 * `pricing.enabled` is false.
 */
function PricingSection() {
  if (!pricing.enabled) return null;

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="px-4 py-24 md:px-12 md:py-32"
    >
      <PricingReveal className="mx-auto grid max-w-[100rem] gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
        <div data-pricing-panel className="self-start lg:sticky lg:top-28 lg:pl-[10%]">
          <h2 id="pricing-heading" className="text-display-md text-foreground">
            {pricing.title}
          </h2>
          <div className="mt-8 grid max-w-xs gap-4 text-muted-foreground">
            {pricing.intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
        <div data-pricing-panel className="min-w-0">
          <PricingTabs />
        </div>
      </PricingReveal>
    </section>
  );
}

export { PricingSection };
