import { cta } from "@/content/cta";

import { CtaPanel } from "./cta-panel";

/**
 * CTA (DESIGN_SPEC §5 "6 · CTA", ref 11): framed panel with the cursor image trail. The heading is
 * server-rendered; the effect lives in <CtaPanel />.
 */
function CtaSection() {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="relative z-10 py-4">
      <CtaPanel>
        <h2 id="contact-heading" className="relative text-display-lg text-foreground">
          {cta.heading.map((line) => (
            <span key={line} className="mb-[-0.24em] block pb-[0.24em]">
              {line}
            </span>
          ))}
        </h2>
      </CtaPanel>
    </section>
  );
}

export { CtaSection };
