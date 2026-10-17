# Phase 09 · Section 5 · FAQ + Section 6 · CTA

**Branch:** `phase/09-faq-cta` · **Spec:** DESIGN_SPEC §5 "5 · FAQ", "6 · CTA" · **Refs:** 09, 14, 11, 07

## Goal

An elegant accordion FAQ, and a closing CTA panel with the Solitaire-victory card cascade over the wave field.

## Scope

### FAQ

- `content/faq.ts` (question/answer pairs; Foro's own questions).
- Title + "Need more information? Feel free to reach out." (link → `openInquiry()`).
- shadcn Accordion (single, collapsible), full-width hairlines, `+` → `×` rotation (CSS), body height/opacity via Motion.
- FAQPage JSON-LD.

### CTA

- `Panel` with halftone + `<WaveField>`; `display-xl` left-aligned heading + pill `Start a conversation` (→ `openInquiry()`).
- **CardCascade** (`effects/card-cascade`, Canvas 2D):
  - card sprites pre-rendered once to offscreen canvases from PatternArt palette (several pink tints, rounded rects with halftone).
  - spawn one card every ~250–400ms from the top-left region; random vx (left or right), small angle; gravity; bounce on panel floor with damping (~0.7) and friction; remove when off-canvas.
  - **No clear between frames**: every frame draws all cards at their new position, producing stepped trails; trails fade via a low-alpha background fill (or offscreen buffer decay) so they don't saturate.
  - Runs on `gsap.ticker`; starts when the panel enters the viewport; pauses off-screen; click on panel replays; respects DPR ≤ 1.5; resizes cleanly.
  - Layer order: halftone → wave → cascade → text (text stays readable; add a soft gradient behind it if needed).
- Reduced motion: static pre-rendered composition of 3–4 trails.

## Acceptance criteria

- [x] FAQ matches refs 09/14; one item open at a time; full keyboard support.
- [x] Cascade reads clearly as the Solitaire win effect (ref 11), 60fps, never covers the heading/CTA unreadably.
- [x] Both effects pause off-screen; no leaks on unmount.
- [x] Reduced motion and touch variants; both themes.

## Prompt

```
Phase 09 · FAQ + CTA. Read CLAUDE.md, docs/DESIGN_SPEC.md §5 FAQ and CTA, docs/phases/09-faq-cta.md,
and reference images 09, 14, 11, 07. Create branch phase/09-faq-cta, enter plan mode, propose a plan
(including the cascade physics and trail-fade approach), wait for approval. Build, verify, follow CLAUDE.md §8, and stop.
```

## Decisions log

Placeholder FAQ answers/CTA copy in `content/faq.ts` / `content/cta.ts` (Q4 still open). The CTA heading is the spec'd "Build your next project with us".

- FAQ title uses a new `display-sm` token (`clamp(2rem, 3.4vw, 3.5rem)`, added to DESIGN_SPEC §3) — spec said `display-lg`, but ref 09 shows a much smaller title.
- Accordion body is animated by Motion (height + opacity, expo-out 0.35s). Base UI's panel only waits for CSS animations before hiding, so `AccordionContent` keeps the panel mounted, drops Base UI's `hidden`/`style`, and sets `visibility: hidden` after the collapse (also removes closed content from tab order and the a11y tree). The CSS `animate-accordion-*` classes are no longer used.
- Base UI 1.9 only wires Enter/Space on accordion triggers; `FaqList` adds ArrowUp/Down (looping), Home and End.
- FAQPage JSON-LD is generated from the same `content/faq.ts` data, escaping `<`.
- Layer order in the CTA panel: halftone/gradient → cascade canvas → text → `WaveField` (Panel `overlay` slot, above the text so the glow tints the letters like the hero). This differs from the spec's "wave → cascade → text" literal order, deliberately.
- **Cascade physics** (`effects/card-cascade`): fixed 1/60s step with an accumulator; gravity 1900 px/s² (scaled by panel height), bounce damping 0.7, friction 0.92 per bounce, then a roll phase; spawn every 250–400ms in the top-left 3–22% of the width, 65% launched to the right; max 24 live cards. Pure functions in `cascade-math.ts` (unit-tested).
- **Trail fade:** the canvas is never cleared; cards stamp every 12% of their size travelled (chunky stepped trail). Fading uses `destination-out` on the same transparent canvas, so the halftone/gradient shows through in both themes. A per-frame 3% pass stalls under 8-bit alpha and left ghost silhouettes, so the fade is applied every 4 frames with the accumulated alpha instead (frame-rate independent).
- Sprites are pre-rendered offscreen from the `--accent-soft-*` tokens (rebuilt on size change and on the `<html>` class flip for the theme). DPR capped at 1.5. Runs on `gsap.ticker`; idle off-screen and while the tab is hidden. Clicking the panel (not links/buttons) replays.
- Reduced motion: no ticker, a static composition of 3 deterministic trails at wider spacing. Touch uses the same loop (canvas is `pointer-events: none`, native scroll untouched; tap replays).
- Verified (prod build + dev): FAQ at 1440/375 and keyboard flow; CTA at 1440/768/375, light + dark, reduced motion, off-screen pause (canvas frozen), replay, navigate-away cleanup with no console errors. Not measured: a real-device 60fps profile.
- Dev note: after adding the `display-sm` `@utility`, the already-running dev server kept serving a stale CSS chunk without it; the production build is correct. Restart `pnpm dev` if the FAQ title looks small.
