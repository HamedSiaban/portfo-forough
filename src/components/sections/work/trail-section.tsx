import { PatternArt } from "@/components/effects/pattern-art";
import { work } from "@/content/work";

import { QuotePanel } from "./quote-panel";
import { TrailPanel } from "./trail-panel";
import { WorkReveal } from "./work-reveal";

/**
 * "Details you can feel" (image trail) beside the quote's dot-wave panel; one column under `lg`.
 * Interim home until it is merged with the CTA section. Self-contained, any position works.
 */
function TrailSection() {
  const { heading, touchHeading, trail, quote } = work;

  return (
    <section
      id="trail"
      aria-labelledby="trail-heading"
      className="relative z-10 rounded-t-panel bg-background px-4 py-3 md:px-12"
    >
      <WorkReveal className="grid gap-3 lg:grid-cols-[1.4fr_1fr]">
        <TrailPanel
          heading={
            <h2 id="trail-heading" className="text-display-lg text-foreground">
              {/* Both variants render and CSS picks one by pointer type: no hydration flash, and
                  display:none keeps the hidden one out of the accessibility tree. */}
              <span className="pointer-coarse:hidden">
                {heading.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </span>
              <span className="hidden pointer-coarse:block">
                {touchHeading.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </span>
            </h2>
          }
          images={trail.images.map((image) => (
            <PatternArt key={image.seed} variant={image.pattern} seed={image.seed} />
          ))}
        />
        <QuotePanel lines={quote.text} author={quote.author} role={quote.role} />
      </WorkReveal>
    </section>
  );
}

export { TrailSection };
