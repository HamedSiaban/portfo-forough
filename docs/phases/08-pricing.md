# Phase 08 · Section 4 · Pricing

**Branch:** `phase/08-pricing` · **Spec:** DESIGN_SPEC §5 "4 · Pricing" · **Refs:** 10, 04, 07

> ⚠️ Content and pricing model are pending (OPEN_QUESTIONS Q9). Build the UI and logic against typed placeholder data behind `pricing.enabled`.

## Goal

"Simple pricing" with a Single-project estimator and Recurring plan cards.

## Scope

- `content/pricing.ts`: `enabled`, intro copy, single-project options (types, sizes, creativity, timeline) with the estimate formula as data (base ranges × multipliers), recurring plans `{ name, price, currency, period, fit, features[], cta }`.
- Layout: sticky left column (title + copy), right column content (ref 10).
- Segmented Tabs (Single project / Recurring) with an animated pill indicator (Motion `layoutId`); tab panels crossfade.
- **Single project:** react-hook-form + zod; 4 `StepRow` + Select; each step enabled only when the previous is set; when complete, an estimate card reveals timeline + price range with number roll (GSAP). Estimate computed locally via `usePriceEstimate` (TanStack Query wrapper so it can move server-side later).
- **Recurring:** intro card + 2 plan cards (ref 07); CTA → `openInquiry({ plan })`.
- Section `id="pricing"`.

## Acceptance criteria

- [ ] Matches refs 04/07/10 at 1440; single column at 375 with the title non-sticky.
- [ ] Steps progress correctly; changing an earlier step resets/updates later ones sensibly; estimate is unit-tested.
- [ ] Tabs and selects fully keyboard and screen-reader accessible.
- [ ] Setting `pricing.enabled = false` removes the section and the header Pricing button.

## Prompt

```
Phase 08 · Pricing. Read CLAUDE.md, docs/DESIGN_SPEC.md §5 "4 · Pricing", docs/OPEN_QUESTIONS.md Q9,
docs/phases/08-pricing.md, and reference images 10, 04, 07. Create branch phase/08-pricing, enter plan mode,
propose a plan, wait for approval. Build, verify, follow CLAUDE.md §8, and stop.
```

## Decisions log

-
