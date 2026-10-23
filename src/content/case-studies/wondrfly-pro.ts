import type { CaseStudy } from "./types";

const base = "/media/work/wondrfly-pro";
const wide = { width: 1920, height: 1080, size: "wide" } as const;

const wondrflyPro: CaseStudy = {
  slug: "wondrfly-pro",
  title: "Wondrfly Pro: a 0-1 marketplace launch",
  summary:
    "How a passive directory with no revenue became a subscription product, after a competitor's shutdown opened a window.",
  meta: [
    { label: "Role", value: "Founding product designer" },
    { label: "Scope", value: "Sole designer, 12 modules, 40+ flows" },
    { label: "Focus", value: "Strategy, monetisation, end-to-end UX" },
  ],
  results: [
    "$0 → 1: from a passive directory to an active monetisation engine.",
    "65% of providers go live in their first session.",
    "12+ core modules and 40+ end-to-end flows designed.",
  ],
  cover: {
    src: `${base}/key-results.webp`,
    alt: "Key results of the Wondrfly Pro launch.",
    width: 1920,
    height: 1080,
  },
  sections: [
    {
      id: "context",
      heading: "Context: a product with no business",
      blocks: [
        {
          type: "p",
          text: "When I joined Wondrfly as founding product designer, Wondrfly Pro was an abandoned passive directory. Providers were listed, but clients contacted them directly off-site. The result was structural platform leakage: zero revenue, no data feedback loop and no reason for providers to stay engaged.",
        },
        {
          type: "p",
          text: "With no roadmap or monetisation logic, the platform was drifting toward shutdown. The inflection point came when TakeLessons, a major U.S. competitor, abruptly closed. I saw a market vacuum and a strategic window, and led an end-to-end product pivot.",
        },
        {
          type: "image",
          src: `${base}/takelessons-shutdown.webp`,
          alt: "The TakeLessons shutdown, the market trigger for the pivot.",
          ...wide,
        },
      ],
    },
    {
      id: "discovery",
      heading: "Strategic discovery and market validation",
      blocks: [
        {
          type: "p",
          text: "Before sketching a layout, I analysed why incumbents fail. The core flaw was clear: commission models punish providers for succeeding, taking a steep cut per lesson and pushing them to move off-platform.",
        },
        {
          type: "image",
          src: `${base}/provider-interviews.webp`,
          alt: "Research calls with providers.",
          width: 1928,
          height: 1088,
          size: "wide",
        },
        {
          type: "p",
          text: "I interviewed providers, many displaced by competitor shutdowns. Their feedback was unambiguous: they valued customer discovery and leads, and firmly rejected commission-based monetisation.",
        },
        {
          type: "image",
          src: `${base}/strategic-pivot.webp`,
          alt: "The pivot in three steps: old directory model, provider insight, subscription engine.",
          ...wide,
        },
      ],
    },
    {
      id: "architecture",
      heading: "Architecture and monetisation design",
      blocks: [
        {
          type: "p",
          text: "To win early adopters and drive immediate activation, I designed three growth hooks alongside a transparent subscription model:",
        },
        {
          type: "list",
          items: [
            "Import and Claim: providers bring established profiles and reviews from other platforms in minutes.",
            "Program-first architecture: publishing a program is the North Star metric for organic discovery.",
            "Direct client ownership: providers keep un-gated, direct relationships with their clients, which builds ecosystem trust.",
          ],
        },
        {
          type: "image",
          src: `${base}/growth-hooks.webp`,
          alt: "The three hooks: Import and Claim, Program-First, Direct Connections.",
          ...wide,
        },
        {
          type: "p",
          text: "A tiered subscription engine ties it together: a free Starter tier ($0) for instant activation, and a Growth Premium tier ($39/mo) that unlocks high-volume lead pipelines and visibility boosts.",
        },
        {
          type: "image",
          src: `${base}/pricing-page.webp`,
          alt: "The live pricing page: $0 Start versus $39 Premium.",
          ...wide,
        },
      ],
    },
    {
      id: "execution",
      heading: "End-to-end system execution",
      blocks: [
        {
          type: "p",
          text: "As the sole product designer, I owned the architecture across 12 core modules and 40+ complex flows:",
        },
        {
          type: "list",
          items: [
            "Frictionless onboarding: profile creation condensed into guided, single-screen steps with smart defaults.",
            "Multi-location program builder: scheduling, pricing rules and multi-site management in a publishing flow under five minutes.",
            "Unified messaging and lead centre: client enquiries in one place, preventing off-platform leakage and keeping response times fast.",
          ],
        },
        {
          type: "image",
          src: `${base}/product-architecture.webp`,
          alt: "Marketplace system architecture and provider lifecycle states.",
          ...wide,
        },
      ],
    },
    {
      id: "iteration",
      heading: "Post-launch iteration",
      blocks: [
        {
          type: "p",
          text: "After launch, behavioural analytics showed onboarding was smooth, but some providers wanted short-term flexibility rather than a fixed monthly commitment. We introduced Program Boosts: providers publish for free and pay modularly only when they want more visibility. It lifted platform connections by 60%.",
        },
      ],
    },
    {
      id: "reflection",
      heading: "Reflection",
      blocks: [
        {
          type: "p",
          text: "This project shaped my view of design leadership as a founding designer: it is not about styling screens. It is about solving business viability, restructuring broken systems and aligning product architecture with revenue.",
        },
        { type: "image", src: `${base}/team.webp`, alt: "The Wondrfly team.", ...wide },
      ],
    },
  ],
};

export { wondrflyPro };
