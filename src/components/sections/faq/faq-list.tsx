"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { FaqItem } from "@/content/faq";

/**
 * Single-open accordion (DESIGN_SPEC §5, refs 09/14). Base UI provides roles, aria-expanded and
 * arrow/Home/End keyboard handling; hairlines run full width of the column.
 */
function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <Accordion className="border-t border-border">
      {items.map((item) => (
        <AccordionItem key={item.id} value={item.id} className="border-b border-border">
          <AccordionTrigger className="px-7">{item.question}</AccordionTrigger>
          <AccordionContent className="px-7">
            <p>{item.answer}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export { FaqList };
