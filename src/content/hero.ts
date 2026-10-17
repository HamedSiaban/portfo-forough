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
  // Q5: empty until Foro confirms which logos may be shown; the row is hidden when empty.
  logos: [],
};

export { hero };
export type { HeroContent, HeroLogo };
