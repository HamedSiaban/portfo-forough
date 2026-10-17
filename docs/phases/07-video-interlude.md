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

- [x] Open/close animation is smooth and reversible, works when the page is scrolled anywhere, and works on mobile.
- [x] Video doesn't download until the user opens it (preview excluded).
- [x] Full keyboard operation; captions available.
- [x] Interlude matches refs 08/10.

## Prompt

```
Phase 07 · Video modal + interlude. Read CLAUDE.md, docs/DESIGN_SPEC.md §6 Video and §5 Interlude,
docs/phases/07-video-interlude.md, and reference images 15, 08, 10. Create branch phase/07-video-interlude,
enter plan mode, propose the shared-element approach (Flip vs layoutId) and why, wait for approval.
Build, verify, follow CLAUDE.md §8, and stop.
```

## Decisions log

- **Shared element = plain GSAP on a dedicated fixed frame, not `layoutId` and not the Flip plugin.** The tile (server-rendered section) and the modal (root layout portal) are in different React trees, so `layoutId` can't bridge them, and it misprojects under the tile's GSAP transforms and Lenis scroll. The frame is placed on the tile's `getBoundingClientRect()` and tweened to the viewport; close re-measures the tile. The Flip plugin was planned but turned out unnecessary (nothing is reparented), so it isn't registered.
- Exception to "transform/opacity only" (CLAUDE.md §5.6): the frame tweens `width/height/border-radius` (one element, ~1s, runs only on open/close) so the video and radius aren't scaled/stretched.
- Close routes every dismissal (Esc, ×, outside) through the stage so it can fly back first; `videoOpen` flips false only after. Interrupting the open flight is fine: the close tween starts from the frame's current state.
- The tile is hidden with an inline `opacity` (not `visibility`) so focus can return to its button; restored in the stage's effect cleanup.
- Initial focus goes to the popup, not a control: focusing Close made Space dismiss the player. Shortcuts (Space, ←/→, M, C) are handled on the popup; Space/arrows still defer to focused buttons/range.
- Q7: no reel yet, so `videoSrc` is unset and the player shows PatternArt + "Reel coming soon" with disabled controls (open/close animation still runs). The player was verified with a temporary 12s VP9 clip + VTT (removed). The `<video>` only exists after open, so nothing downloads earlier.
- Added `--player`/`--on-player` tokens: the player is dark in both themes (`--surface-inverse` flips in dark mode). `SmoothScrollProvider` now exposes `setPaused` (Lenis stop/start) used while the player is open.
- Interlude stays its own section; its line masks have a small horizontal pad so the negative-tracked final glyph isn't clipped.
- Known, not from this phase: if the page is scrolled before hydration, the Work reveal can leave panels at opacity 0 until re-scrolled. Also a stale `next dev` (not watching CSS) hid new Tailwind classes; restart it if tokens look missing.
