import type { ComponentType } from "react";

import { CtaSection } from "@/components/sections/cta/cta-section";
import { HeroSection } from "@/components/sections/hero/hero-section";
import { ValueCardsSection } from "@/components/sections/value-cards/value-cards-section";
import { TrailSection } from "@/components/sections/work/trail-section";
import { WorkSection } from "@/components/sections/work/work-section";

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
export const sections: SectionEntry[] = [
  { id: "hero", label: "Hero", Component: HeroSection },
  { id: "work", label: "Work", Component: WorkSection },
  { id: "trail", label: "Trail & quote", Component: TrailSection },
  { id: "approach", label: "Value cards", Component: ValueCardsSection },
  { id: "contact", label: "CTA", Component: CtaSection },
];
