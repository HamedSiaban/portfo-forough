# Phase 06 · Section 3 · Work

**Branch:** `phase/06-work` · **Spec:** DESIGN_SPEC §5 "3 · Work" · **Refs:** 12, 13, 15, 08

## Goal

Bento section: image-trail panel, quote panel with dark wave glow, showreel tile (opens video in phase 07) and the "Latest delivery" project row.

## Scope

- `content/work.ts`: trail images[], quote `{ text, author, role }`, showreel `{ poster, previewSrc, videoSrc, captions }`, intro copy, projects[] `{ title, region, duration, href? , nda? }`.
- **ImageTrail** (`effects/image-trail`): pool of ~10 absolutely positioned `next/image`s (preloaded); spawn when pointer travelled > N px; new image on top at cursor, slight rotation in travel direction; GSAP timeline per image: scale-in → hold → fade/scale-out (~1s). Accent dot follows the cursor with easing. Touch: autoplay a slow scripted path. Reduced motion: a static 3-image collage.
- **Quote panel:** inverse surface, `display-md` quote, `<WaveField palette="dark">`, halftone, `data-header-theme="dark"`. Line-by-line reveal on enter.
- **Showreel tile:** muted looping preview video (lazy, `preload="none"`, plays only in viewport), `SHOWREEL` button that calls `openVideo('showreel')`. Give the tile a stable id for the shared-element transition in phase 07.
- **Latest delivery:** intro block + `Request a quote` (→ `openInquiry()`); horizontally scrollable project cards (drag-to-scroll on desktop with inertia, native swipe on touch, keyboard scrollable, edge fade masks). Cards: chips for region/duration, link icon (external) or "NDA" label.
- Section enter: panels rise with stagger.

## Acceptance criteria

- [x] Trail feels like ref 13 (images keep spawning along the path, fade cleanly, never pile up indefinitely).
- [x] Layout matches refs 12/15 at 1440; stacks into a single column at 375.
- [x] Preview video doesn't load until near the viewport; the row is fully keyboard accessible.
- [x] Reduced-motion and touch variants for the trail and wave glow.

## Prompt

```
Phase 06 · Work section. Read CLAUDE.md, docs/DESIGN_SPEC.md §5 "3 · Work", docs/phases/06-work.md,
and reference images 12, 13, 15, 08. Create branch phase/06-work, enter plan mode, propose a plan, wait for approval.
Build, verify in both themes at 375/768/1440 with reduced motion and touch emulation, follow CLAUDE.md §8, and stop.
```

## Decisions log

- Open-question defaults used: Q6 trail = generated PatternArt tiles in `.invisible` pool slots (swap `content/work.ts` images for real WebP later); Q7 no reel, so the tile shows art + "Reel coming soon" and the `<video>` path (lazy `src`, play only in viewport, poster-only under reduced motion) is wired but unexercised; Q8 four placeholder projects; Q4 placeholder quote.
- Trail pool = 10 recycled slots; verified ≤4 visible at once during a fast sweep. Tiles live in an `isolate` layer so their rising z-index never covers the accent dot.
- Reduced-motion trail collage is a static three-tile composition; touch autoplays a Lissajous path on the GSAP ticker, only while in viewport.
- Quote panel reuses `<Panel>` with inverse overrides; in dark theme the inverse surface is light (token behaviour), and the dark-palette glow is not yet tuned for it.
- Added `hooks/use-in-viewport.ts` (listed in CLAUDE.md §4 but missing).
- `PatternArt` inside a client component hydrated with different jitter values, so server-rendered art is passed as a prop (`fallback`) instead.
- Showreel tile id `showreel-tile` is the Phase 07 shared-element anchor; the button calls `openVideo("showreel")`.
- Bug found after first review: the trail never started on a fresh page load. A child's layout effect runs before the parent's ref is attached, so a parent-owned `targetRef` was still `null`; it only worked after hot reloads. `ImageTrail` now uses its own layer's `parentElement` as the pointer target. Lesson: never pass a parent ref into a child's mount effect.
- Tiles got a faint ring so they stay visible in dark theme.
- Reworked after the original build: Work is now one screen (reel band carrying the intro on top, one row of four tall project cards), and the image trail + quote moved to their own `#trail` section after it. The horizontal drag-scroll row (`delivery-row`, `use-drag-scroll`) was removed. Order is work → trail → CTA; merging trail with the CTA was considered and dropped. See DESIGN_SPEC §5 (3, 3b).
