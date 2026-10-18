/**
 * FAQ content (DESIGN_SPEC §5 "5 · FAQ"). ⚠️ Placeholder answers until Foro confirms the copy
 * (OPEN_QUESTIONS Q4). Answers are plain strings so the same data can feed the FAQPage JSON-LD.
 */

type FaqItem = { id: string; question: string; answer: string };

type FaqContent = {
  title: string;
  help: { before: string; link: string; after: string };
  items: FaqItem[];
};

const faq: FaqContent = {
  title: "Answers to your questions",
  help: { before: "Need more information? Feel free to ", link: "reach out", after: "." },
  items: [
    {
      id: "agencies",
      question: "How do you work with agencies?",
      answer:
        "I slot in as an extra senior designer on your team: I join your channels, follow your process and deliver in the formats your developers already use. You keep the client relationship; I keep the craft high and the handoff clean.",
    },
    {
      id: "projects",
      question: "What types of projects do you specialise in?",
      answer:
        "Product design for web and mobile apps, design systems, and marketing sites that need to feel as considered as the product behind them. I'm most useful when the problem is unclear and the interface has to carry a lot of complexity.",
    },
    {
      id: "quality",
      question: "How do you ensure quality and consistency?",
      answer:
        "Everything is built from a small set of tokens and components, so decisions are made once and reused. I prototype the interactions that matter, test them with real users where possible, and review the build against the design before anything ships.",
    },
    {
      id: "scope",
      question: "Do you handle UX research as well as UI design?",
      answer:
        "Yes. Research, flows and wireframes come first, then visual design and motion. You can hire me for the whole path or for a single stage, such as a UX audit or a high-fidelity redesign.",
    },
    {
      id: "freelancer",
      question: "How is working with you different from hiring a freelancer?",
      answer:
        "You get one accountable senior designer with agency-level process: clear milestones, written decisions, and no hand-offs between account managers and the person doing the work.",
    },
    {
      id: "workflows",
      question: "How do you integrate into existing workflows?",
      answer:
        "I work in Figma and whatever tracker you already use, join stand-ups when useful and document decisions where your team will actually find them. Onboarding takes a few days, not weeks.",
    },
    {
      id: "timeline",
      question: "How long does a typical project take?",
      answer:
        "A focused product or website design usually runs four to eight weeks. A short audit can take one to two. I'll confirm the scope after a first conversation.",
    },
    {
      id: "availability",
      question: "What's your availability?",
      answer:
        "Projects typically start within a few weeks. If you have a hard deadline, get in touch early and we'll see what is possible.",
    },
  ],
};

export { faq };
export type { FaqContent, FaqItem };
