import type { CaseStudy } from "./types";

const base = "/media/work/wondrfly-home";
const wide = { width: 1920, height: 1080, size: "wide" } as const;

const wondrflyHome: CaseStudy = {
  slug: "wondrfly-home",
  title: "Clearing the path to go live: provider homepage redesign",
  summary:
    "Rebuilding the merchant dashboard around one goal, publishing a first program, so new providers reach value before they drop off.",
  meta: [
    { label: "Role", value: "Founding product designer" },
    { label: "Collaborators", value: "Engineering leadership, founder, content" },
    { label: "Focus", value: "Activation, information architecture" },
  ],
  results: [
    "70% faster time-to-discovery after onboarding.",
    "65% less provider friction, with no premature verification gates.",
    "80% clearer priorities: one unambiguous primary action.",
    "A homepage aligned with the move from commissions to direct connection.",
  ],
  cover: {
    src: `${base}/before-after.webp`,
    alt: "The provider homepage, before and after.",
    width: 1920,
    height: 1080,
  },
  sections: [
    {
      id: "problem",
      heading: "The problem: a funnel that penalised merchants before value",
      blocks: [
        {
          type: "p",
          text: "When I audited the Wondrfly Pro dashboard, over 75% of newly onboarded providers were leaving before publishing a single program.",
        },
        {
          type: "p",
          text: "Instead of guiding merchants to their first value milestone, a live program that gets them discovered, the homepage leaned on three UX anti-patterns:",
        },
        {
          type: "list",
          items: [
            "Premature identity gatekeeping: background checks and identity verification were demanded before merchants saw any platform value or lead interest.",
            "The infinite progress trap: a prominent Profile Completion Score created anxiety. Profiles are never really finished, so the score became friction instead of momentum.",
            "Competing visual priorities: several CTAs carried equal weight, so merchants had to wade through noise to find a next step.",
          ],
        },
        {
          type: "p",
          text: "The objective: how do we restructure the post-onboarding landing experience to speed up go-live and cut drop-off?",
        },
        {
          type: "image",
          src: `${base}/before.webp`,
          alt: "The original provider homepage.",
          ...wide,
        },
      ],
    },
    {
      id: "research",
      heading: "Research and failure-mode diagnosis",
      blocks: [
        {
          type: "p",
          text: "I analysed provider drop-off telemetry and ran qualitative research with newly registered merchants:",
        },
        {
          type: "list",
          items: [
            "Early verification hesitation: providers saw mandatory identity checks as high-risk before any client had shown interest.",
            "Profile score paralysis: merchants didn't understand how profile metrics affected search rank, which led to task fatigue.",
            "Activation ambiguity: 8 out of 10 providers couldn't name the one action that makes their programs searchable on the marketplace.",
          ],
        },
        {
          type: "image",
          src: `${base}/profile-score-research.webp`,
          alt: "Research on the profile completion score.",
          width: 2400,
          height: 1934,
          size: "wide",
        },
      ],
    },
    {
      id: "strategy",
      heading: "Strategic realignment: program publishing as the North Star",
      blocks: [
        {
          type: "p",
          text: "I led a UX pivot: move the merchant North Star from passive profile completion to active program publishing.",
        },
        { type: "subheading", text: "Key decisions" },
        {
          type: "list",
          items: [
            "Single-action focus: “Publish first program” becomes the one primary CTA on the dashboard.",
            "Contextual verification: background checks and deeper verification wait until a merchant builds or publishes a program.",
            "Milestone progression: arbitrary completion percentages give way to tangible business milestones, from Program Created to Program Published to Profile Enriched.",
          ],
        },
        {
          type: "image",
          src: `${base}/ideation.webp`,
          alt: "Research, ideation boards and sketches.",
          width: 2400,
          height: 1047,
          size: "wide",
        },
        { type: "image", src: `${base}/low-fi.webp`, alt: "Low-fidelity explorations.", ...wide },
      ],
    },
    {
      id: "execution",
      heading: "Design execution and multi-state architecture",
      blocks: [
        {
          type: "p",
          text: "Working directly with engineering leadership and the founder, I built an adaptive, state-based dashboard framework:",
        },
        {
          type: "list",
          items: [
            "A high-attention Next Action module: an anchor card that surfaces each provider's single best step based on their real-time state.",
            "Outcome-driven copy: with content specialists, CTAs reframed around results, such as “Publish your program to start receiving parent inquiries”.",
            "Embedded merchant education: a contextual Resources and Tips module at the base of the dashboard, guiding visibility without cluttering the main flow.",
            "Adaptive information architecture: modules tailored to subscription tier and activation status.",
          ],
        },
        {
          type: "image",
          src: `${base}/high-fi.webp`,
          alt: "High-fidelity dashboard screens.",
          ...wide,
        },
        {
          type: "image",
          src: `${base}/whats-next.webp`,
          alt: "The Next Action module across provider states.",
          ...wide,
        },
        {
          type: "image",
          src: `${base}/news.webp`,
          alt: "The news section of the dashboard.",
          ...wide,
        },
        {
          type: "image",
          src: `${base}/articles.webp`,
          alt: "The Resources and Tips articles module.",
          width: 1920,
          height: 2289,
          size: "wide",
        },
      ],
    },
    {
      id: "impact",
      heading: "Impact and business outcomes",
      blocks: [
        {
          type: "p",
          text: "The redesigned homepage produced immediate activation gains across the funnel:",
        },
        {
          type: "list",
          items: [
            "Lower churn: new providers moved from registration to a live listing significantly faster.",
            "More daily active merchants: simpler task management drove more recurring engagement.",
            "Faster lead generation: less onboarding friction meant more live, searchable programs on the Wondrfly marketplace.",
          ],
        },
        {
          type: "image",
          src: `${base}/feedback.webp`,
          alt: "Feedback on the redesigned homepage.",
          width: 1920,
          height: 765,
          size: "wide",
        },
      ],
    },
    {
      id: "takeaways",
      heading: "Strategic takeaways",
      blocks: [
        {
          type: "p",
          text: "UX has to serve activation momentum. Removing artificial gates, deferring friction and making the primary value step unmistakable directly improves merchant retention and marketplace supply.",
        },
      ],
    },
  ],
};

export { wondrflyHome };
