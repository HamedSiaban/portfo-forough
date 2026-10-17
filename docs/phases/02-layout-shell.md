# Phase 02 · Layout shell

**Branch:** `phase/02-layout-shell` · **Spec:** DESIGN_SPEC §4–5 (Header, Footer) · **Refs:** 05, 11, 09

## Goal

The page skeleton: providers, smooth scroll, header, footer, reorderable section registry with placeholder sections, and UI store, so every later phase just fills a slot.

## Scope

- `providers/Providers.tsx`: Theme, TanStack Query (`lib/query-client.ts`, devtools in dev only), MotionPrefs context, SmoothScroll.
- `lib/gsap.ts`: register ScrollTrigger (and later plugins) once; export `gsap`.
- `SmoothScroll`: one Lenis instance driven by `gsap.ticker`, `ScrollTrigger.update` on scroll, disabled under reduced motion. Expose `scrollTo(target)` via context.
- `stores/ui-store.ts` (Zustand): `inquiryOpen`, `inquiryPrefill`, `openInquiry(prefill?)`, `closeInquiry()`, `videoOpen`, `activeVideo`, `openVideo(id)`, `closeVideo()`.
- `config/site.ts` (name, url, email, linkedin, location, timezone; placeholders from OPEN_QUESTIONS).
- `config/sections.ts`: ordered `{ id, label, Component }[]`; `page.tsx` maps over it inside `<main id="main-content">`. Create placeholder components for `hero`, `value-cards`, `work`, `interlude`, `pricing`, `faq`, `cta`, each a full-height block with its `id` and heading.
- Header (fixed, z above sections): Logo tile → `/` (site URL), `Pricing` → Lenis `scrollTo('#pricing')` with header offset, `Start a conversation` → `openInquiry()`, ThemeToggle. Collapses gracefully at 375px (buttons shrink; no hamburger needed unless it doesn't fit).
- Header legibility over dark panels: detect via a `data-header-theme="dark"` attribute on sections/panels and ScrollTrigger, and switch header button variants.
- Footer: Legals, Privacy (`next/link`), centred `mailto:` email, LinkedIn external link.
- Skip link. Placeholder `InquiryModal` / `VideoModal` mounts that read the store (just a Dialog saying "coming in phase 10/07").
- Hash links work with Lenis (`/#pricing` from `/legals` lands correctly).

## Acceptance criteria

- [x] Reordering entries in `config/sections.ts` reorders the page with no other change; anchors still work.
- [x] Pricing button smooth-scrolls to `#pricing`; under reduced motion it jumps.
- [x] Conversation button opens the placeholder modal from any scroll position; `Esc` closes it and focus returns.
- [x] Header stays legible over every section in both themes.
- [x] Keyboard: skip link → main; tab order header → sections → footer.
- [x] `pnpm check` + `pnpm build` green; a Playwright test covers the Pricing scroll and modal open.

## Prompt

```
Phase 02 · Layout shell. Read CLAUDE.md, docs/DESIGN_SPEC.md §4–5 (Header, Footer), docs/phases/02-layout-shell.md,
and reference images 05, 09, 11. Create branch phase/02-layout-shell, enter plan mode, propose a plan, wait for approval.
Build, verify in both themes at 375/768/1440 and with reduced motion, follow CLAUDE.md §8, and stop.
```

## Decisions log

- Added minimal stub pages at `/legals` and `/privacy` (heading + "coming in Phase 11", wrapped in `<main id="main-content">`) ahead of schedule. The "hash links work with Lenis (`/#pricing` from `/legals` lands correctly)" acceptance criterion is untestable without a routable `/legals` page, and the folders already existed as reserved routes (CLAUDE.md §1) with only `.gitkeep`. Phase 11 replaces the content; the routes themselves don't need to change.
- Kept Interlude as its own section/placeholder rather than folding it into Pricing, per the phase Scope's explicit component list. DESIGN_SPEC §5 floats the merge as an option — left as an open call for Phase 08/09.
- `data-header-theme="dark"` + per-element `ScrollTrigger`s are wired into `Header` exactly as scoped, but no placeholder section sets the attribute yet (none are dark/inverse in Phase 02), so the mechanism is unexercised until Phase 03 (Quote panel) or Phase 09 (CTA) add a real dark panel.
- Header's 375px collapse uses `flex-wrap` (Logo pinned top-left; Pricing/Start a conversation/ThemeToggle wrap onto a second line, right-aligned) rather than shrinking button text size. At 375px the full-text buttons ("PRICING" + "START A CONVERSATION" + theme toggle) need roughly 420px at any legible mono-ui size — shrinking text enough to fit in one row would drop below a readable/tappable size. Wrapping keeps both buttons at full size and legible, with no hamburger, which better matches the acceptance criterion's actual goal ("collapses gracefully... no hamburger") than the literal "buttons shrink" wording.
- `SmoothScrollProvider.scrollTo` calls `lenis.resize()` immediately before `lenis.scrollTo()`. Discovered via manual testing: Lenis caches the scrollable-height limit and doesn't recompute it synchronously after a client-side route change, so a `scrollTo` fired right after navigating from a short page (e.g. `/legals`) to `/#pricing` was silently clamped to the old, shorter page's scroll limit. `resize()` forces a resync first.
- The cross-page hash-landing effect (in `SmoothScrollProvider`) polls for the target element across animation frames (up to 60) instead of a single `requestAnimationFrame`, since the target section isn't guaranteed to exist in the DOM on the very first frame after a route change.
