/** Hiring enquiry modal copy and options (DESIGN_SPEC §6 "Inquiry"). */

type Option = { value: string; label: string };

type InquiryContent = {
  title: string;
  intro: string[];
  emailLinkLabel: string;
  whatsappLinkLabel: string;
  steps: { you: string; company: string; role: string; more: string };
  fields: {
    name: string;
    email: string;
    company: string;
    website: string;
    role: string;
    employmentType: string;
    workSetup: string;
    startDate: string;
    message: string;
  };
  employmentTypes: Option[];
  workSetups: Option[];
  consent: { before: string; link: string };
  send: string;
  sending: string;
  success: { title: string; body: string; close: string };
  error: { message: string; retry: string };
  discard: { title: string; body: string; keep: string; discard: string };
};

const inquiry: InquiryContent = {
  title: "Let's talk",
  intro: [
    "Tell me about the role and your team, and I'll get back to you shortly.",
    "You can also {email} — I generally respond within 48h.",
    "Need to move fast? I'm on {whatsapp}.",
  ],
  emailLinkLabel: "send me an email",
  whatsappLinkLabel: "WhatsApp",
  steps: { you: "You", company: "Your company", role: "The role", more: "Tell me more" },
  fields: {
    name: "Name*",
    email: "Email*",
    company: "Company name",
    website: "Company website",
    role: "Role title",
    employmentType: "Employment type",
    workSetup: "Work setup",
    startDate: "Ideal start date",
    message: "About the role and your team …",
  },
  employmentTypes: [
    { value: "full-time", label: "Full-time" },
    { value: "part-time", label: "Part-time" },
    { value: "contract", label: "Contract / freelance" },
    { value: "unsure", label: "Not sure yet" },
  ],
  workSetups: [
    { value: "remote", label: "Remote" },
    { value: "hybrid", label: "Hybrid" },
    { value: "on-site", label: "On-site" },
    { value: "flexible", label: "Flexible" },
  ],
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
    title: "Discard this message?",
    body: "You have unsent changes. Closing now will lose them.",
    keep: "Keep editing",
    discard: "Discard",
  },
};

export { inquiry };
export type { InquiryContent };
