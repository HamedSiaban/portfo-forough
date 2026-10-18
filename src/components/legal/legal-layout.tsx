import Link from "next/link";
import type { ReactNode } from "react";

import { HEADER_OFFSET_PX, site } from "@/config/site";
import type { LegalBlock, LegalDocument } from "@/content/legal";

const linkClass = "underline underline-offset-4 hover:text-muted-foreground";

const tokens: Record<string, ReactNode> = {
  email: (
    <a href={`mailto:${site.email}`} className={linkClass}>
      {site.email}
    </a>
  ),
  privacy: (
    <Link href="/privacy" className={linkClass}>
      privacy policy
    </Link>
  ),
  legals: (
    <Link href="/legals" className={linkClass}>
      legal notice
    </Link>
  ),
};

/** Replaces `{token}` placeholders in content strings with links. */
function Inline({ text }: { text: string }) {
  return text
    .split(/(\{\w+\})/)
    .map((part, i) => (
      <span key={i}>{(part.startsWith("{") && tokens[part.slice(1, -1)]) || part}</span>
    ));
}

function Block({ block }: { block: LegalBlock }) {
  if (block.type === "list") {
    return (
      <ul className="list-disc space-y-1 pl-6">
        {block.items.map((item) => (
          <li key={item}>
            <Inline text={item} />
          </li>
        ))}
      </ul>
    );
  }
  return (
    <p>
      <Inline text={block.text} />
    </p>
  );
}

/**
 * Refs 03/17: small title card + large content card in a narrow centred column.
 * Entrance reuses the CSS-only hero fade (transform/opacity; off under reduced motion), so this stays a Server Component.
 */
function LegalLayout({ doc }: { doc: LegalDocument }) {
  return (
    <main
      id="main-content"
      style={{ "--header-offset": `${HEADER_OFFSET_PX}px` } as React.CSSProperties}
      className="mx-auto flex w-full max-w-226 flex-col gap-6 px-4 pt-28 pb-24 md:px-6 md:pt-40"
    >
      <header
        style={{ "--hero-delay": 0 } as React.CSSProperties}
        className="w-fit animate-hero-fade rounded-card bg-surface px-8 py-10 md:px-10 md:py-12"
      >
        <h1 className="text-display-sm">{doc.title}</h1>
      </header>
      <div
        style={{ "--hero-delay": 0.1 } as React.CSSProperties}
        className="animate-hero-fade rounded-card bg-surface px-6 py-10 md:px-10 md:py-14"
      >
        {doc.sections.map((section) => (
          <section
            key={section.id}
            aria-labelledby={section.id}
            className="mb-12 scroll-mt-(--header-offset) last:mb-0"
          >
            <h2 id={section.id} className="mb-4 scroll-mt-(--header-offset) text-heading">
              {section.heading}
            </h2>
            <div className="space-y-4 text-body">
              {section.blocks.map((block, i) => (
                <Block key={i} block={block} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}

export { LegalLayout };
