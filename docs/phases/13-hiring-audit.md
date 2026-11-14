# Phase 13 · Hiring-manager audit

Goal: tone motion down ~40%, tag the work cards, tighten case-study reading layout.

## Decisions log

- Headings (hero h1, case-study h1) render instantly; the Work grid fades once in 0.2s with no stagger.
- Card hover is one `card-hover` utility (translateY(-4px), 200ms transform + border-color, no shadow). Off under reduced motion.
- Screenshot card colours are tokens (`--surface-media`, `--border-media`): the audit's `#161820` / white 8% in dark, white / black 8% in light.
- Executive metric grid: `CaseStudy.results` is now exactly four `{ value, label }`. Values are derived from existing case-study copy; "More", "Pre-flight", "Zero", "Direct", "1" are qualitative stand-ins. **Foro to confirm or replace with real figures.**
- Text column is `max-w-[68ch]` centred; wide media still breaks out.
