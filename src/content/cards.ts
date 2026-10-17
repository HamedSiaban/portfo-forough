import type { PatternArtVariant } from "@/components/effects/pattern-art";

/**
 * Value-cards copy. PLACEHOLDER — OPEN_QUESTIONS Q4 (copy) is unresolved. Replace with Foro's
 * own words before launch; never reuse the reference site's text. Card count drives the pin
 * length, so adding or removing an entry needs no other change.
 */
type ValueCard = {
  title: string;
  body: string;
  pattern: PatternArtVariant;
};

type ValueCardsContent = {
  headline: string[];
  body: string;
  cards: ValueCard[];
};

const valueCards: ValueCardsContent = {
  headline: ["Craft you can", "count on."],
  body: "Considered interfaces for teams that ship, from first sketch to the last pixel in production.",
  cards: [
    {
      title: "Start to finish",
      body: "Research, flows, UI and handoff, owned by one designer so nothing gets lost in translation.",
      pattern: "steps",
    },
    {
      title: "Experienced pro",
      body: "Clear briefs in, confident decisions out, without needing constant supervision.",
      pattern: "circles",
    },
    {
      title: "Top quality",
      body: "Details, motion and states that feel finished, because they were designed that way.",
      pattern: "diamond",
    },
    {
      title: "Built to scale",
      body: "Systems and components that stay consistent as the product and the team grow.",
      pattern: "snake",
    },
  ],
};

export { valueCards };
export type { ValueCard, ValueCardsContent };
