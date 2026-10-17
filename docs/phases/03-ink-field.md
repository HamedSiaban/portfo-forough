# Phase 03 · Ink field engine

**Branch:** `phase/03-ink-field` · **Spec:** DESIGN_SPEC §5 Hero "Effect", §2 tokens · **Refs:** 05, 02, 11, 12, 19

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

- **three.js, hand-rolled FBO ping-pong** (not `GPUComputationRenderer`): dye runs at a
  different resolution than velocity/pressure, and pressure needs ~20 self-iterations per
  frame without recomputing the other fields — both awkward fits for that addon's
  one-resolution-per-instance, advance-everything-together model.
- **Superseded**: originally used `mix-blend-mode: lighten`/`screen` (light/dark theme) for
  compositing. Replaced with normal alpha compositing later in the phase — see the entry below
  on why `lighten` was the wrong technique, not just a tuning issue.
- **Multi-instance**: each `<InkField>` owns its own WebGL context (no shared-renderer
  architecture); independently paused via IntersectionObserver + `document.hidden`. Sim
  resolution is capped low (~128px) specifically so 2–3 concurrent instances stay cheap.
- **Dissipation is time-based, not frame-based**: applied as `pow(dissipationPerSecond, dt)`
  using the real `gsap.ticker` delta, so the ~1.5–3s fade holds regardless of frame rate.
- **No `forceContextLoss()` on dispose** (tried it, reverted it): a `<canvas>` caches its
  WebGL context per type for its whole lifetime. React StrictMode's dev-only double-invoke
  (mount → cleanup → mount, synchronously, same DOM node) means `dispose()` force-losing the
  context runs immediately before the very next mount tries to create a new one _on that same
  canvas_. The browser hands back the same (now-lost) context instead of a fresh one until it
  asynchronously restores, so `getShaderPrecisionFormat()` returns `null` and three's
  `WebGLRenderer` constructor throws reading `.precision` off it — deterministically, on every
  dev page load (console: `Cannot read properties of null (reading 'precision')`, engine never
  renders). Plain `renderer.dispose()` — no forced context loss — is the standard, correct
  disposal (same approach react-three-fiber uses, for this exact reason).
- Verified end-to-end after the fix: `pnpm dev` → `/styleguide/ink`, zero console errors on
  fresh load, all three simultaneous instances (primary, light, inverse) construct and render
  — confirmed visually via the dark/inverse panel's idle-drift trail (swirling halftone dots,
  correct chromatic fringe) and via a direct dye-buffer readback showing real accumulated
  density that decays on the expected ~1–2s timescale.
- **Retuned against ref 19** (user-provided screencast of the real hover feel) after the
  first pass read as a small, faint dot instead of a bold comet-shaped splash: bigger splat
  radius and chromatic offset, a higher color-saturation floor so ink reaches full opacity
  from modest pointer speed, and a soft glow term under the halftone dots. Also found and
  fixed that overlapping dye splats were accumulating additively past 1.0 on every channel,
  blowing the comet's head out to white once each channel independently clamped — switched
  dye splatting to `max()` blending (velocity stays additive) and clamp the dye sample before
  use in the display shader. Confirmed visually on the dark/inverse panel: bold pink comet
  with a dense near-solid head tapering to a sparse dot tail, close match to ref 19.
- **Superseded the above paragraph**: user feedback (real screenshots, their own browser) said
  the ink was genuinely invisible on the light background, not just subtle — and separately,
  that it felt like "blown away by wind" instead of staying anchored and shrinking in place.
  Both were real bugs, not screenshot artifacts:
  - **Invisible on light background**: `mix-blend-mode: lighten` over near-white has almost no
    headroom by construction (`lighten(src, dst) = max` per channel — a backdrop already near
    255 on every channel barely moves). Re-examining ref 19 frame-by-frame showed the real
    effect reads as vivid pink over the plain grey background too, not just over dark text — so
    `lighten`/`screen` was the wrong technique entirely, not a tuning issue. Switched to normal
    alpha compositing (no blend mode). That required normalizing the display shader's color to
    always be full-saturation hue with density driving only alpha — the dye buffer stores
    density-weighted color (dims at low density, not just lower alpha), which blend modes had
    been masking but normal compositing exposed as dark muddy specks at the trail's sparse tail.
  - **"Blown by wind"**: residual velocity (slow dissipation + vorticity confinement
    re-injecting energy) kept advecting the dye after the pointer stopped, so it visibly drifted
    instead of sitting still. Dropped velocity dissipation so it settles in well under a second
    once no new velocity is injected (the active comet trail is unaffected — fresh velocity is
    injected every splat while moving) and reduced curl strength.
    Verified: ink now stays anchored at the last pointer position and shrinks in place over
    roughly 1–2s (screenshotted at t = 0 / 0.5 / 1.5 / 3s with the pointer untouched in between),
    and reads as a clearly visible saturated-pink comet on both the light and dark tuning-page
    panels.
