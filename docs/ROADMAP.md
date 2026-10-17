# Roadmap

One phase = one branch = one PR (CLAUDE.md §8). Run them in order; 03/04 and 06 can start as soon as 02 is merged.
To start a phase in Claude Code, paste the **Prompt** block from its phase doc.

| #   | Phase                                                                 | Branch                     | Depends on | Status |
| --- | --------------------------------------------------------------------- | -------------------------- | ---------- | ------ |
| 00  | Scaffold & tooling                                                    | `phase/00-scaffold`        | —          | ☑      |
| 01  | Design system: tokens, fonts, theme, primitives                       | `phase/01-design-system`   | 00         | ☑      |
| 02  | Layout shell: header, footer, section registry, smooth scroll, stores | `phase/02-layout-shell`    | 01         | ☑      |
| 03  | Wave field engine (WebGL pointer glow + halftone)                     | `phase/03-wave-field`      | 02         | ☑      |
| 04  | Section 1 · Hero                                                      | `phase/04-hero`            | 03         | ☐      |
| 05  | Section 2 · Value cards (3D fly-in stack)                             | `phase/05-value-cards`     | 02         | ☑      |
| 06  | Section 3 · Work (image trail, quote, projects row)                   | `phase/06-work`            | 03         | ☐      |
| 07  | Video modal (shared-element expand) + interlude                       | `phase/07-video-interlude` | 06         | ☐      |
| 08  | Section 4 · Pricing                                                   | `phase/08-pricing`         | 02         | ☐      |
| 09  | Section 5 · FAQ + Section 6 · CTA (card cascade)                      | `phase/09-faq-cta`         | 03         | ☐      |
| 10  | Inquiry modal + API route + email                                     | `phase/10-inquiry`         | 02         | ☐      |
| 11  | Legal & privacy pages                                                 | `phase/11-legal`           | 02         | ☐      |
| 12  | Polish: a11y audit, perf budget, SEO/OG, e2e, deploy                  | `phase/12-polish-launch`   | all        | ☐      |

Every phase doc has: Goal · Scope · Out of scope · References · Acceptance criteria · Prompt · Decisions log.

## Known issues

- **Header wraps at narrow widths (≤ ~420px).** The fixed header's Pricing / Start a conversation / theme toggle don't fit on one row at 375px and wrap to two, overlapping the top of the hero panel. Found in Phase 04, belongs to the Phase 02 layout shell. Fix before Phase 12 (e.g. icon-only or hidden Pricing button on mobile, or a compact CTA label).
