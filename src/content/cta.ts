/** Closing CTA panel copy (DESIGN_SPEC §5 "6 · CTA"). One entry per visual heading line. */
type CtaContent = { heading: string[]; button: string };

const cta: CtaContent = {
  heading: ["Ready to build", "something exceptional", "from 0 to 1?"],
  button: "Start a conversation",
};

export { cta };
export type { CtaContent };
