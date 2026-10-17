/**
 * Hero copy. PLACEHOLDER — OPEN_QUESTIONS Q4 (copy) and Q5 (logos) are unresolved. Replace
 * with Foro's own words before launch; never reuse the reference site's text.
 */
type HeroLogo = {
  name: string;
  /** Path under /public, rendered via next/image. */
  src: string;
  width: number;
  height: number;
};

type HeroContent = {
  credentials: string[];
  /** One entry per visual line; each line gets its own reveal mask. */
  headline: string[];
  subline: string;
  logosLabel: string;
  logos: HeroLogo[];
};

const hero: HeroContent = {
  credentials: ["10+ years", "Product design", "UX research", "Design systems"],
  headline: ["Product design", "that makes", "complex things", "feel simple"],
  subline:
    "Senior product and UX designer shaping clear, considered interfaces for teams that care about craft.",
  logosLabel: "Trusted by teams behind",
  // Q5: SAMPLE wordmarks (fictional names) so the row stays visible during development.
  // Replace with approved client logos; an empty list hides the row.
  logos: [
    { name: "Northwind", src: "/media/logos/sample-1.svg", width: 120, height: 28 },
    { name: "Alder & Co", src: "/media/logos/sample-2.svg", width: 130, height: 28 },
    { name: "Lumen", src: "/media/logos/sample-3.svg", width: 90, height: 28 },
    { name: "Fieldnote", src: "/media/logos/sample-4.svg", width: 120, height: 28 },
  ],
};

export { hero };
export type { HeroContent, HeroLogo };
