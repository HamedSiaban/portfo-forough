# Phase 12 · Polish & launch

**Branch:** `phase/12-polish-launch` · **Spec:** CLAUDE.md §7 budgets & a11y

## Goal

Production-ready: audited, fast, discoverable, tested, deployed.

## Scope

- **Fonts:** Latin subset the six files if size matters. Licensing is handled by the owner outside this repo (decision: no gate).
- **Choreography pass:** scroll the whole page top to bottom; tune transitions between sections (refs 02, 12, 08, 10, 07) so hand-offs feel continuous; `ScrollTrigger.refresh()` after fonts/images; test reordering sections.
- **Accessibility audit:** axe (Playwright `@axe-core/playwright`) on `/`, `/privacy`, `/work/*`, each modal open; keyboard-only run; VoiceOver/NVDA spot check; contrast both themes.
- **Performance:** Lighthouse mobile ≥ 90 perf / 100 a11y / 100 best practices / 100 SEO; bundle analyzer; verify budgets in CLAUDE.md §7; image/video weights; preload hero font.
- **SEO/meta:** `metadata` (title template, description), `opengraph-image.tsx` (generated in brand style), `sitemap.ts`, `robots.ts`, Person JSON-LD, favicon/app icons from the logo.
- **Error pages:** `not-found.tsx`, `error.tsx` in brand style.
- **Analytics:** `components/analytics.tsx` is built (Umami + Microsoft Clarity, env-gated, production only). Remaining: create the Umami site and Clarity project, set the three `NEXT_PUBLIC_*` vars in Netlify, Clarity consent banner is built (`components/consent/`): Clarity loads only after Accept; footer "Cookie settings" re-opens it.
- **E2E:** Playwright smoke on chromium/webkit/mobile: load, theme toggle persists, modals open/close, form happy path (mocked); visual screenshots at 375/1440 both themes.
- **CI:** GitHub Actions running `pnpm check`, `pnpm build`, Playwright.
- **Deploy:** Netlify site (`netlify.toml`), env vars (`RESEND_*`, `INQUIRY_*`, analytics), domain `foroughforoughi.com`, preview deployments per PR.

## Acceptance criteria

- [ ] All Lighthouse targets met on the production URL.
- [x] Zero axe (local, both themes, chromium + mobile) violations; full keyboard journey works.
- [ ] CI green on main; production deployed on the custom domain.
- [x] README written (what it is, how to run, how to add content, how to reorder sections).

## Prompt

```
Phase 12 · Polish & launch. Read CLAUDE.md and docs/phases/12-polish-launch.md, and re-check every reference image
in docs/reference/ against the running site. Create branch phase/12-polish-launch, enter plan mode,
propose a prioritised plan, wait for approval. Work through it, verify, follow CLAUDE.md §8, and stop.
```

## Decisions log

- Header CTA shows "Contact" below `sm` (one row at 375px); accessible name follows the visible label.
- `--subtle-foreground` darkened in both themes (was 2.05:1 / 2.65:1) because it is used for text; axe caught it in the contact modal.
- OG image uses raw colours and the default font: `ImageResponse` (satori) can't use the woff2 files and runs outside the token layer.
- `/legals` no longer exists; audit covers `/privacy` and the case studies.
- Playwright: chromium + webkit + Pixel 7 projects; CI runs against `pnpm start`. Webkit can't launch on the dev machine (missing system libs), so it is verified in CI only.
- **Owner follow-ups (not doable from the repo):** Lighthouse on the production URL, Netlify site + domain, Umami/Clarity IDs, screen-reader spot check, confirm Calendly/LinkedIn placeholders in `config/site.ts`, enable CI remote.
