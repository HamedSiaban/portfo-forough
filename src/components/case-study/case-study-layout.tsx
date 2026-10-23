import { ArrowLeftIcon, ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

import { HEADER_OFFSET_PX } from "@/config/site";
import type { CaseStudy } from "@/content/case-studies";

import { CaseStudyBlockView } from "./case-study-block";
import { CaseStudyImage } from "./case-study-media";

type CaseStudyLayoutProps = { study: CaseStudy; next?: CaseStudy };

const rise = (delay: number) => ({ "--hero-delay": delay }) as React.CSSProperties;

/**
 * Deliberately quiet reading layout: one centred column, hairline-separated sections, media only
 * where it helps. Entrance reuses the CSS-only hero fade (off under reduced motion), so the whole
 * page stays a Server Component. Content comes from `src/content/case-studies`.
 */
function CaseStudyLayout({ study, next }: CaseStudyLayoutProps) {
  return (
    <main
      id="main-content"
      style={{ "--header-offset": `${HEADER_OFFSET_PX}px` } as React.CSSProperties}
      className="mx-auto flex w-full max-w-5xl flex-col gap-16 px-4 pt-28 pb-24 md:px-6 md:pt-40"
    >
      <header className="flex flex-col gap-10">
        <Link
          href="/#work"
          style={rise(0)}
          className="inline-flex w-fit animate-hero-fade items-center gap-2 text-mono-ui text-muted-foreground hover:text-foreground"
        >
          <ArrowLeftIcon aria-hidden className="size-4" />
          All work
        </Link>
        <h1 style={rise(0.05)} className="max-w-4xl animate-hero-fade text-display-md">
          {study.title}
        </h1>
        <p
          style={rise(0.1)}
          className="max-w-2xl animate-hero-fade text-body-lg text-muted-foreground"
        >
          {study.summary}
        </p>
        <dl
          style={rise(0.15)}
          className="grid animate-hero-fade gap-6 border-y border-border py-6 sm:grid-cols-3"
        >
          {study.meta.map(({ label, value }) => (
            <div key={label} className="flex flex-col gap-2">
              <dt className="text-label text-muted-foreground">{label}</dt>
              <dd className="text-body">{value}</dd>
            </div>
          ))}
        </dl>
        <ul style={rise(0.2)} className="flex animate-hero-fade flex-col gap-2 text-title">
          {study.results.map((result) => (
            <li key={result}>{result}</li>
          ))}
        </ul>
        {study.cover && (
          <CaseStudyImage block={{ type: "image", size: "wide", ...study.cover }} priority />
        )}
      </header>

      {study.sections.map((section) => (
        <section
          key={section.id}
          aria-labelledby={section.id}
          className="flex scroll-mt-(--header-offset) flex-col gap-8 border-t border-border pt-12"
        >
          <h2 id={section.id} className="text-heading">
            {section.heading}
          </h2>
          {section.blocks.map((block, i) => (
            <CaseStudyBlockView key={i} block={block} />
          ))}
        </section>
      ))}

      {next && (
        <nav aria-label="Next case study" className="border-t border-border pt-12">
          <Link href={`/work/${next.slug}`} className="group flex flex-col gap-4">
            <span className="text-label text-muted-foreground">Next case study</span>
            <span className="flex items-start justify-between gap-6 text-display-sm">
              {next.title}
              <ArrowUpRightIcon
                aria-hidden
                className="size-8 shrink-0 transition-transform duration-(--duration-ui) ease-(--ease-ui) group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </span>
          </Link>
        </nav>
      )}
    </main>
  );
}

export { CaseStudyLayout };
