/**
 * Hero copy. Logos are still SAMPLE placeholders (OPEN_QUESTIONS Q5).
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
  credentials: ["Founding product designer", "0-to-1 systems", "AI design-to-code pipeline"],
  headline: ["Founding Product", "Designer crafting", "0-to-1 products", "from vision to code"],
  subline:
    "Specialized in 0-to-1 product architecture and design systems, leveraging advanced AI workflows to bridge high-end UX craft with production-ready code.",
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
