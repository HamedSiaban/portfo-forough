# Phase 05 · Section 2 · Value cards

**Branch:** `phase/05-value-cards` · **Spec:** DESIGN_SPEC §5 "2 · Value cards" · **Refs:** 02, 06, 16, 12

## Goal

Pinned section where 4 cards fly in from "outside the screen" in perspective and settle one by one into a stack over a centred headline.

## Scope

- `content/cards.ts`: 4 × `{ title, body, pattern: PatternArt variant }`.
- Sticky headline + paragraph (centred). Cards absolutely stacked in a perspective container.
- ScrollTrigger pin (~4 × viewport, `end` derived from card count), scrubbed master timeline, one segment per card:
  - card enters from below/front: `z`/scale large → 1, `rotateX` strong → 0, blur → 0 (blur via `filter` only if perf allows; else opacity), trapezoid silhouette from perspective (ref 06);
  - previous cards recede: translateY up, scale 0.92/0.86…, darken via an overlay opacity; top edges stay visible like tabs (ref 16).
- Optional `snap` to card steps (test feel with Lenis; drop it if it fights the scroll).
- Exit: stack lifts/fades as the section unpins.
- Mobile: same mechanic, tuned distances; fewer pinned viewports.
- Reduced motion: no pin; cards render as a simple vertical list with fade-in.

## Acceptance criteria

- [ ] Scroll forward and back is perfectly reversible, no jumps at pin start/end.
- [ ] Feels like refs 06/16 at 1440; works at 375 with touch scrolling.
- [ ] Only `transform`/`opacity` animated (plus `filter` if justified); 60fps.
- [ ] Section works in any position; resizing recalculates correctly.

## Prompt

```
Phase 05 · Value cards. Read CLAUDE.md, docs/DESIGN_SPEC.md §5 "2 · Value cards", docs/phases/05-value-cards.md,
and reference images 02, 06, 16, 12. Create branch phase/05-value-cards, enter plan mode, propose the timeline design
(pin length, per-card segments, perspective values), wait for approval. Build, verify, follow CLAUDE.md §8, and stop.
```

## Decisions log

-
