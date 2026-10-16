# Phase 12 · Polish & launch

**Branch:** `phase/12-polish-launch` · **Spec:** CLAUDE.md §7 budgets & a11y

## Goal
Production-ready: audited, fast, discoverable, tested, deployed.

## Scope
- **Font licence gate (blocking):** follow `src/fonts/README.md` "Before launch": licensed Pangram Pangram files replace the dev files, stylistic sets re-applied if the look changed, Latin subset, visual diff against the reference screenshots. Remove the ⚠️ notes from CLAUDE.md §2, DESIGN_SPEC §3 and the font README.
- **Choreography pass:** scroll the whole page top to bottom; tune transitions between sections (refs 02, 12, 08, 10, 07) so hand-offs feel continuous; `ScrollTrigger.refresh()` after fonts/images; test reordering sections.
- **Accessibility audit:** axe (Playwright `@axe-core/playwright`) on `/`, `/legals`, `/privacy`, each modal open; keyboard-only run; VoiceOver/NVDA spot check; contrast both themes.
- **Performance:** Lighthouse mobile ≥ 90 perf / 100 a11y / 100 best practices / 100 SEO; bundle analyzer; verify budgets in CLAUDE.md §7; image/video weights; preload hero font.
- **SEO/meta:** `metadata` (title template, description), `opengraph-image.tsx` (generated in brand style), `sitemap.ts`, `robots.ts`, Person JSON-LD, favicon/app icons from the logo.
- **Error pages:** `not-found.tsx`, `error.tsx` in brand style.
- **Analytics** per OPEN_QUESTIONS Q12 (privacy-friendly, matches privacy policy).
- **E2E:** Playwright smoke on chromium/webkit/mobile: load, theme toggle persists, pricing scroll, modals open/close, form happy path (mocked); visual screenshots at 375/1440 both themes.
- **CI:** GitHub Actions running `pnpm check`, `pnpm build`, Playwright.
- **Deploy:** Vercel project, env vars, domain `foroughforoughi.com`, preview deployments per PR.

## Acceptance criteria
- [ ] Every file in `src/fonts/` is a licensed Pangram Pangram file (licence receipts noted in the decisions log, not committed). Do not deploy until this is checked.
- [ ] All Lighthouse targets met on the production URL.
- [ ] Zero axe violations; full keyboard journey works.
- [ ] CI green on main; production deployed on the custom domain.
- [ ] README written (what it is, how to run, how to add content, how to reorder sections).

## Prompt
```
Phase 12 · Polish & launch. Read CLAUDE.md and docs/phases/12-polish-launch.md, and re-check every reference image
in docs/reference/ against the running site. Create branch phase/12-polish-launch, enter plan mode,
propose a prioritised plan, wait for approval. Work through it, verify, follow CLAUDE.md §8, and stop.
```

## Decisions log
-
