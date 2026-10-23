/** Hero copy. */
type HeroContent = {
  credentials: string[];
  /** One entry per visual line; each line gets its own reveal mask. */
  headline: string[];
  subline: string;
};

const hero: HeroContent = {
  credentials: ["Founding product designer", "0-to-1 systems", "AI design-to-code pipeline"],
  headline: ["Founding Product", "Designer crafting", "0-to-1 products", "from vision to code"],
  subline:
    "Specialized in 0-to-1 product architecture and design systems, leveraging advanced AI workflows to bridge high-end UX craft with production-ready code.",
};

export { hero };
export type { HeroContent };
