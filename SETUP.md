# Setup — run once, in order

Prereqs: Node LTS, pnpm (`corepack enable`), Git, Claude Code, graphify (already installed).

## 1 · Create the Next.js app

```bash
pnpm create next-app@latest foroughforoughi --ts --tailwind --eslint --app --src-dir --turbopack --import-alias "@/*" --use-pnpm --yes
cd foroughforoughi
```

## 2 · Drop this kit into the repo

Unzip the kit next to the project, then copy its contents (CLAUDE.md, SETUP.md, docs/, src/fonts/) into the project root. `src/fonts/` merges into the `src/` folder create-next-app made.

macOS / Linux / Git Bash:

```bash
cp -R ../foro-portfolio-kit/. .
```

Windows PowerShell:

```powershell
Copy-Item -Recurse -Force ..\foro-portfolio-kit\* .
```

## 3 · Install dependencies

```bash
pnpm add @tanstack/react-query @tanstack/react-query-devtools zustand next-themes gsap @gsap/react lenis motion three react-hook-form zod @hookform/resolvers clsx tailwind-merge class-variance-authority lucide-react resend

pnpm add -D @types/three @tanstack/eslint-plugin-query prettier prettier-plugin-tailwindcss eslint-config-prettier eslint-plugin-simple-import-sort eslint-plugin-better-tailwindcss husky lint-staged @commitlint/cli @commitlint/config-conventional vitest @vitejs/plugin-react vite-tsconfig-paths jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom @testing-library/user-event @playwright/test @axe-core/playwright

pnpm dlx shadcn@latest init
pnpm dlx shadcn@latest add button input textarea select label accordion tabs dialog sonner popover calendar

pnpm exec husky init
pnpm exec playwright install
```

(Phase 00 wires up the configs for all of these. You only install here.)

## 4 · First commit

```bash
echo "graphify-out/" >> .gitignore
git add -A
git commit -m "chore: scaffold next app and add project docs"
```

## 5 · graphify

In the project root, in your terminal:

```bash
graphify claude install    # adds the graphify section to CLAUDE.md + a PreToolUse hook
graphify hook install      # rebuilds the graph after every commit
```

Then start Claude Code (`claude`) in the project root and run:

```
/graphify .
```

After each phase (if the hook hasn't already done it):

```
/graphify . --update
```

## 6 · Build, one phase at a time

In Claude Code, paste the **Prompt** block from `docs/phases/00-scaffold.md`. Approve the plan, review, merge, then move to the next phase in `docs/ROADMAP.md`.

Before Phase 01, answer what you can in `docs/OPEN_QUESTIONS.md` (accent colour, dark-theme mood and copy matter most).
