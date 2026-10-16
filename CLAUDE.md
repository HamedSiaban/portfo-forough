# CLAUDE.md — foroughforoughi.com

> The source of truth for how this project is built. Read it fully before every task.
> If a decision changes, update this file in the same commit. Never let code and this file disagree.

---

## 1. Project

A portfolio site for **Foroughozaman (Foro) Foroughi**, a senior product/UX designer. Its job is to *prove* UI/UX craft through design, motion and interaction, and to convert visitors through the **project inquiry modal**.

- **Routes:** `/` (single page), `/legals`, `/privacy`
- **Page anatomy:** Header → 6 sections → Footer, plus two modals (Inquiry, Video)
- **Interaction reference:** incredibles.dev. Screenshots live in `docs/reference/` (index in `docs/reference/README.md`).
  We reproduce **patterns and feel only**. We never copy its copy, logos, imagery or client names. All content is Foro's own.
  We do use the same type families (PP Frama, PP Neue Montreal, PP Supply Mono). They must be properly licensed before production (§9, `src/fonts/README.md`).
- **Priorities, in order:** visual quality & motion feel → performance → accessibility → code elegance. None of them is optional.

Related docs:
| File | Purpose |
|---|---|
| `docs/ROADMAP.md` | Phases, status, branch names |
| `docs/phases/NN-*.md` | Spec + acceptance criteria + Claude Code prompt per phase |
| `docs/DESIGN_SPEC.md` | Tokens, typography, section-by-section visual & motion spec |
| `docs/OPEN_QUESTIONS.md` | Unresolved decisions. Check before building anything they touch |

---

## 2. Tech stack

Install the **latest stable** version of each package at the time of Phase 0 and pin it in `package.json`. Do not downgrade without recording why here.

| Concern | Choice | Notes |
|---|---|---|
| Framework | **Next.js** (App Router, RSC by default) + React 19 | Turbopack dev |
| Language | **TypeScript**, `strict` + `noUncheckedIndexedAccess` + `noImplicitOverride` | No `any` |
| Styling | **Tailwind CSS v4** (CSS-first `@theme` tokens in `globals.css`) | `cn()` = `clsx` + `tailwind-merge`; variants via `class-variance-authority` |
| UI primitives | **shadcn/ui** (Radix) | Dialog, Accordion, Tabs, Select, Input, Textarea, Label, Button, Form/Field, Sonner |
| Fonts | **PP Frama** (display, `ss01`), **PP Neue Montreal** (sans), **PP Supply Mono** (mono) via `next/font/local` | Config in `src/fonts/index.ts`; roles in DESIGN_SPEC §3. ⚠️ Dev files until licensed |
| Theme | **next-themes** | `class` strategy, default `system`, no flash |
| Server state | **TanStack Query v5** | Inquiry submit (mutation), pricing estimate, future CMS data |
| Local state | **Zustand** for cross-tree UI state; **React Context** only for scoped providers | See §6 |
| Forms | **react-hook-form** + **zod** + `@hookform/resolvers` | Schemas shared client/server in `src/lib/schemas` |
| Scroll & timeline motion | **GSAP 3** + ScrollTrigger (+ Flip/SplitText when needed) via `@gsap/react` (`useGSAP`) | GSAP and all its plugins are free |
| Smooth scroll | **Lenis**, driven by the GSAP ticker | One instance, in `SmoothScroll` provider |
| Component enter/exit | **Motion** (`motion/react`) | Modals, accordion content, tabs, presence |
| WebGL | **three.js** (vanilla, client-only, dynamically imported) | Ink fluid field |
| 2D canvas | Native Canvas 2D | Card cascade ("solitaire") |
| Email | **Resend** (pending, see OPEN_QUESTIONS) | Called from a Route Handler |
| Icons | lucide-react | |
| Package manager | **pnpm** | Never commit other lockfiles |
| Lint/format | ESLint flat config (`next/core-web-vitals` + `next/typescript`, `@tanstack/eslint-plugin-query`, `eslint-plugin-better-tailwindcss`, `simple-import-sort`, `eslint-config-prettier`) + **Prettier** with `prettier-plugin-tailwindcss` | |
| Git hooks | Husky + lint-staged + commitlint (Conventional Commits) | |
| Tests | **Vitest** + Testing Library (unit/component), **Playwright** (e2e smoke + screenshots) | |
| Hosting | Vercel (pending) | |
| Knowledge graph | **graphify** | See §10 |

