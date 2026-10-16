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
- [ ] Matches refs 03/17 layout; readable at 375.
- [ ] Privacy policy lists exactly the data the inquiry form collects and the processors used.
- [ ] Footer links and the inquiry form's privacy link point here.

## Prompt
```
Phase 11 · Legal pages. Read CLAUDE.md, docs/DESIGN_SPEC.md §7, docs/OPEN_QUESTIONS.md Q11, docs/phases/11-legal.md,
and reference images 03 and 17. Create branch phase/11-legal, enter plan mode, propose a plan, wait for approval.
Build, verify, follow CLAUDE.md §8, and stop.
```

## Decisions log
-
