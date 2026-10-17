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

- [x] No raw hex/px in any component; all values come from tokens.
- [x] Display headings render PP Frama with the single-storey `a` (ss01), body renders PP Neue Montreal, buttons render PP Supply Mono; side-by-side check against refs 05, 07, 10. No FOUT-induced layout shift.
- [x] `/styleguide` shows every token, type style, primitive state and PatternArt variant, correct in both themes, no flash on reload.
- [x] Text contrast is AA in both themes, including `muted-foreground` on `surface` and `background` (record ratios in the decisions log).
- [x] Focus ring visible on every interactive primitive in both themes.
- [x] `pnpm check` + `pnpm build` green.

## Prompt

```
Phase 01 · Design system. Read CLAUDE.md, docs/DESIGN_SPEC.md (§1–4 and §8), docs/OPEN_QUESTIONS.md,
docs/phases/01-design-system.md, and look at reference images 01, 04, 05, 07, 11, 15 in docs/reference/.
Create branch phase/01-design-system, enter plan mode, and propose a plan. Wait for approval.
Build, then verify on /styleguide in light and dark at 375/768/1440, follow CLAUDE.md §8, and stop.
```

## Decisions log

- **OPEN_QUESTIONS defaults used** (unanswered, logged per their stated default): Q2 accent `#FF3D71` light / `#FF5C88` dark; Q3 dark theme is neutral near-black with the same accent; Q15 English only. `OPEN_QUESTIONS.md` left untouched — these are defaults, not Foro's answers.
- **`--muted-foreground` AA fix.** The DESIGN_SPEC placeholder light value `#7A7A7A` measured **3.84:1** on `--background` (#F2F2F2) and **4.30:1** on `--surface` (#FFFFFF) — both fail the 4.5:1 AA text minimum (exactly what the spec's "check AA!" flag anticipated). Darkened to **`#6B6B6B`**: **4.76:1** on background, **5.25:1** on surface/surface-muted. Dark value `#9A9A9A` already passed (6.8:1 on background #0F0F10, 6.3:1 on surface #18181A) and is unchanged. DESIGN_SPEC.md §2 updated to match.
- **`--on-inverse` added.** Not in DESIGN_SPEC's token table; needed as explicit readable text for `--surface-inverse` (used by solid/primary buttons and the `Card variant="inverse"`). Light `#F2F2F2` on `#262626` → 13.5:1; dark `#0F0F10` on `#EDEDED` → 16.4:1.
- **`--accent-soft-1..3` dark values** aren't specified by DESIGN_SPEC at all (only light placeholders exist). Picked tuned-darker rose tones (`#7A2E3F` / `#5C2433` / `#3D1B24`) for dark-panel PatternArt/trail use — marked placeholder like their light counterparts, pending Foro's brand color.
- **Dropped shadcn's generic `accent`/`accent-foreground` hover token.** DESIGN_SPEC's `--accent` is the one saturated brand pink, reserved for intentional highlights (wave glow, dots, PatternArt) — not a blanket hover color (pink background with white/foreground text at this size fails AA, and the whole point of the palette is "near-monochrome + one deliberate accent"). The one existing usage (`SelectItem`'s focus state) now uses `bg-muted`/`text-foreground` instead.
- **Button `variant` renamed `default` → `solid`**, sizes renamed `default` → `md` (kept `sm`/`icon*`); added a `shape` variant (`default` = `rounded-input`, `pill` = `rounded-full`) since the reference uses both a small-radius header button and a full-pill CTA button. All variants now render mono/uppercase (DESIGN_SPEC: "utility text... is monospaced uppercase" applies to every button, not just the two primary ones).
- **Focus ring strengthened.** The DESIGN_SPEC-literal `ring-1 ring-ring/50` (1px, 50% opacity, no offset) was nearly invisible on solid buttons, where `--ring` (`--foreground`) sits close in tone to `--surface-inverse`. Switched every restyled primitive to `ring-2 ring-ring ring-offset-2 ring-offset-background` so the ring always sits outside the element on the page background, independent of the element's own color — verified visibly in both themes.
- **Pre-existing scaffold bug fixed:** `button.tsx`, `input.tsx` and `accordion.tsx` wrap Base UI primitives (`@base-ui/react/*`) but were missing `"use client"`. This never surfaced in Phase 00 (nothing rendered them), but broke the production build once `/styleguide` actually used them — Next tried to run Base UI's internal `createContext` calls in the RSC/server React build, which doesn't have it. Added the directive to all three.
- **`cn()` / tailwind-merge fix:** the DESIGN_SPEC type-scale utilities (`text-display-xl`, `text-mono-ui`, etc., each a single class bundling family/weight/size/line-height/tracking) were being silently dropped by `tailwind-merge` whenever a variant also set a `text-{color}` class — it grouped both under the same `text-*` conflict bucket and kept only the last one. Fixed by registering them as their own `font-type-scale` class group via `extendTailwindMerge` in `src/lib/cn.ts`.
- **Type specimen "ss01 vs without ss01" shows no visible difference** with the current dev font files (`src/fonts/README.md`: these are the reference site's own web builds). The single-storey `a` already renders by default; toggling the `ss01` feature via `font-feature-settings` produces no change, so the font file likely doesn't expose a distinct `ss01` glyph set under this build (the README separately notes the retail Pangram Pangram files will need `ss02`/`ss03` to match). DESIGN_SPEC's `ss01` wiring is still correct and kept as specified — to re-verify once the licensed fonts land at Phase 12.
- **Inputs/Select use `--surface-muted` fill, not a bordered/transparent field** — matches ref 01/04's filled gray form fields and DESIGN_SPEC §2's token table, which maps `--surface-muted` to "secondary cards, inputs" explicitly.
