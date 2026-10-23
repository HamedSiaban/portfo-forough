import type { CaseStudy } from "./types";

const base = "/media/work/ai-spec-gen";
const themed = (name: string) => ({
  src: `${base}/${name}-light.webp`,
  srcDark: `${base}/${name}-dark.webp`,
});
const frame = { width: 3840, height: 2160, size: "wide" } as const;

const aiSpecGen: CaseStudy = {
  slug: "ai-spec-gen",
  title: "AI Spec-Gen Agent: Autonomous Handoff Pipeline",
  summary:
    "An agentic workflow that turns Figma components, product briefs and live code context into sprint-ready developer tasks with one command.",
  meta: [
    { label: "Role", value: "Product designer, concept and build" },
    { label: "Focus", value: "Design ops, AI workflow, developer handoff" },
    { label: "Inputs", value: "Figma, ClickUp, live codebase" },
  ],
  results: [
    "17-step autonomous pipeline, from design file to developer task.",
    "100% edge-case coverage before handoff: arrival, empty, error and loading states.",
    "Blockers caught in pre-flight, not mid-sprint.",
    "No more manual ticket-writing fatigue for designers.",
  ],
  cover: {
    ...themed("cover"),
    alt: "17 steps, one command: a manual handoff becomes sprint-ready tasks.",
    width: 3840,
    height: 2160,
  },
  sections: [
    {
      id: "problem",
      heading: "The problem: the hidden cost of manual handoff",
      blocks: [
        {
          type: "p",
          text: "In fast-paced product teams, the move from Figma layouts to developer tickets is leaky. Even with a solid design system, designers spend hours writing subtask descriptions, specifying arrival states, listing exact copy and documenting edge cases.",
        },
        {
          type: "p",
          text: "When details are missed, engineering velocity stalls mid-sprint. Developers stop to ask the same questions again and again: what happens on back, what is the loading state, what does the error say, what are the input limits?",
        },
        {
          type: "image",
          ...themed("bottleneck"),
          ...frame,
          alt: "Manual handoff friction: unanswered edge-case questions piling up between design and engineering.",
        },
      ],
    },
    {
      id: "strategy",
      heading: "System strategy: three inputs, one deterministic pipeline",
      blocks: [
        {
          type: "p",
          text: "Rather than leaning on vague text prompts or screenshot inspection, I engineered a deterministic 17-step agent pipeline. It ingests three context sources to produce specs engineers can trust:",
        },
        {
          type: "list",
          items: [
            "Figma design-system links: component properties, layout tokens and UI variants.",
            "ClickUp product briefs: requirements, user goals and feature scope.",
            "Live codebase context: production field limits, existing component props and API boundaries.",
          ],
        },
        {
          type: "image",
          ...themed("three-inputs-one-pipeline"),
          ...frame,
          alt: "Three inputs, one pipeline: Figma, ClickUp and the codebase feeding a single agent.",
        },
      ],
    },
    {
      id: "pipeline",
      heading: "Step-by-step pipeline execution",
      blocks: [
        { type: "p", text: "The 17 steps run across four structured phases." },
        { type: "subheading", text: "Phase 1: Intake and token mismatch detection" },
        {
          type: "p",
          text: "The agent compares design-system tokens against live codebase parameters and gathers every inconsistency into a single mismatch list before any spec is drafted.",
        },
        {
          type: "image",
          ...themed("phase-1-intake"),
          ...frame,
          alt: "Phase 1: Figma, brief and codebase intake mapped into one mismatch list.",
        },
        { type: "subheading", text: "Phase 2: Logic and behavioural prototyping" },
        {
          type: "p",
          text: "It maps explicit rules for arrival states, field constraints, empty states, maximum item thresholds and localised error copy across mobile and web.",
        },
        {
          type: "image",
          ...themed("phase-2-logic-prototype"),
          ...frame,
          alt: "Phase 2: logic mapped across arrival states, field rules and error states.",
        },
        { type: "subheading", text: "Phase 3: Automated task and subtask summaries" },
        {
          type: "p",
          text: "Every task opens with an executive summary and breaks into subtasks per screen, guaranteeing field provenance, exact copy strings, loading behaviour and platform parity.",
        },
        {
          type: "image",
          ...themed("phase-3-task-summary"),
          ...frame,
          alt: "Phase 3: the structured task summary container.",
        },
        { type: "subheading", text: "Phase 4: Pre-flight blocker prevention" },
        {
          type: "p",
          text: "Before tickets are unlocked and published for sprint start, the agent runs a final verification so every blocking dependency is caught upstream.",
        },
        {
          type: "image",
          ...themed("phase-4-pre-flight"),
          ...frame,
          alt: "Phase 4: the review, unlock, publish and dev-check workflow.",
        },
      ],
    },
    {
      id: "impact",
      heading: "Impact",
      blocks: [
        {
          type: "p",
          text: "Automating spec generation changed how the team moves through a sprint:",
        },
        {
          type: "list",
          items: [
            "Manual ticket-writing fatigue for product designers is gone.",
            "Complete upfront documentation replaced back-and-forth Slack clarifications.",
            "Engineering starts every sprint with fully clear acceptance criteria.",
          ],
        },
      ],
    },
    {
      id: "reflection",
      heading: "Reflection",
      blocks: [
        {
          type: "p",
          text: "By folding layout inspection, state definition and ticket writing into a single command, design time moves back to where it matters most: deep user research and strategic business logic.",
        },
        { type: "image", ...themed("reflection"), ...frame, alt: "Closing reflection card." },
      ],
    },
  ],
};

export { aiSpecGen };
