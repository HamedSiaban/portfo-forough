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
- [ ] Reordering entries in `config/sections.ts` reorders the page with no other change; anchors still work.
- [ ] Pricing button smooth-scrolls to `#pricing`; under reduced motion it jumps.
- [ ] Conversation button opens the placeholder modal from any scroll position; `Esc` closes it and focus returns.
- [ ] Header stays legible over every section in both themes.
- [ ] Keyboard: skip link → main; tab order header → sections → footer.
- [ ] `pnpm check` + `pnpm build` green; a Playwright test covers the Pricing scroll and modal open.

## Prompt
```
Phase 02 · Layout shell. Read CLAUDE.md, docs/DESIGN_SPEC.md §4–5 (Header, Footer), docs/phases/02-layout-shell.md,
and reference images 05, 09, 11. Create branch phase/02-layout-shell, enter plan mode, propose a plan, wait for approval.
Build, verify in both themes at 375/768/1440 and with reduced motion, follow CLAUDE.md §8, and stop.
```

## Decisions log
-
