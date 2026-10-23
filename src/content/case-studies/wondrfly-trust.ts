import type { CaseStudy } from "./types";

const base = "/media/work/wondrfly-trust";
const wide = { width: 1920, height: 1080, size: "wide" } as const;
const banner = { width: 1920, height: 765, size: "wide" } as const;

const wondrflyTrust: CaseStudy = {
  slug: "wondrfly-trust",
  title: "Wondrfly's Trust Shift: designing for parent confidence",
  summary:
    "Removing the trust barriers at the moment of connection, and giving providers a way to earn social proof.",
  meta: [
    { label: "Role", value: "Founding product designer" },
    { label: "Focus", value: "Trust, social proof, conversion" },
    { label: "Method", value: "User sessions, AI-simulated usability tests" },
  ],
  results: [
    "60% revenue growth during the MVP phase.",
    "More client-to-provider connections, and more lead-generating conversations.",
    "No more discouraging “No reviews yet” label.",
    "Providers collect testimonials through a low-friction request flow.",
  ],
  cover: {
    src: `${base}/review-request-hero.webp`,
    alt: "The review request flow for providers.",
    width: 1920,
    height: 1080,
  },
  sections: [
    {
      id: "problem",
      heading: "The problem: high intent, high drop-off",
      blocks: [
        {
          type: "p",
          text: "Across Wondrfly's discovery funnel, a bottleneck stood out: parents browsed program cards and opened detail pages, then stalled right before the primary Connect button.",
        },
        {
          type: "p",
          text: "Providers had strong descriptions and professional offerings, yet intent died on the page. The root cause was an accidental trust penalty built into the interface:",
        },
        {
          type: "list",
          items: [
            "Providers without history were explicitly labelled “No reviews yet”.",
            "That negative signal sat prominently on both program cards and detail pages, manufacturing doubt for high-intent parents.",
          ],
        },
        {
          type: "image",
          src: `${base}/no-reviews-state.webp`,
          alt: "The “No reviews yet” state on the client side.",
          ...banner,
        },
        {
          type: "p",
          text: "The design question: how do we remove friction and create psychological safety at the moment of decision?",
        },
        {
          type: "image",
          src: `${base}/connect-sentence.webp`,
          alt: "The design goal, framed around the Connect moment.",
          ...banner,
        },
      ],
    },
    {
      id: "research",
      heading: "Research and behavioural insights",
      blocks: [
        {
          type: "p",
          text: "To understand the hesitation, I combined qualitative user sessions with AI-simulated behavioural usability tests focused on pre-connection states. The findings were stark:",
        },
        {
          type: "list",
          items: [
            "85% of parents actively look for social proof or verified legitimacy before making contact.",
            "“No reviews yet” read as a risk signal, not as a new provider.",
            "Trust in a marketplace can't be assumed. It has to be engineered into the UI.",
          ],
        },
        {
          type: "image",
          src: `${base}/ai-research.webp`,
          alt: "AI research findings and takeaways.",
          width: 1162,
          height: 2400,
          size: "wide",
        },
      ],
    },
    {
      id: "strategy",
      heading: "Strategy: from absence of proof to proof of trust",
      blocks: [
        {
          type: "p",
          text: "Instead of a cosmetic patch, I designed a trust-building system around three principles:",
        },
        {
          type: "list",
          items: [
            "Active generation: a low-friction way for providers to request and gather reviews from their existing networks.",
            "Contextual social proof: high-converting testimonials surfaced at decision milestones.",
            "Graceful fallbacks: penalty tags removed for new providers, without weakening the integrity of the ecosystem.",
          ],
        },
        {
          type: "image",
          src: `${base}/strategy.webp`,
          alt: "Strategy principles and supporting research.",
          width: 1881,
          height: 2400,
          size: "wide",
        },
      ],
    },
    {
      id: "execution",
      heading: "System execution and features",
      blocks: [
        {
          type: "p",
          text: "The system turns credibility from a passive outcome into an active workflow for providers.",
        },
        { type: "subheading", text: "Credibility-builder review request flow" },
        {
          type: "p",
          text: "A guided workflow that lets providers request reviews from past clients in seconds.",
        },
        {
          type: "video",
          src: "/video/wondrfly-trust/review-request-flow.mp4",
          poster: `${base}/review-request-flow-poster.webp`,
          title: "Credibility-builder review request flow prototype",
        },
        { type: "subheading", text: "Featured reviews and contextual testimonials" },
        {
          type: "p",
          text: "Modular testimonial cards on program pages, designed to be scanned quickly and to validate trust at a glance.",
        },
        {
          type: "image",
          src: `${base}/featured-reviews.webp`,
          alt: "Featured reviews flow on a program page.",
          ...wide,
        },
        { type: "subheading", text: "Verified provider fallback" },
        {
          type: "p",
          text: "A neutral “Verified Provider” badge replaces the discouraging “No reviews yet” tag, keeping new providers credible.",
        },
        {
          type: "image",
          src: `${base}/verified-badge.webp`,
          alt: "The Verified Provider badge state.",
          ...wide,
        },
      ],
    },
    {
      id: "impact",
      heading: "Impact and business outcomes",
      blocks: [
        { type: "p", text: "The trust system turned out to be a high-leverage growth driver:" },
        {
          type: "list",
          items: [
            "Trust translated into engagement: a surge in valuable, lead-generating conversations.",
            "It contributed directly to 60% overall revenue growth while the platform was still in its MVP phase.",
            "It showed that removing micro-friction in trust architecture produces macro-level liquidity.",
          ],
        },
        {
          type: "image",
          src: `${base}/providers-with-reviews.webp`,
          alt: "Providers with reviews and testimonials.",
          ...wide,
        },
      ],
    },
    {
      id: "learnings",
      heading: "Strategic learnings",
      blocks: [
        {
          type: "p",
          text: "Small, system-level UX decisions decide marketplace liquidity. Trust can't be an afterthought. It has to be built into the product core to bridge intent and conversion.",
        },
      ],
    },
  ],
};

export { wondrflyTrust };
