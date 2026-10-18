import type { PatternArtVariant } from "@/components/effects/pattern-art";

/**
 * Value-cards copy. Card count drives the pin length, so adding or removing an entry needs no
 * other change.
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
  headline: ["From raw vision", "straight to", "shipped code."],
  body: "Considered interfaces for teams that ship, from first sketch to the last pixel in production.",
  cards: [
    {
      title: "AI-Driven Velocity",
      body: "I bridge high-fidelity design and live web prototypes using an AI design-to-code pipeline. By combining systems design with modern tools like Cursor, I move from concept to functional product in days, not quarters.",
      pattern: "steps",
    },
    {
      title: "Business-Minded Craft",
      body: "I design for both: the user and the business. One without the other is half a job. Every interface, flow, and system decision is built to deliver real user value while scaling growth and key metrics.",
      pattern: "circles",
    },
    {
      title: "0-to-1 Product Systems",
      body: "From raw product ideation to structured information architecture, I create scalable design systems and resilient UX foundations that empower teams to iterate cleanly and ship with confidence.",
      pattern: "diamond",
    },
    {
      title: "Autonomous Execution",
      body: "I thrive in high-autonomy environments, synthesizing complex requirements, aligning stakeholders, and driving product execution end-to-end without needing constant hand-holding or oversight.",
      pattern: "snake",
    },
  ],
};

export { valueCards };
export type { ValueCard, ValueCardsContent };
