# Phase 00 · Scaffold & tooling

**Branch:** `phase/00-scaffold`

## Goal

A clean Next.js + TypeScript repo with every tool from CLAUDE.md §2 installed, configured and green, and no product UI yet.

## Scope

- Assumes `SETUP.md` steps 1–3 were run (create-next-app, deps installed, shadcn init). Verify, fill gaps, don't redo.
- `tsconfig`: `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `@/*` alias.
- ESLint flat config (`eslint.config.mjs`): next core-web-vitals + typescript, `@tanstack/eslint-plugin-query`, `eslint-plugin-better-tailwindcss` (point it at `src/app/globals.css`), `simple-import-sort`, `eslint-config-prettier` last.
- Prettier (`.prettierrc`) with `prettier-plugin-tailwindcss` (`tailwindStylesheet: ./src/app/globals.css`), `.prettierignore`.
- `.editorconfig`, `.nvmrc` (current Node LTS), `engines` + `packageManager` in `package.json`.
- Husky + lint-staged (eslint --fix, prettier) + commitlint (`@commitlint/config-conventional`).
- Vitest + Testing Library + jsdom (`vitest.config.ts`, setup file, one sample test). Playwright config + one smoke test (home returns 200).
- All scripts from CLAUDE.md §3, including `check`.
- Empty folder skeleton from CLAUDE.md §4 (with `.gitkeep` where empty). `src/lib/cn.ts`.
- `.env.example`, `.gitignore` (add `graphify-out/`, `.env*.local`, `playwright-report/`, `test-results/`).
- `.vscode/settings.json` + `extensions.json` (ESLint, Prettier, Tailwind IntelliSense, format on save).
- Replace the create-next-app demo page with a minimal placeholder.

## Out of scope

Design tokens, fonts, any UI.

## Acceptance criteria

- [x] `pnpm check` and `pnpm build` pass.
- [x] A commit with a bad message is rejected by commitlint; staged files are auto-fixed by lint-staged.
- [x] Prettier sorts Tailwind classes; ESLint flags unsorted imports and an invalid Tailwind class.
- [x] `pnpm test` and `pnpm test:e2e` each run one passing test.
- [x] Every installed package and its version is reflected in CLAUDE.md §2 (add a "Pinned versions" note if useful).

## Prompt

```
We're starting Phase 00 of the portfolio project.
Read CLAUDE.md fully, then docs/ROADMAP.md and docs/phases/00-scaffold.md.
Create branch phase/00-scaffold. Enter plan mode, inspect what SETUP.md already installed,
and propose a plan covering every Scope item. Wait for my approval before writing files.
When done, verify against the acceptance criteria, follow CLAUDE.md §8 "Close the loop", and stop.
```

## Decisions log

- `shadcn init` (SETUP.md step 3) installed Base UI (`@base-ui/react`, style `base-lyra`) + Phosphor icons instead of the Radix + lucide-react CLAUDE.md §2 named at the time. Decided to adopt Base UI + Phosphor (shadcn's current default, Radix's successor, least churn) rather than re-init — updated CLAUDE.md §2 accordingly and dropped the unused `lucide-react` dependency.
- The generated `src/components/ui/*` files import `cn` from a bare `cn` npm package rather than the project's own helper. Removed that package, implemented the canonical `cn()` (clsx + tailwind-merge) in `src/lib/cn.ts`, re-exported it from `src/lib/utils.ts` for shadcn's `@/lib/utils` alias, and repointed all `ui/` imports to `@/lib/cn`. Note for later phases: a future `pnpm dlx shadcn add` may regenerate a component importing from `"cn"` again — repoint it the same way.
- `eslint-plugin-better-tailwindcss`'s `enforce-consistent-line-wrapping` rule fights Prettier's own wrapping (each tool's autofix undoes the other's). Disabled that one rule in `eslint.config.mjs` and let Prettier own line length/wrapping; kept the plugin's other rules (class order, dedup, unknown/conflicting-class detection).
