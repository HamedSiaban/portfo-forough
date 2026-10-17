import { valueCards } from "@/content/cards";

import { ValueCard } from "./value-card";
import { ValueCardsStage } from "./value-cards-stage";

/**
 * Value cards (DESIGN_SPEC §5). Server-rendered copy; the pinned fly-in timeline lives in
 * <ValueCardsStage />. All markup is in reading order, so the section is a normal heading +
 * list for assistive tech and for reduced-motion users.
 */
function ValueCardsSection() {
  const { headline, body, cards } = valueCards;

  return (
    <ValueCardsStage
      headline={
        <h2 className="text-display-xl text-foreground">
          {headline.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>
      }
      body={<p className="mx-auto mt-8 max-w-[34ch] text-body-lg text-muted-foreground">{body}</p>}
    >
      {cards.map((card) => (
        <ValueCard key={card.title} card={card} />
      ))}
    </ValueCardsStage>
  );
}

export { ValueCardsSection };
