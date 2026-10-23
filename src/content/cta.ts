import type { PatternArtVariant } from "@/components/effects/pattern-art";

/** Closing CTA panel copy (DESIGN_SPEC §5 "6 · CTA"). One entry per visual heading line. */
type CtaContent = {
  heading: string[];
  button: string;
  /** Tiles the cursor image trail cycles through. PLACEHOLDER generated art (OPEN_QUESTIONS Q6). */
  trail: { pattern: PatternArtVariant; seed: string }[];
};

const cta: CtaContent = {
  heading: ["Ready to build", "something exceptional", "from 0 to 1?"],
  button: "Start a conversation",
  trail: [
    { pattern: "steps", seed: "trail-1" },
    { pattern: "circles", seed: "trail-2" },
    { pattern: "diamond", seed: "trail-3" },
    { pattern: "snake", seed: "trail-4" },
    { pattern: "steps", seed: "trail-5" },
    { pattern: "diamond", seed: "trail-6" },
    { pattern: "circles", seed: "trail-7" },
    { pattern: "snake", seed: "trail-8" },
  ],
};

export { cta };
export type { CtaContent };
