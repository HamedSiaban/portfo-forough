import { PatternArt } from "@/components/effects/pattern-art";
import { work } from "@/content/work";

import { QuotePanel } from "./quote-panel";
import { TrailPanel } from "./trail-panel";
import { WorkReveal } from "./work-reveal";

/**
 * "See for yourself" (image trail) beside the quote's dot-wave panel; one column under `lg`.
 * Interim home until it is merged with the CTA section. Self-contained, any position works.
 */
function TrailSection() {
  const { heading, trail, quote } = work;

  return (
    <section id="trail" aria-labelledby="trail-heading" className="px-4 py-3 md:px-12">
      <WorkReveal className="grid gap-3 lg:grid-cols-[1.4fr_1fr]">
        <TrailPanel
          heading={
            <h2 id="trail-heading" className="text-display-lg text-foreground">
              {heading.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
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
