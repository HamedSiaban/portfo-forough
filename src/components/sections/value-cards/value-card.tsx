import { Halftone } from "@/components/effects/halftone";
import { PatternArt } from "@/components/effects/pattern-art";
import type { ValueCard as ValueCardContent } from "@/content/cards";

/**
 * One card of the stack. The <li> is the GSAP target (fly-in / recede); the shade overlay is
 * its own element so darkening is an opacity tween, never a filter. Grid-stacked in the parent,
 * so no transforms are needed for positioning and GSAP owns the whole transform.
 */
function ValueCard({ card }: { card: ValueCardContent }) {
  return (
    <li
      data-card
      className="col-start-1 row-start-1 backface-hidden motion-reduce:col-auto motion-reduce:row-auto"
    >
      <article className="relative flex h-[min(62svh,36rem)] w-[min(30rem,86vw)] flex-col gap-6 overflow-hidden rounded-card bg-surface-muted p-4 shadow-sm motion-reduce:h-auto md:p-6">
        <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl bg-surface motion-reduce:aspect-4/3 motion-reduce:flex-none">
          <Halftone />
          <PatternArt
            variant={card.pattern}
            preserveAspectRatio="xMidYMid slice"
            className="absolute inset-0"
          />
        </div>
        <div className="flex flex-col gap-2 px-1 pb-2">
          <h3 className="text-title text-foreground">{card.title}</h3>
          <p className="text-body text-muted-foreground">{card.body}</p>
        </div>
        <div
          data-shade
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-foreground opacity-0"
        />
      </article>
    </li>
  );
}

export { ValueCard };
