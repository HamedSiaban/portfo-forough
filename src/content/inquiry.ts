/**
 * Inquiry modal copy and options (DESIGN_SPEC §6 "Inquiry").
 * ⚠️ Budget ranges are placeholders until OPEN_QUESTIONS Q10 is answered.
 */

type InquiryContent = {
  title: string;
  intro: string[];
  emailLinkLabel: string;
  whatsappLinkLabel: string;
  steps: { you: string; company: string; project: string; more: string };
  fields: {
    name: string;
    email: string;
    company: string;
    website: string;
    budget: string;
    startDate: string;
    launchDate: string;
    message: string;
  };
  budgets: { value: string; label: string }[];
  /** Human labels for plan ids passed through `openInquiry({ plan })`. */
  plans: Record<string, string>;
  planChip: string;
  consent: { before: string; link: string };
  send: string;
  sending: string;
  success: { title: string; body: string; close: string };
  error: { message: string; retry: string };
  discard: { title: string; body: string; keep: string; discard: string };
};

const inquiry: InquiryContent = {
  title: "Project enquiry",
  intro: [
    "Share your project details and timeline, and I'll get back to you shortly.",
    "You can also {email} — I generally respond within 48h.",
    "Need to move fast? I'm on {whatsapp}.",
  ],
  emailLinkLabel: "send me an email",
  whatsappLinkLabel: "WhatsApp",
  steps: { you: "You", company: "Your company", project: "Your project", more: "Tell us more" },
  fields: {
    name: "Name*",
    email: "Email*",
    company: "Company name",
    website: "Website",
    budget: "Budget range*",
    startDate: "Estimated start date",
    launchDate: "Expected launch date",
    message: "My project is …",
  },
  budgets: [
    { value: "under-3k", label: "Under €3,000" },
    { value: "3k-6k", label: "€3,000 – €6,000" },
    { value: "6k-12k", label: "€6,000 – €12,000" },
    { value: "12k-plus", label: "€12,000 +" },
    { value: "unsure", label: "Not sure yet" },
  ],
  plans: {
    "single-project": "Single project",
    standard: "Recurring · Standard",
    extended: "Recurring · Extended",
  },
  planChip: "Interested in",
  consent: { before: "By submitting this form, you agree to our", link: "privacy policy" },
  send: "Send",
  sending: "Sending…",
  success: {
    title: "Thank you — message sent.",
    body: "I'll reply within 48 hours. A copy of your enquiry is on its way to my inbox.",
    close: "Close",
  },
  error: {
    message: "Something went wrong and your message wasn't sent.",
    retry: "Try again",
  },
  discard: {
    title: "Discard this enquiry?",
    body: "You have unsent changes. Closing now will lose them.",
    keep: "Keep editing",
    discard: "Discard",
  },
};

export { inquiry };
export type { InquiryContent };
