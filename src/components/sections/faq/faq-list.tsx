"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { FaqItem } from "@/content/faq";

/**
 * Moves focus between triggers with Arrow Up/Down (looping), Home and End — the optional
 * keys of the WAI-ARIA accordion pattern. Base UI only wires Enter/Space.
 */
function handleTriggerKeys(event: React.KeyboardEvent<HTMLElement>): void {
  const triggers = Array.from(
    event.currentTarget.querySelectorAll<HTMLElement>("[data-slot=accordion-trigger]"),
  );
  const current = triggers.indexOf(document.activeElement as HTMLElement);
  if (current === -1) return;

  const target: Record<string, number> = {
    ArrowDown: (current + 1) % triggers.length,
    ArrowUp: (current - 1 + triggers.length) % triggers.length,
    Home: 0,
    End: triggers.length - 1,
  };
  const next = target[event.key];
  if (next === undefined) return;
  event.preventDefault();
  triggers[next]?.focus();
}

/**
 * Single-open accordion (DESIGN_SPEC §5, refs 09/14). Base UI provides roles, aria-expanded and
 * Enter/Space; `handleTriggerKeys` adds arrow navigation. Hairlines run the full column width.
 */
function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <Accordion className="border-t border-border" onKeyDown={handleTriggerKeys}>
      {items.map((item) => (
        <AccordionItem key={item.id} value={item.id} className="border-b border-border">
          <AccordionTrigger className="px-3 sm:px-7">{item.question}</AccordionTrigger>
          <AccordionContent className="px-3 sm:px-7">
            <p>{item.answer}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export { FaqList };