### Motion ownership rule (important)
- **GSAP** owns anything scroll-linked, pinned, or timeline-choreographed, plus canvas/WebGL loops via `gsap.ticker`.
- **Motion** owns React mount/unmount and layout transitions (modals, accordion bodies, tab panels, toasts).
- **Never animate the same element with both libraries.** CSS transitions are fine for simple hover/focus states.

---

## 3. Commands

```bash
pnpm dev            # dev server
pnpm build          # production build
pnpm start          # serve production build
pnpm typecheck      # tsc --noEmit
pnpm lint           # eslint .
pnpm lint:fix
pnpm format         # prettier --write .
pnpm format:check
pnpm test           # vitest run
pnpm test:e2e       # playwright test
pnpm check          # typecheck + lint + format:check + test  ← must pass before any phase is "done"
```

---

## 4. Folder structure

```
src/
  app/
    layout.tsx            # fonts, <Providers>, metadata
    page.tsx              # renders sections from config/sections.ts
    globals.css           # Tailwind v4 + @theme tokens (light/dark)
    legals/page.tsx
    privacy/page.tsx
    api/inquiry/route.ts  # POST, zod-validated, rate-limited
    sitemap.ts  robots.ts  opengraph-image.tsx
  components/
    ui/                   # shadcn-generated. Change via variants, not ad-hoc edits
    layout/               # Header, Footer, ThemeToggle, Logo
    sections/             # hero/ value-cards/ work/ pricing/ faq/ cta/  (one folder each)
    modals/               # InquiryModal, VideoModal
    effects/              # InkField (WebGL), Halftone, ImageTrail, CardCascade, PatternArt
    motion/               # SmoothScroll, Reveal primitives
  fonts/                  # woff2 files + index.ts (next/font/local) + README.md (licence status)
  config/
    sections.ts           # ordered section registry. Reorder sections HERE ONLY
    site.ts               # name, url, email, socials, timezone
  content/                # all copy & data, typed (hero.ts, cards.ts, projects.ts, faq.ts, pricing.ts, legal/*.mdx|ts)
  hooks/                  # useReducedMotion, usePointer, useMediaQuery, useIsTouch, useInViewport
  lib/                    # cn.ts, gsap.ts (plugin registration, once), query-client.ts, schemas/, email.ts
  providers/              # Providers.tsx (Theme, Query, MotionPrefs, SmoothScroll)
  stores/                 # ui-store.ts (zustand)
  types/
public/
  media/trail/            # images for the cursor image trail
  media/work/             # project thumbnails, video posters
  video/
docs/                     # reference/, phases/, ROADMAP.md, DESIGN_SPEC.md, OPEN_QUESTIONS.md
```

---

## 5. Architecture rules

1. **Server Components by default.** `"use client"` only on the smallest interactive leaf. Effects touching `window`, WebGL or canvas are client-only and loaded with `next/dynamic` (`ssr: false`) behind a static fallback.
2. **Sections are self-contained and reorderable.** `page.tsx` maps over `config/sections.ts` (`{ id, label, Component }`). A section:
   - owns its own animations and cleans them up;
   - never measures or references a neighbouring section, and never hard-codes scroll offsets;
   - exposes its anchor via `id` (e.g. `#pricing`);
   - must look correct in any position in the list.
3. **Content is never hard-coded in components.** It lives in `src/content/` with exported types.
4. **Design tokens only.** No raw hex/px values in components. Use Tailwind theme tokens backed by CSS variables (see DESIGN_SPEC §2). Dynamic values go through CSS custom properties, not inline style objects.
5. **One shared ink engine.** Hero, quote panel and CTA panel all use `<InkField />` with props (palette, intensity, halftone). Never fork it per section.
6. **GSAP hygiene:** register plugins once in `lib/gsap.ts`; always `useGSAP({ scope })` so contexts revert on unmount; animate `transform`/`opacity` only; call `ScrollTrigger.refresh()` after fonts load and after section order changes; no scroll listeners outside Lenis/ScrollTrigger.
7. **Reduced motion is a first-class mode**, not an afterthought. `useReducedMotion()` gates every effect: static halftone instead of fluid, no image trail, cards appear without 3D flight, cascade replaced by a static composition, Lenis disabled.
8. **Touch devices get designed alternatives**, not broken hover effects: ink reacts to touch and drifts on its own; the image trail auto-plays a slow sequence; the card stack still works with native scroll.

---

## 6. State management

