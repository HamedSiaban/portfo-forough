# Phase 03 · Wave field engine

**Branch:** `phase/03-wave-field` · **Spec:** DESIGN_SPEC §5 Hero "Effect", §2 tokens · **Refs:** 05, 02, 11, 12, 19

## Goal

One reusable `<WaveField />`: a shiny halftone glow shaped like a comet: a bright, narrow head anchored on the pointer with a wider, dimmer body trailing behind it. It grows with pointer speed (faster = bigger and longer tail, slower = smaller). Used later by Hero, Quote panel and CTA. **This is the signature effect; iterate on feel until it's right.**

It is deliberately _not_ a fluid or simulation: nothing swirls or drifts, and no pixels are remembered between frames. The tail is a short chain of points that chase the pointer, so it always collapses back onto it.

## Scope

- `components/effects/wave-field/`: client-only, loaded with `next/dynamic({ ssr: false })`; static `Halftone` fallback renders immediately (no CLS).
- three.js, a single fullscreen shader pass per frame (no framebuffers):
  - max of 16 radial falloffs along the comet chain (head at the pointer, wider and dimmer toward the tail), in device pixels;
  - **halftone shader** (screen-space dot grid; dot radius = density) with a soft halo under the dots;
  - optional **chromatic offset** (RGB split) for the text interaction.
- Props: `palette` (`accent` | `dark` | custom), `intensity` (size multiplier), `dotSize`, `halftone: boolean`, `chromatic: boolean`, `idleDrift: boolean`, `className`.
- Pointer input scoped to the host panel; touch supported. Speed is measured per frame from pointer displacement and exponentially smoothed into the radius (grows fast, relaxes slowly). Leaving the panel fades the glow out in place. `idleDrift`: a slow autonomous pointer substitute when there's no input (touch and first paint).
- Lifecycle: render loop on `gsap.ticker`; pause when off-screen (IntersectionObserver) or `document.hidden`; DPR ≤ 1.5; handle resize and WebGL context loss; dispose everything on unmount.
- Reduced motion: no WebGL, static halftone gradient only.
- Theme-aware: read palette from CSS variables, update on theme change without remount.
- Dev page `/styleguide/wave` with live controls to tune parameters; record final defaults in DESIGN_SPEC.

## Acceptance criteria

- [ ] The head eases into motion and overshoots slightly on stop, then settles exactly on the pointer (~0.5s); the tail collapses with it, with no drift.
- [ ] While moving, the body behind the head is visibly larger than the front (comet/flame shape).
- [ ] Faster pointer = visibly bigger glow; slowing down shrinks it back smoothly.
- [ ] Reads as halftone dots with a soft halo, and looks close to refs 05/11/19 in colour and feel.
- [ ] 60 fps on a mid-range laptop at 1440px; loop is paused off-screen (verify in Performance panel).
- [ ] Three instances on one page don't conflict.
- [ ] No WebGL warnings in the console; no leaks after mount/unmount ×10 (heap snapshot).
- [ ] Reduced-motion and touch variants work; both themes look intentional.
- [ ] three.js isn't in the initial JS bundle (check `next build` output / bundle analyzer).

## Prompt

```
Phase 03 · Wave field engine. Read CLAUDE.md (especially §5 rules 1, 5, 7, 8 and performance budgets),
docs/DESIGN_SPEC.md §5 Hero "Effect", docs/phases/03-wave-field.md, and study reference images 05, 02, 11, 12, 19 closely.
Create branch phase/03-wave-field, enter plan mode, and propose the technique with risks. Wait for approval.
Build it with the tuning page, show me how to test it, then follow CLAUDE.md §8 and stop.
```

## Decisions log

- **three.js, vanilla**, one fullscreen quad with a camera-independent vertex stage. Each
  `<WaveField>` owns its own WebGL context, independently paused via IntersectionObserver +
  `document.hidden`.
- **Dropped the fluid simulation entirely** (and the intermediate decaying dye buffer that
  replaced it). First pass was a stable-fluids sim; the follow-up kept a decaying dye buffer
  with a splat at the pointer each frame. Both still left a trail that faded behind the pointer
  and read as "something floating in water", which is the wrong feel. The brief is a glow that
  is always around the pointer and whose size follows pointer speed, so the engine is now a
  stateless single pass: no buffers, no velocity field, no dissipation prop.
- **Speed → size**: speed is pointer displacement per frame ÷ dt (px/s), mapped linearly to a
  radius between a 34px rest size and 150px at ≥ 2200 px/s, scaled by `intensity`. Smoothed
  with different rates for growing (fast) and shrinking (slow) so a flick reads clearly and
  relaxes gracefully; frame-rate independent via `exp(-rate·dt)`.
- **Normal alpha compositing, no `mix-blend-mode`**: `lighten`/`screen` had no headroom over the
  near-white background (ref 19 shows vivid pink over both background and text). The shader
  outputs straight, full-saturation tint with the falloff driving only alpha, and the material
  uses `NoBlending` so three doesn't premultiply and darken the edges.
- **No `forceContextLoss()` on dispose**: a `<canvas>` caches its WebGL context for its whole
  lifetime, and React StrictMode's dev double-invoke (mount → cleanup → mount on the same DOM
  node) would hand back the just-lost context, making three's `WebGLRenderer` constructor throw
  (`Cannot read properties of null (reading 'precision')`). Plain `renderer.dispose()` is the
  correct disposal.
- Renamed to "wave" across code, routes, docs and the branch; the effect no longer
  keeps any water/fluid metaphor.
- **Comet tail (added after the stateless glow)**: a 16-point chain on the CPU, head pinned to the pointer and each point chasing the one ahead (rate 40/s), uploaded as a `vec4[16]` uniform (x, y, radius, strength). Radius narrows at the head and swells toward the tail with speed; strength decays along the chain. Still one pass and no buffers, so it can't outlive the pointer.
- **Momentum**: the head is an underdamped spring (stiffness 225, damping 12, substepped at ≤ 1/120s) chasing the pointer instead of being pinned to it, so it lags on start and overshoots on stop. Speed → size is measured from the head's real motion, so the glow stays big through the overshoot and shrinks as it settles. It is always pulled back to the pointer, so it still can't drift away.
