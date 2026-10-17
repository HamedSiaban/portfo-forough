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

- [ ] Trail feels like ref 13 (images keep spawning along the path, fade cleanly, never pile up indefinitely).
- [ ] Layout matches refs 12/15 at 1440; stacks into a single column at 375.
- [ ] Preview video doesn't load until near the viewport; the row is fully keyboard accessible.
- [ ] Reduced-motion and touch variants for the trail and wave glow.

## Prompt

```
Phase 06 · Work section. Read CLAUDE.md, docs/DESIGN_SPEC.md §5 "3 · Work", docs/phases/06-work.md,
and reference images 12, 13, 15, 08. Create branch phase/06-work, enter plan mode, propose a plan, wait for approval.
Build, verify in both themes at 375/768/1440 with reduced motion and touch emulation, follow CLAUDE.md §8, and stop.
```

## Decisions log

-
