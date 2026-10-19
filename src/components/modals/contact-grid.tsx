import {
  CalendarDotsIcon,
  EnvelopeSimpleIcon,
  LinkedinLogoIcon,
  WhatsappLogoIcon,
} from "@phosphor-icons/react/dist/ssr";
import type { ComponentType } from "react";

import { contact, type ContactTile } from "@/content/contact";

const icons: Record<ContactTile["id"], ComponentType<{ className?: string; weight?: "bold" }>> = {
  whatsapp: WhatsappLogoIcon,
  linkedin: LinkedinLogoIcon,
  calendly: CalendarDotsIcon,
  email: EnvelopeSimpleIcon,
};

/** 2×2 grid of square contact tiles. Server component: plain links, no client JS. */
function ContactGrid() {
  return (
    <ul className="grid w-full grid-cols-2 gap-4">
      {contact.map(({ id, label, hint, href, external }) => {
        const Icon = icons[id];
        return (
          <li key={id}>
            <a
              href={href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="flex aspect-square flex-col justify-between rounded-card bg-surface p-6 text-foreground transition-colors outline-none hover:bg-surface-muted focus-visible:ring-2 focus-visible:ring-ring md:p-10"
            >
              <Icon className="size-8" weight="bold" />
              <span className="flex min-w-0 flex-col">
                <span className="text-mono-ui">{label}</span>
                <span className="truncate text-body text-muted-foreground">{hint}</span>
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export { ContactGrid };
