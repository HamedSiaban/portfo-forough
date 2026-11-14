# foroughforoughi.com

Portfolio of Foroughozaman (Foro) Foroughi, a senior product/UX designer. Next.js (App Router), Tailwind v4, GSAP + Lenis, three.js. Architecture and rules live in [`CLAUDE.md`](./CLAUDE.md).

## Run

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm check        # typecheck + lint + format + unit tests
pnpm build && pnpm start
pnpm test:e2e     # Playwright (chromium, webkit, mobile) incl. axe a11y
```

## Add content

All copy is typed data in `src/content/`. New case study: add a file in `src/content/case-studies/`, register it in `index.ts` (order = "next" order), and drop media in `public/media/work/<slug>/`. Site constants (email, socials, URL) are in `src/config/site.ts`.

## Reorder sections

Edit `src/config/sections.ts` only. Sections are self-contained and work in any position.

## Environment

Copy `.env.example` to `.env.local`. Analytics vars are optional and production-only. The contact modal is a link grid, so no email API keys are needed.

## Deploy

Netlify (`netlify.toml`). CI (`.github/workflows/ci.yml`) runs check, build and e2e on every PR.
