import { interlude } from "@/content/interlude";

import { InterludeReveal } from "./interlude-reveal";

/**
 * Interlude (DESIGN_SPEC §5, refs 08/10): a centred `display-xl` statement with generous air.
 * Self-contained — it carries its own vertical padding and references no neighbour.
 */
function InterludeSection() {
  return (
    <section
      id="interlude"
      aria-labelledby="interlude-heading"
      className="flex min-h-svh items-center justify-center px-4 py-32 md:px-12"
    >
      <InterludeReveal className="text-center text-display-xl text-foreground">
        {interlude.lines.map((line) => (
          <span key={line} className="block overflow-hidden px-[0.06em] pb-[0.14em]">
            <span data-interlude-line className="block">
              {line}
            </span>
          </span>
        ))}
      </InterludeReveal>
    </section>
  );
}

export { InterludeSection };
