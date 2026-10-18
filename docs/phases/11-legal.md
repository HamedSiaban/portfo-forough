# Phase 11 · Legal & privacy pages

**Branch:** `phase/11-legal` · **Spec:** DESIGN_SPEC §7 · **Refs:** 03, 17

## Goal

`/legals` and `/privacy` in the site's visual language, with Foro's own content.

## Scope

- Shared `LegalLayout`: small title card + large content card, prose styles (tokenised typography plugin or custom prose classes), comfortable measure, anchor ids on headings.
- Content in `src/content/legal/` (MDX via `@next/mdx`, or typed TS blocks; decide in the plan). Fill from OPEN_QUESTIONS Q11 or use a clearly marked template with `TODO`. **Never adapt the reference site's legal text.** Privacy content must match what the site actually does (form fields, Resend, analytics choice, hosting).
- Per-page metadata; header Pricing button on these pages links to `/#pricing`.
- Subtle entrance animation only.

## Acceptance criteria

- [x] Matches refs 03/17 layout; readable at 375.
- [x] Privacy policy lists exactly the data the inquiry form collects and the processors used.
- [x] Footer links and the inquiry form's privacy link point here.

## Prompt

```
Phase 11 · Legal pages. Read CLAUDE.md, docs/DESIGN_SPEC.md §7, docs/OPEN_QUESTIONS.md Q11, docs/phases/11-legal.md,
and reference images 03 and 17. Create branch phase/11-legal, enter plan mode, propose a plan, wait for approval.
Build, verify, follow CLAUDE.md §8, and stop.
```

## Decisions log

- Content is typed TS (`src/content/legal/`), not MDX: no new dependency, consistent with the other content files. Inline tokens `{email}`, `{privacy}`, `{legals}` become links in `LegalLayout`.
- Q11 is unanswered, so registration details, hosting region and retention period are visible `TODO` markers. Vercel + Vercel Analytics are the Q12 defaults and also flagged `TODO`. All must be resolved before the Phase 12 launch gate.
- The privacy field list is derived from `content/inquiry.ts`, and a test fails if a form field is missing from the policy.
- Entrance reuses the CSS-only `animate-hero-fade` utility (off under reduced motion); no JS animation.
- Observed, not changed: at 375px the header wraps onto two rows (Phase 02 layout). Left for Phase 12 polish.
