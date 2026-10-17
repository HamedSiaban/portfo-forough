import { faq } from "@/content/faq";

import { FaqList } from "./faq-list";
import { FaqReachOut } from "./faq-reach-out";
import { FaqReveal } from "./faq-reveal";

/** Escape `<` so answer text can never close the script tag. */
function jsonLd(): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  }).replace(/</g, "\\u003c");
}

/**
 * FAQ (DESIGN_SPEC §5, refs 07/09/14): title + reach-out line above a single-open accordion.
 * Self-contained; looks the same in any position. FAQPage JSON-LD is derived from the same content.
 */
function FaqSection() {
  const { title, help, items } = faq;

  return (
    <section id="faq" aria-labelledby="faq-heading" className="px-4 py-24 md:px-12 md:py-32">
      <FaqReveal className="mx-auto max-w-3xl lg:translate-x-[8%]">
        <div
          data-faq-block
          className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between md:mb-16"
        >
          <h2 id="faq-heading" className="text-display-sm text-foreground">
            {title}
          </h2>
          <p className="max-w-[16ch] shrink-0 text-muted-foreground">
            {help.before}
            <FaqReachOut>{help.link}</FaqReachOut>
            {help.after}
          </p>
        </div>
        <div data-faq-block>
          <FaqList items={items} />
        </div>
      </FaqReveal>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd() }} />
    </section>
  );
}

export { FaqSection };
