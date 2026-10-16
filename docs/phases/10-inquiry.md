# Phase 10 · Inquiry modal + API

**Branch:** `phase/10-inquiry` · **Spec:** DESIGN_SPEC §6 "Inquiry" · **Refs:** 01

## Goal
The conversion point: a beautiful, accessible multi-step inquiry form that actually delivers submissions.

## Scope
- `lib/schemas/inquiry.ts` (zod, shared client/server): name*, email*, company, website (URL), budget* (enum from content), startDate, launchDate (≥ start), message, plan? (from pricing prefill), honeypot field.
- `modals/inquiry-modal`: Radix Dialog; layout per ref 01 (title card + info card left; form card right). Info card copy, email, WhatsApp, location/timezone from `config/site.ts`.
- react-hook-form; `StepRow` groups; groups 2–4 dimmed until group 1 is valid (still focusable? decide: keep focusable, visually dimmed, to avoid trapping keyboard users; log it).
- Date inputs: shadcn Popover + Calendar or native `type="date"` (decide for mobile UX).
- Motion: backdrop fade, cards rise with stagger; success state replaces the form in place (animated check + message + close); error state inline with retry.
- Close guard: confirm dialog if the form is dirty.
- Prefill from `openInquiry(prefill)` (e.g. plan from pricing).
- `app/api/inquiry/route.ts`: POST, zod parse, honeypot reject, simple rate limit (in-memory per IP for now; note Upstash for production), send via Resend (`RESEND_API_KEY`, `INQUIRY_TO_EMAIL` in `.env.example`); reply-to = submitter. Returns typed result.
- `useSubmitInquiry` (TanStack mutation).

## Acceptance criteria
- [ ] Matches ref 01 at 1440; single column, scrollable, full-height sheet at 375.
- [ ] Validation errors are announced; Send disabled until valid; double submit impossible.
- [ ] Opening from header, Request a quote, FAQ link, pricing plan and CTA all work; prefill works.
- [ ] API rejects invalid payloads (unit tests) and works end-to-end with a test key; Playwright covers the happy path with the API mocked.

## Prompt
```
Phase 10 · Inquiry modal + API. Read CLAUDE.md, docs/DESIGN_SPEC.md §6 Inquiry, docs/OPEN_QUESTIONS.md Q10,
docs/phases/10-inquiry.md, and reference image 01. Create branch phase/10-inquiry, enter plan mode,
propose a plan, wait for approval. Build, verify, follow CLAUDE.md §8, and stop.
```

## Decisions log
-
