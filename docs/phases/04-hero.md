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

- [x] Matches ref 05 layout at 1440; headline scales smoothly down to 375 without overflow.
- [x] Pointer over headline produces accent letters with a subtle chromatic fringe; looks right in dark mode.
- [ ] LCP < 2.5s on throttled mobile (Lighthouse), CLS ≈ 0. **Partial:** CLS 0.001 ✓; LCP 2.8s with devtools throttling (observed unthrottled 0.14–0.19s; h1 is the LCP element). See decisions log.
- [x] Reduced motion: no entrance animation, static halftone, no scrub.
- [x] Section still looks correct when moved to another position in `config/sections.ts`.

## Prompt

```
Phase 04 · Hero. Read CLAUDE.md, docs/DESIGN_SPEC.md §5 Hero, docs/phases/04-hero.md, and reference images 05 and 02.
Create branch phase/04-hero, enter plan mode, propose a plan (incl. how the wave glow colours the text in both themes), wait for approval.
Build, verify at 375/768/1440 in both themes and reduced motion, run a Lighthouse check, follow CLAUDE.md §8, and stop.
```

## Decisions log

- **Glow colours text via an overlay canvas, not a blend mode.** `Panel` got an `overlay` slot (above the text, `pointer-events-none`); `<WaveField>` gained `pointerTarget` (the panel receives pointer events) and `backdrop` (skip its own static halftone when the panel already draws one). Normal alpha compositing: pink over `#2B2B2B` text in light, over `#EDEDED` in dark. Verified in both themes; no dark-mode tweak was needed.
- **Entrance is CSS, not GSAP** (deviation from the phase scope): keyframes keep the h1 in the first paint so LCP never waits on JS; disabled under `prefers-reduced-motion`. GSAP only does the scroll-out scrub, so no element is animated by two libraries.
- **Scroll-out**: panel `yPercent -8` + `scale .95` (origin bottom) scrubbed over the hero's own scroll range; the section's `-mb-[10svh]` lets the next section sit beneath it. Skipped under reduced motion. Descenders: line masks use `pb/-mb 0.24em`.
- **Placeholder copy** in `content/hero.ts` (Q4); `logos: []` hides the row (Q5).
- **Lighthouse (mobile, production build, headless Chromium without GPU):** simulated throttling reports LCP 4.4s, but observed LCP is 138ms; with `--throttling-method=devtools` FCP = LCP = 2.8s, CLS 0.001, TBT ~300ms. Headless software WebGL inflates TBT enormously (143s) unless `--disable-3d-apis`, so WebGL runs were excluded from the numbers. The delay is the ~285KB of preloaded font files (six faces) competing with CSS on slow 4G. Tried `preload: false` on PP Frama: worse (LCP 4.4s, h1 waits for the swap), reverted. Planned fix is the Latin subsetting already required before launch (Phase 12 / CLAUDE.md §7); re-measure then.
- Pre-existing, not touched: at 375px the fixed header wraps onto two rows.
