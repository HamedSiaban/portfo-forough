import { site } from "@/config/site";

/** Contact modal tiles (2×2). `id` keys map to Phosphor icons in components/modals/contact-grid.tsx. */
type ContactTile = {
  id: "whatsapp" | "linkedin" | "calendly" | "email";
  label: string;
  hint: string;
  href: string;
  external: boolean;
};

const contact: ContactTile[] = [
  { id: "whatsapp", label: "WhatsApp", hint: "Quick chat", href: site.whatsapp, external: true },
  { id: "linkedin", label: "LinkedIn", hint: "Connect", href: site.linkedin, external: true },
  { id: "calendly", label: "Calendly", hint: "Book a call", href: site.calendly, external: true },
  { id: "email", label: "Email", hint: site.email, href: `mailto:${site.email}`, external: false },
];

export { contact };
export type { ContactTile };
