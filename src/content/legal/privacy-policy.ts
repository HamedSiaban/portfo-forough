import type { LegalDocument } from "./types";

/**
 * One paragraph on purpose: the site has no forms or accounts. It must keep matching reality —
 * Umami (cookieless) and Microsoft Clarity (consent-gated, see content/cookies.ts) analytics,
 * Netlify hosting. Update it when anything that collects data is added.
 */
const privacyPolicy: LegalDocument = {
  title: "Privacy",
  description: "How this portfolio handles visitor data.",
  sections: [
    {
      id: "privacy",
      heading: "Privacy",
      blocks: [
        {
          type: "p",
          text: "This is a personal portfolio run by Foroughozaman Foroughi from Armenia. It has no forms or accounts and I don't collect personal data directly. The site is hosted on Netlify, uses Umami for cookieless visit statistics, and, only if you accept cookies, Microsoft Clarity to record anonymised sessions and heatmaps so I can improve the design; you can change your choice any time from “Cookie settings” in the footer. If you contact me by email, WhatsApp, LinkedIn or Calendly, I use your details only to reply to you. For any question or to ask for deletion, write to {email}.",
        },
      ],
    },
  ],
};

export { privacyPolicy };
