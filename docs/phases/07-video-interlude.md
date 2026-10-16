# Phase 07 · Video modal + Interlude

**Branch:** `phase/07-video-interlude` · **Spec:** DESIGN_SPEC §6 "Video", §5 "Interlude" · **Refs:** 15, 08, 10

## Goal
The showreel expands from its tile into a full-screen player with a cinematic shared-element animation; plus the "Let's talk about your project." interlude.

## Scope
- `modals/video-modal`: Radix Dialog for a11y (focus trap, `Esc`, return focus) + shared-element expansion. Choose **GSAP Flip** (tile → fullscreen frame) or **Motion `layoutId`**, but only one library per element (CLAUDE.md motion rule). Sequence: tile lifts → expands to the viewport with rounded corners easing to ~1rem → backdrop darkens → controls fade in → video plays with sound. Close reverses to the tile.
- Custom minimal controls: play/pause, scrub bar, time, mute, captions toggle, close. Keyboard: Space, ←/→ seek, M mute, C captions.
- Pause Lenis while open; restore scroll position.
- Reduced motion: plain crossfade.
- Interlude section (`sections/interlude`): `display-xl` statement from content, masked line-rise reveal on enter. Registered in `config/sections.ts`.

## Acceptance criteria
- [ ] Open/close animation is smooth and reversible, works when the page is scrolled anywhere, and works on mobile.
- [ ] Video doesn't download until the user opens it (preview excluded).
- [ ] Full keyboard operation; captions available.
- [ ] Interlude matches refs 08/10.

## Prompt
```
Phase 07 · Video modal + interlude. Read CLAUDE.md, docs/DESIGN_SPEC.md §6 Video and §5 Interlude,
docs/phases/07-video-interlude.md, and reference images 15, 08, 10. Create branch phase/07-video-interlude,
enter plan mode, propose the shared-element approach (Flip vs layoutId) and why, wait for approval.
Build, verify, follow CLAUDE.md §8, and stop.
```

## Decisions log
-
