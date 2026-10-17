/**
 * Pricing content + estimate formula as data (DESIGN_SPEC §5 "4 · Pricing").
 * ⚠️ Every figure here is placeholder until OPEN_QUESTIONS Q9 is answered.
 * `enabled: false` removes the section and the header Pricing button.
 */

type StepKey = "type" | "size" | "creativity" | "timeline";

type PricingOption = { value: string; label: string };

type PricingStep = {
  key: StepKey;
  /** Uppercase row label next to the step badge. */
  label: string;
  placeholder: string;
  options: PricingOption[];
};

type Range = { min: number; max: number };

type PricingPlan = {
  id: string;
  name: string;
  price: number;
  currency: string;
  period: string;
  fit: string;
  features: string[];
  cta: string;
};

type PricingContent = {
  enabled: boolean;
  title: string;
  intro: string[];
  tabs: { single: string; recurring: string };
  single: {
    title: string;
    description: string;
    footnote: string;
    steps: [PricingStep, PricingStep, PricingStep, PricingStep];
  };
  estimate: {
    currency: string;
    /** Rounded to the nearest multiple, so figures never look falsely precise. */
    roundTo: number;
    /** Base price range (in currency units) and delivery weeks per project type. */
    base: Record<string, { price: Range; weeks: Range }>;
    /** Multipliers applied to price (size, creativity, timeline "rush"). */
    size: Record<string, number>;
    creativity: Record<string, number>;
    timeline: Record<string, number>;
    /** Multipliers applied to delivery weeks. */
    sizeWeeks: Record<string, number>;
    timelineWeeks: Record<string, number>;
    labels: { timeline: string; price: string; weeks: string; cta: string };
  };
  recurring: {
    title: string;
    description: string;
    plans: [PricingPlan, PricingPlan];
  };
};

const pricing: PricingContent = {
  enabled: true,
  title: "Simple pricing",
  intro: [
    "Most projects are priced according to your needs, but I can still give you a clear idea of timelines and budget.",
    "For ongoing demands, I also offer monthly engagements.",
  ],
  tabs: { single: "Single project", recurring: "Recurring" },
  single: {
    title: "Single project",
    description: "For clearly defined projects, with a fixed scope, timeline and budget.",
    footnote: "Fill in your project information to get an estimated timeline and price range.",
    steps: [
      {
        key: "type",
        label: "Project type",
        placeholder: "Select project type*",
        options: [
          { value: "website", label: "Website" },
          { value: "product", label: "Product / app UI" },
          { value: "brand", label: "Brand identity" },
        ],
      },
      {
        key: "size",
        label: "Project size",
        placeholder: "Select project size*",
        options: [
          { value: "small", label: "Small" },
          { value: "medium", label: "Medium" },
          { value: "large", label: "Large" },
        ],
      },
      {
        key: "creativity",
        label: "Project creativity",
        placeholder: "Select project creativity*",
        options: [
          { value: "focused", label: "Focused — clean and conventional" },
          { value: "distinctive", label: "Distinctive — custom details" },
          { value: "bold", label: "Bold — motion and experimentation" },
        ],
      },
      {
        key: "timeline",
        label: "Project timeline",
        placeholder: "Select project timeline*",
        options: [
          { value: "relaxed", label: "Relaxed" },
          { value: "standard", label: "Standard" },
          { value: "rush", label: "As soon as possible" },
        ],
      },
    ],
  },
  estimate: {
    currency: "EUR",
    roundTo: 100,
    base: {
      website: { price: { min: 3000, max: 5000 }, weeks: { min: 3, max: 5 } },
      product: { price: { min: 6000, max: 10000 }, weeks: { min: 5, max: 8 } },
      brand: { price: { min: 2500, max: 4500 }, weeks: { min: 2, max: 4 } },
    },
    size: { small: 0.8, medium: 1, large: 1.6 },
    creativity: { focused: 1, distinctive: 1.25, bold: 1.5 },
    timeline: { relaxed: 0.95, standard: 1, rush: 1.3 },
    sizeWeeks: { small: 0.75, medium: 1, large: 1.6 },
    timelineWeeks: { relaxed: 1.3, standard: 1, rush: 0.7 },
    labels: {
      timeline: "Estimated timeline",
      price: "Estimated price",
      weeks: "weeks",
      cta: "Discuss this project",
    },
  },
  recurring: {
    title: "Recurring collaboration",
    description: "For ongoing needs, with flexible capacity and continuous delivery over time.",
    plans: [
      {
        id: "standard",
        name: "Standard",
        price: 3500,
        currency: "EUR",
        period: "month",
        fit: "Great for small teams with a lighter flow of projects.",
        features: [
          "Shared capacity",
          "One project at a time",
          "Weekly check-in",
          "Unlimited requests",
          "Dedicated communication channel",
        ],
        cta: "Start a conversation",
      },
      {
        id: "extended",
        name: "Extended",
        price: 6500,
        currency: "EUR",
        period: "month",
        fit: "Great for teams handling multiple projects at once.",
        features: [
          "Dedicated capacity",
          "Up to two concurrent projects",
          "Twice-weekly check-ins",
          "Unlimited requests",
          "Dedicated communication channel",
        ],
        cta: "Start a conversation",
      },
    ],
  },
};

export { pricing };
export type { PricingContent, PricingPlan, PricingStep, Range, StepKey };
