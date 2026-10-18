import { inquiry } from "@/content/inquiry";

import type { LegalDocument } from "./types";

const f = inquiry.fields;
/** Strip the required-field asterisk so the list reads naturally. */
const label = (value: string): string => value.replace(/\*$/, "");

/**
 * Must match what the site actually does: the inquiry form fields (content/inquiry.ts), Resend
 * (lib/email.ts), in-memory rate limiting (lib/rate-limit.ts), Umami and Microsoft Clarity analytics, Netlify hosting (Q12).
 * ⚠️ TODO markers = OPEN_QUESTIONS Q11/Q12.
 */
const privacyPolicy: LegalDocument = {
  title: "Privacy policy",
  description: "What personal data this website collects, why, who processes it and your rights.",
  sections: [
    {
      id: "who-we-are",
      heading: "1. Who I am",
      blocks: [
        {
          type: "p",
          text: "This site is operated by Foroughozaman Foroughi, an independent designer based in Armenia (see the {legals}). For any privacy question, write to {email}.",
        },
      ],
    },
    {
      id: "data-we-collect",
      heading: "2. What data I collect",
      blocks: [
        {
          type: "p",
          text: "Only what you send me through the project enquiry form:",
        },
        {
          type: "list",
          items: [
            label(f.name),
            label(f.email),
            label(f.company),
            label(f.website),
            label(f.budget),
            label(f.startDate),
            label(f.launchDate),
            "Your message",
            "The plan you were looking at, if you opened the form from a pricing plan",
          ],
        },
        {
          type: "p",
          text: "Name, email and budget range are required; everything else is optional. To limit abuse, the form is rate-limited by IP address; this is kept briefly in server memory and not stored with your enquiry.",
        },
        {
          type: "p",
          text: "Your theme preference (light or dark) is saved in your browser's local storage. It never leaves your device. This site sets no advertising cookies. Microsoft Clarity sets cookies, but only if you accept them in the cookie banner. You can change your choice at any time with “Cookie settings” in the footer.",
        },
      ],
    },
    {
      id: "why",
      heading: "3. Why and on what basis",
      blocks: [
        {
          type: "p",
          text: "I use your enquiry data solely to reply to you and to prepare a proposal. The basis is your request to be contacted (pre-contractual steps) and my legitimate interest in answering enquiries. I never sell your data or use it for marketing without your consent.",
        },
      ],
    },
    {
      id: "processors",
      heading: "4. Who processes it",
      blocks: [
        {
          type: "list",
          items: [
            "Resend: delivers the enquiry to my inbox by email.",
            "Netlify: hosts the website.",
            "Umami: cookieless aggregate analytics (page views, referrers, country, device type). It honours your browser's Do Not Track setting.",
            "Microsoft Clarity: records anonymised usage, such as clicks, scrolling and session replays, and produces heatmaps so I can improve the design. It only runs if you accept cookies. Form fields are masked and not recorded. See Microsoft's privacy statement at privacy.microsoft.com.",
          ],
        },
        {
          type: "p",
          text: "These providers may process data outside your country, including in the United States, under standard contractual safeguards.",
        },
      ],
    },
    {
      id: "retention",
      heading: "5. How long I keep it",
      blocks: [
        {
          type: "p",
          text: "TODO: retention period (OPEN_QUESTIONS Q11). Enquiries that don't lead to a project are deleted after the retention period; project correspondence is kept as long as the legal obligations of the engagement require.",
        },
      ],
    },
    {
      id: "your-rights",
      heading: "6. Your rights",
      blocks: [
        {
          type: "p",
          text: "Depending on where you live, you may ask to access, correct, delete or export your data, to object to or restrict its use, and to withdraw consent at any time. Email {email} and I'll respond within 30 days. You can also complain to your local data-protection authority.",
        },
      ],
    },
    {
      id: "changes",
      heading: "7. Changes",
      blocks: [
        {
          type: "p",
          text: "If this policy changes materially, the updated version will be posted here. TODO: add a last-updated date at launch.",
        },
      ],
    },
  ],
};

export { privacyPolicy };
