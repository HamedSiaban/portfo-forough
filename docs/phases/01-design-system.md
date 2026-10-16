# Phase 01 · Design system

**Branch:** `phase/01-design-system` · **Spec:** DESIGN_SPEC §1–4, §8 · **Refs:** 01, 04, 05, 07, 11, 15

## Goal

Every token, type style and primitive the sections need, in light and dark, viewable on a dev-only `/styleguide` page.

## Scope

- Check `OPEN_QUESTIONS.md` Q2, Q3, Q15 first; use defaults if unanswered and log them.
- `globals.css`: CSS variables for all DESIGN_SPEC §2 tokens in `:root` and `.dark`, mapped into Tailwind v4 `@theme` (colors, radii, fonts, type scale as utilities, e.g. `text-display-xl`). Motion easing as CSS vars too.
- Fonts: use the existing `src/fonts/index.ts` (don't change files or weights). Apply `fontVariables` on `<html>`; map `--font-display` / `--font-sans` / `--font-mono` and `--font-weight-book` in `@theme inline`, with `"ss01"` on display only (DESIGN_SPEC §3). Each type style in DESIGN_SPEC §3 becomes a utility that sets family, weight, size, line height and tracking together.
- Add a `/styleguide` type specimen that shows Frama with and without `ss01`, so the difference is visible.
- `next-themes` provider (`attribute="class"`, `defaultTheme="system"`, `disableTransitionOnChange`), no flash.
- `ThemeToggle`: segmented sun/moon pill (keyboard-accessible, `aria-pressed`, hydration-safe).
- shadcn components restyled to tokens via variants: Button (`solid` / `outline` mono uppercase sizes `sm`/`md`, `pill`), Input, Textarea, Select, Label, Accordion, Tabs (segmented pill), Dialog, Sonner.
- Custom primitives: `StepRow` (number badge · hairline · label; `active`/`disabled`), `Chip`, `Panel` (framed, radius `panel`, slot for a background effect), `Card` (surface / muted / inverse), `Halftone` (static CSS/SVG dot pattern, tokenised density and colour).
- `PatternArt` (SVG): `steps`, `circles`, `diamond`, `snake` variants, palette from `--accent-soft-*`, deterministic seed.
- `useReducedMotion`, `useMediaQuery`, `useIsTouch` hooks.
- `/styleguide` route (excluded from production via `notFound()` when `NODE_ENV === "production"`).

## Out of scope

Header/footer, sections, WebGL.

## Acceptance criteria

- [ ] No raw hex/px in any component; all values come from tokens.
- [ ] Display headings render PP Frama with the single-storey `a` (ss01), body renders PP Neue Montreal, buttons render PP Supply Mono; side-by-side check against refs 05, 07, 10. No FOUT-induced layout shift.
- [ ] `/styleguide` shows every token, type style, primitive state and PatternArt variant, correct in both themes, no flash on reload.
- [ ] Text contrast is AA in both themes, including `muted-foreground` on `surface` and `background` (record ratios in the decisions log).
- [ ] Focus ring visible on every interactive primitive in both themes.
- [ ] `pnpm check` + `pnpm build` green.

## Prompt

```
Phase 01 · Design system. Read CLAUDE.md, docs/DESIGN_SPEC.md (§1–4 and §8), docs/OPEN_QUESTIONS.md,
docs/phases/01-design-system.md, and look at reference images 01, 04, 05, 07, 11, 15 in docs/reference/.
Create branch phase/01-design-system, enter plan mode, and propose a plan. Wait for approval.
Build, then verify on /styleguide in light and dark at 375/768/1440, follow CLAUDE.md §8, and stop.
```

## Decisions log

-
