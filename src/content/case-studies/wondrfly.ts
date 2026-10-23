import type { CaseStudy } from "./types";

/** SAMPLE — structure mirrors the old Wondrfly page; all copy is placeholder until Foro writes it. */
const wondrfly: CaseStudy = {
  slug: "wondrfly",
  title: "Wondrfly: from marketplace to a product families rely on.",
  summary:
    "Placeholder summary: one sentence on the product, the problem, and what changed because of the design work.",
  meta: [
    { label: "Role", value: "Lead product designer" },
    { label: "Timeline", value: "Q1 2024 – Q3 2025" },
    { label: "Deliverables", value: "Research, strategy, UX, UI" },
  ],
  results: [
    "Placeholder result one: a measurable outcome.",
    "Placeholder result two: a measurable outcome.",
    "Placeholder result three: a measurable outcome.",
  ],
  cover: { alt: "Placeholder cover: Wondrfly product screens", width: 1600, height: 900 },
  sections: [
    {
      id: "context",
      heading: "Context",
      blocks: [
        {
          type: "p",
          text: "Placeholder paragraph. Explain the situation: who the users are, what the business needed, and what was at stake when you joined.",
        },
        {
          type: "p",
          text: "A second paragraph keeps the reading column honest. Keep paragraphs short; one idea each.",
        },
        {
          type: "image",
          alt: "Placeholder: context image",
          caption: "Caption describing what the reader is looking at.",
          size: "wide",
        },
      ],
    },
    {
      id: "research",
      heading: "Research",
      blocks: [
        { type: "subheading", text: "What we learned" },
        {
          type: "list",
          items: [
            "Placeholder finding one.",
            "Placeholder finding two.",
            "Placeholder finding three.",
          ],
        },
        {
          type: "quote",
          text: "Placeholder pull quote from an interview or stakeholder.",
          author: "Role, company",
        },
      ],
    },
    {
      id: "solution",
      heading: "Solution",
      blocks: [
        {
          type: "p",
          text: "Placeholder paragraph describing the key decisions and the trade-offs behind them.",
        },
        {
          type: "video",
          title: "Walkthrough of the main flow",
          caption: "A short screen recording beats a paragraph of description.",
        },
        {
          type: "image",
          alt: "Placeholder: major flows diagram",
          caption: "Diagram or flow, shown wide so it stays legible.",
          size: "wide",
        },
      ],
    },
    {
      id: "impact",
      heading: "Impact",
      blocks: [
        {
          type: "metrics",
          items: [
            { value: "+00%", label: "Placeholder metric" },
            { value: "0.0×", label: "Placeholder metric" },
            { value: "-00%", label: "Placeholder metric" },
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
          text: "Placeholder paragraph: what you would do differently, and what the team taught you.",
        },
      ],
    },
  ],
};

export { wondrfly };
