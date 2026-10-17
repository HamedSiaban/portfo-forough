/** Interlude statement (DESIGN_SPEC §5). One entry per visual line; each gets its own reveal mask. */
type InterludeContent = { lines: string[] };

const interlude: InterludeContent = {
  lines: ["Let’s talk", "about your", "project."],
};

export { interlude };
export type { InterludeContent };