| Kind | Tool | Examples |
|---|---|---|
| Async / server data | TanStack Query | `useSubmitInquiry` (mutation), `usePriceEstimate` |
| Cross-tree UI state | Zustand (`stores/ui-store.ts`) | `inquiryOpen`, `openInquiry(prefill?)`, `videoOpen`, `activeVideo` |
| Scoped, tree-local | React Context | `MotionPrefsContext`, `SectionRegistryContext` |
| Form state | react-hook-form | inquiry form, pricing calculator |
| Theme | next-themes | Don't duplicate in Zustand or localStorage |

Rules: never store server data in Zustand. Use selectors (`useUiStore(s => s.inquiryOpen)`), never subscribe to the whole store. No `useEffect` for derived state.

---

## 7. Coding standards

- Named exports. One component per file. File names `kebab-case.tsx`, components `PascalCase`.
- Props typed with `type`, not `interface`, unless extending. Explicit return types on everything in `lib/`.
- No default `any`, no non-null `!` without a comment explaining why it's safe.
- No inline `eslint-disable` without a one-line reason.
- Imports via `@/…`. Sorted by `simple-import-sort`.
- Comments explain *why*, not *what*. Every effect component gets a short header comment describing the technique.
- Don't add a dependency without adding it to §2 in the same commit.

### Accessibility (WCAG 2.2 AA)
Semantic landmarks (`header`, `main`, `footer`, `section` + heading), skip link, visible `:focus-visible` ring in both themes, AA contrast in both themes (including muted/disabled text), every interactive element keyboard-operable, dialogs via Radix (focus trap, `Esc`, return focus), decorative canvases `aria-hidden` + `role="presentation"`, the video has captions or a transcript, form errors announced (`aria-describedby`, `aria-invalid`).

### Performance budgets (mid-tier mobile, production build)
LCP < 2.5s · CLS < 0.05 · INP < 200ms · first-load JS for `/` ≤ ~200 KB gz excluding lazily loaded three.js · WebGL DPR capped at 1.5, render loop paused when off-screen or tab hidden · images via `next/image` (AVIF/WebP, explicit sizes) · video lazy with poster · fonts via `next/font/local` from `src/fonts/` with `display: swap`; only use the six weights listed there, and subset to Latin before launch.

---

## 8. Workflow protocol (every phase)

1. **One phase = one branch = one PR.** Branch name from `docs/ROADMAP.md` (e.g. `phase/03-ink-field`).
2. **Plan first.** Enter plan mode. Read this file, the phase doc, the relevant DESIGN_SPEC section and every reference image the phase lists. Propose a plan (files to add/change, techniques, risks). Wait for approval.
3. **Build in small Conventional Commits** (`feat:`, `fix:`, `refactor:`, `perf:`, `style:`, `test:`, `docs:`, `chore:`), scoped by area, e.g. `feat(hero): add ink field`.
4. **Verify before saying done:**
   - `pnpm check` passes, and `pnpm build` succeeds;
   - each acceptance criterion in the phase doc is checked off;
   - visual phases: run the dev server and compare against the reference screenshots in **light and dark**, at **375 / 768 / 1440 px**, with and without `prefers-reduced-motion`.
5. **Close the loop:** tick the phase in `ROADMAP.md`, write deviations in the phase doc's *Decisions log*, update this file if any standard changed, refresh the graph (§10).
6. **Stop.** Don't start the next phase until asked.

### Definition of Done
Acceptance criteria met · `pnpm check` + `pnpm build` green · both themes correct · reduced-motion and touch variants work · no console errors/warnings · no layout shift from the feature · docs updated.

---

## 9. Never

- Copy text, images, logos or client names from the reference site.
- Deploy to production with the current font files in `src/fonts/`. They're the reference site's builds, for development only. Replace them with licensed Pangram Pangram files first (`src/fonts/README.md`).
- Load fonts any other way (Google Fonts, `<link>`, CSS `@import`) or add font weights beyond those in `src/fonts/index.ts`.
- Hard-code copy in components, or raw colors/sizes outside the token layer.
- Animate an element with both GSAP and Motion.
- Ship an effect without a reduced-motion and a touch variant.
- Leave a `requestAnimationFrame` loop or ScrollTrigger alive after unmount.
- Commit secrets. Env vars go in `.env.local` (git-ignored) and are documented in `.env.example`.

---

## 10. Knowledge graph (graphify)

- The graph lives in `graphify-out/` (git-ignored). Read `graphify-out/GRAPH_REPORT.md` before broad codebase searches.
- After a phase, refresh with `/graphify . --update` (the post-commit hook also rebuilds it).
- `graphify claude install` appends its own section below. Keep it, and don't edit it by hand.
