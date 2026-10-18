import type { LegalDocument } from "./types";

/** ⚠️ TODO markers = OPEN_QUESTIONS Q11 (business registration, hosting). Fill before launch (Phase 12 gate). */
const legalNotice: LegalDocument = {
  title: "Legal notice",
  description:
    "Who publishes foroughforoughi.com, where it is hosted and how to reach the publisher.",
  sections: [
    {
      id: "website-publisher",
      heading: "Website publisher",
      blocks: [
        { type: "p", text: "This website, foroughforoughi.com, is published by:" },
        {
          type: "p",
          text: "Foroughozaman Foroughi, independent product and UX designer based in Yerevan, Armenia.",
        },
        {
          type: "p",
          text: "TODO: legal status, state registration number, tax ID and registered address (OPEN_QUESTIONS Q11).",
        },
      ],
    },
    {
      id: "contact",
      heading: "Contact",
      blocks: [{ type: "p", text: "By email: {email}. I generally reply within 48 hours." }],
    },
    {
      id: "hosting",
      heading: "Hosting",
      blocks: [
        {
          type: "p",
          text: "The website is hosted by Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA. TODO: confirm hosting provider and region (OPEN_QUESTIONS Q11/Q12).",
        },
      ],
    },
    {
      id: "intellectual-property",
      heading: "Intellectual property",
      blocks: [
        {
          type: "p",
          text: "The design, text, images and code of this website, and the projects shown in the portfolio, are protected by copyright and belong to their respective authors and clients. Nothing may be reproduced without written permission.",
        },
        {
          type: "p",
          text: "Typefaces are licensed from Pangram Pangram. TODO: confirm licence before launch.",
        },
      ],
    },
    {
      id: "liability",
      heading: "Liability",
      blocks: [
        {
          type: "p",
          text: "I take care to keep the information on this site accurate and up to date, but cannot guarantee that it is free of errors. Prices shown are indicative estimates, not a binding offer. External links are provided for convenience; I am not responsible for the content of third-party sites.",
        },
      ],
    },
    {
      id: "personal-data",
      heading: "Personal data",
      blocks: [
        {
          type: "p",
          text: "How personal data is handled is described in the {privacy}.",
        },
      ],
    },
  ],
};

export { legalNotice };
