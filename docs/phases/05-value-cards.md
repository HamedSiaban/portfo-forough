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

- [x] Scroll forward and back is perfectly reversible, no jumps at pin start/end. (Checked: card transforms identical at 0.2/0.45/0.7 progress after a round trip.)
- [x] Feels like refs 06/16 at 1440; works at 375 with touch scrolling. (Verified via emulated 375px viewport, not a real touch device.)
- [ ] Only `transform`/`opacity` animated (plus `filter` if justified); 60fps. (Only transform/opacity + `filter` on the entering card, off on coarse pointers. 60fps NOT measured with a perf trace yet; do that in Phase 12.)
- [x] Section works in any position; resizing recalculates correctly. (Resize 1440→375 rebuilt the timeline; pin-spacer height matched `(N+0.5)*step + vh`.)

## Prompt

```
Phase 05 · Value cards. Read CLAUDE.md, docs/DESIGN_SPEC.md §5 "2 · Value cards", docs/phases/05-value-cards.md,
and reference images 02, 06, 16, 12. Create branch phase/05-value-cards, enter plan mode, propose the timeline design
(pin length, per-card segments, perspective values), wait for approval. Build, verify, follow CLAUDE.md §8, and stop.
```

## Decisions log

- Pin length is derived: `(cardCount + 0.5) × step`, step = 0.9 vh desktop / 0.7 vh mobile (≈ 4.05 / 3.15 viewports). Constants live in `stack-config.ts`.
- Perspective 1200px desktop / 900px mobile via `--perspective-stack` token; origin 50% 40%. Entering pose: y 105vh, z 520, rotateX 52°, scale 1.3, blur 10px. Cards use `transform-origin: 50% 0` throughout so the tab edges stack upward.
- Deviation from DESIGN_SPEC §8: the entering tween uses `power2.out` inside its segment (scrub itself is 1:1). Fully linear felt mechanical.
- Receding cards use explicit `fromTo` from `stackState(depth)`, not relative `to`, so every scroll position has exactly one pose (reversibility).
- Darken overlay uses `bg-foreground`, so in dark theme receding cards lighten instead. This keeps the tab edges distinguishable on a near-black page.
- `snap` was NOT implemented or tested against Lenis; deferred. Revisit only if the free-scroll feel proves too loose.
- Reduced motion: layout is pure CSS (`motion-reduce:` variants) so SSR has no flash; JS adds an opacity fade-in only. With JS disabled, cards would overlap (not handled).
- Hero's `mb-[-10svh]` means the hero panel's last 10svh slides over the pinned stage, which gives the ref-02 uncover with no coupling.
- Exit lifts/fades the stack only. The ref-12 overlap with Work is Phase 06's job (it needs a negative top margin there).
- Copy is placeholder (Q4).
