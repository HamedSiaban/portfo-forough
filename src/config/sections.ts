import type { ComponentType } from "react";

import { CtaSection } from "@/components/sections/cta/cta-section";
import { FaqSection } from "@/components/sections/faq/faq-section";
import { HeroSection } from "@/components/sections/hero/hero-section";
import { InterludeSection } from "@/components/sections/interlude/interlude-section";
import { PricingSection } from "@/components/sections/pricing/pricing-section";
import { ValueCardsSection } from "@/components/sections/value-cards/value-cards-section";
import { WorkSection } from "@/components/sections/work/work-section";
import { pricing } from "@/content/pricing";

type SectionEntry = {
  /** Also the section's DOM anchor — reordering this list must never change an id. */
  id: string;
  label: string;
  Component: ComponentType;
};

/**
 * Ordered section registry (CLAUDE.md §5.2). page.tsx maps over this; reorder
 * the page by reordering this array and nothing else.
 */
const allSections: SectionEntry[] = [
  { id: "hero", label: "Hero", Component: HeroSection },
  { id: "approach", label: "Value cards", Component: ValueCardsSection },
  { id: "work", label: "Work", Component: WorkSection },
  { id: "interlude", label: "Interlude", Component: InterludeSection },
  { id: "pricing", label: "Pricing", Component: PricingSection },
  { id: "faq", label: "FAQ", Component: FaqSection },
  { id: "contact", label: "CTA", Component: CtaSection },
];

export const sections: SectionEntry[] = allSections.filter(
  (section) => section.id !== "pricing" || pricing.enabled,
);
