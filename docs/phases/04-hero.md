# Phase 04 · Section 1 · Hero

**Branch:** `phase/04-hero` · **Spec:** DESIGN_SPEC §5 Hero · **Refs:** 05, 02

## Goal

The first screen: framed panel, credentials row, giant headline, subline, logo row, with the wave field turning letters accent-coloured as the pointer passes.

## Scope

- `content/hero.ts` (credentials items, headline lines, subline, logos[]; placeholders per OPEN_QUESTIONS Q4/Q5).
- `Panel` + `WaveField` (`chromatic`, `idleDrift` on touch) + halftone.
- Headline as real text (h1). Interaction with the wave glow: blend approach from DESIGN_SPEC (canvas over text with a blend mode) or a text mask; choose in the plan and verify in **dark mode**.
- Entrance on load: credentials fade, headline lines rise with mask (GSAP, after fonts load), subline + logos follow. LCP element must be the h1 text and must not wait on JS to be visible (animate from a visible-safe state or use CSS initial state carefully).
- Scroll-out: panel translates up/scales slightly while the next section is revealed underneath (ref 02), scrubbed via ScrollTrigger, contained in this section (rule 2: no references to neighbours).
- Logo row hidden when the list is empty.

## Acceptance criteria

- [ ] Matches ref 05 layout at 1440; headline scales smoothly down to 375 without overflow.
- [ ] Pointer over headline produces accent letters with a subtle chromatic fringe; looks right in dark mode.
- [ ] LCP < 2.5s on throttled mobile (Lighthouse), CLS ≈ 0.
- [ ] Reduced motion: no entrance animation, static halftone, no scrub.
- [ ] Section still looks correct when moved to another position in `config/sections.ts`.

## Prompt

```
Phase 04 · Hero. Read CLAUDE.md, docs/DESIGN_SPEC.md §5 Hero, docs/phases/04-hero.md, and reference images 05 and 02.
Create branch phase/04-hero, enter plan mode, propose a plan (incl. how the wave glow colours the text in both themes), wait for approval.
Build, verify at 375/768/1440 in both themes and reduced motion, run a Lighthouse check, follow CLAUDE.md §8, and stop.
```

## Decisions log

-
