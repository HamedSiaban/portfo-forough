/** Contact modal copy (DESIGN_SPEC §6 "Inquiry"). The four contact tiles live in content/contact.ts. */
type InquiryContent = {
  title: string;
  description: string;
  intro: string[];
};

const inquiry: InquiryContent = {
  title: "Let's talk",
  description: "Ways to get in touch: WhatsApp, LinkedIn, Calendly or email.",
  intro: [
    "Tell me about the role and your team — pick whichever channel suits you.",
    "I generally respond within 48h.",
  ],
};

export { inquiry };
export type { InquiryContent };
