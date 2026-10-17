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

- [ ] FAQ matches refs 09/14; one item open at a time; full keyboard support.
- [ ] Cascade reads clearly as the Solitaire win effect (ref 11), 60fps, never covers the heading/CTA unreadably.
- [ ] Both effects pause off-screen; no leaks on unmount.
- [ ] Reduced motion and touch variants; both themes.

## Prompt

```
Phase 09 · FAQ + CTA. Read CLAUDE.md, docs/DESIGN_SPEC.md §5 FAQ and CTA, docs/phases/09-faq-cta.md,
and reference images 09, 14, 11, 07. Create branch phase/09-faq-cta, enter plan mode, propose a plan
(including the cascade physics and trail-fade approach), wait for approval. Build, verify, follow CLAUDE.md §8, and stop.
```

## Decisions log

-
