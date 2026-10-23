import { hero } from "@/content/hero";

const delay = (seconds: number): React.CSSProperties =>
  ({ "--hero-delay": seconds }) as React.CSSProperties;

import { HeroPanel } from "./hero-panel";

/**
 * Hero (DESIGN_SPEC §5). Server-rendered: the h1 is in the first HTML so it can be the LCP
 * element, and its entrance is CSS-only. The wave glow and scroll-out live in <HeroPanel />.
 */
function HeroSection() {
  const { credentials, headline, subline } = hero;

  return (
    <section id="hero" className="relative z-10 mb-[-10svh] pt-4">
      <HeroPanel>
        <ul className="flex animate-hero-fade flex-wrap items-center justify-center gap-x-3 gap-y-2 text-mono-ui text-foreground">
          {credentials.map((item, index) => (
            <li key={item} className="flex items-center gap-3">
              {index > 0 && <span aria-hidden className="size-1 rounded-full bg-accent" />}
              {item}
            </li>
          ))}
        </ul>

        <h1 className="mt-10 text-display-lg text-foreground md:mt-14">
          {headline.map((line, index) => (
            // pb keeps descenders inside the reveal mask; negative margin restores line spacing.
            <span key={line} className="mb-[-0.24em] block overflow-hidden pb-[0.24em]">
              <span className="block animate-hero-rise" style={delay(0.1 + index * 0.08)}>
                {line}
              </span>
            </span>
          ))}
        </h1>

        <p
          className="mt-10 max-w-[48ch] animate-hero-fade text-body-lg text-muted-foreground md:mt-14"
          style={delay(0.6)}
        >
          {subline}
        </p>
      </HeroPanel>
    </section>
  );
}

export { HeroSection };
