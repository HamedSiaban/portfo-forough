# Phase 03 · Ink field engine

**Branch:** `phase/03-ink-field` · **Spec:** DESIGN_SPEC §5 Hero "Effect", §2 tokens · **Refs:** 05, 02, 11, 12

## Goal
One reusable `<InkField />` that makes pointer movement leave ink-in-water trails rendered as halftone dots, used later by Hero, Quote panel and CTA. **This is the signature effect; iterate on feel until it's right.**

## Scope
- `components/effects/ink-field/`: client-only, loaded with `next/dynamic({ ssr: false })`; static `Halftone` fallback renders immediately (no CLS).
- three.js (or raw WebGL2 if leaner, decide in the plan), half/quarter-resolution simulation FBOs:
  - stable fluids: splat (pointer velocity → dye + velocity) → curl → vorticity confinement → divergence → pressure (Jacobi, ~20 iters) → gradient subtract → advection with dissipation.
  - display pass: dye density → **halftone shader** (screen-space dot grid; dot radius = density; soft falloff/blur at low density), tinted by palette.
  - optional **chromatic offset** uniform (RGB split) for the text interaction.
- Props: `palette` (`accent` | `dark` | custom), `intensity`, `dissipation`, `dotSize`, `halftone: boolean`, `chromatic: boolean`, `idleDrift: boolean`, `className`.
- Pointer input scoped to the host panel (pointer events, normalised coords, velocity from last position); touch supported. `idleDrift`: a slow autonomous emitter when there's no input (touch and first paint).
- Lifecycle: render loop on `gsap.ticker`; pause when off-screen (IntersectionObserver) or `document.hidden`; DPR ≤ 1.5; handle resize and WebGL context loss; dispose everything on unmount.
- Reduced motion: no simulation, static halftone gradient only.
- Theme-aware: read palette from CSS variables, update on theme change without remount.
- Dev page `/styleguide/ink` with live controls (leva or simple range inputs, dev-only) to tune parameters; record final defaults in DESIGN_SPEC.

## Acceptance criteria
- [ ] Ink trail feels fluid (swirls, smooth fade ~1.5–3s), reads as halftone dots, and looks close to refs 05/11.
- [ ] 60 fps on a mid-range laptop at 1440px; no frame drops while scrolling; loop is paused off-screen (verify in Performance panel).
- [ ] Three instances on one page don't conflict (or share a single context; justify in the plan).
- [ ] No WebGL warnings in the console; no leaks after mount/unmount ×10 (heap snapshot).
- [ ] Reduced-motion and touch variants work; both themes look intentional.
- [ ] three.js isn't in the initial JS bundle (check `next build` output / bundle analyzer).

## Prompt
```
Phase 03 · Ink field engine. Read CLAUDE.md (especially §5 rules 1, 5, 7, 8 and performance budgets),
docs/DESIGN_SPEC.md §5 Hero "Effect", docs/phases/03-ink-field.md, and study reference images 05, 02, 11, 12 closely.
Create branch phase/03-ink-field, enter plan mode, and propose the technique (three.js vs raw WebGL2, FBO sizes,
shader passes, blending with DOM text) with risks. Wait for approval. Build it with the tuning page,
show me how to test it, then follow CLAUDE.md §8 and stop.
```

## Decisions log
-
