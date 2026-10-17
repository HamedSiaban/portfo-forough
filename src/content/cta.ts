/** Closing CTA panel copy (DESIGN_SPEC §5 "6 · CTA"). One entry per visual heading line. */
type CtaContent = { heading: string[]; button: string };

const cta: CtaContent = {
  heading: ["Build your next", "project with us"],
  button: "Start a conversation",
};

export { cta };
export type { CtaContent };
