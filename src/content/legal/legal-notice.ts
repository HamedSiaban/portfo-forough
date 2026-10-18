import type { LegalDocument } from "./types";

/** Personal portfolio of an individual, so no company registration details are listed. */
const legalNotice: LegalDocument = {
  title: "Legal notice",
  description:
    "Who publishes foroforoughi.netlify.app, where it is hosted and how to reach the publisher.",
  sections: [
    {
      id: "website-publisher",
      heading: "Website publisher",
      blocks: [
        { type: "p", text: "This website, foroforoughi.netlify.app, is published by:" },
        {
          type: "p",
          text: "Foroughozaman Foroughi, independent product and UX designer based in Yerevan, Armenia.",
        },
        {
          type: "p",
          text: "This is a personal portfolio, published by an individual and not by a registered company.",
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
          text: "The website is hosted by Netlify, Inc., 512 2nd Street, Suite 200, San Francisco, CA 94107, USA. Pages are served from Netlify's global network; the enquiry form runs on servers that may be located in the United States.",
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
          text: "Typefaces: PP Frama, PP Neue Montreal and PP Supply Mono by Pangram Pangram.",
        },
      ],
    },
    {
      id: "liability",
      heading: "Liability",
      blocks: [
        {
          type: "p",
          text: "I take care to keep the information on this site accurate and up to date, but cannot guarantee that it is free of errors. External links are provided for convenience; I am not responsible for the content of third-party sites.",
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
