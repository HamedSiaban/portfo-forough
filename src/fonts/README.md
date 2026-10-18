# Fonts

| File                           | Family           | Weight (CSS) | Role                                          |
| ------------------------------ | ---------------- | ------------ | --------------------------------------------- |
| `PPFrama-Regular.woff2`        | PP Frama         | 400          | display: section titles, quote, legal titles  |
| `PPFrama-Medium.woff2`         | PP Frama         | 500          | display: hero, interlude, CTA, prices         |
| `PPNeueMontreal-Book.woff2`    | PP Neue Montreal | 350          | long body copy, FAQ answers                   |
| `PPNeueMontreal-Regular.woff2` | PP Neue Montreal | 400          | body, FAQ questions, uppercase labels         |
| `PPNeueMontreal-Medium.woff2`  | PP Neue Montreal | 500          | card headings ("Start to Finish"), plan names |
| `PPSupplyMono-Medium.woff2`    | PP Supply Mono   | 500          | buttons, chips, credentials row               |

Loaded in `index.ts` with `next/font/local`. Tokens and the `ss01` setting live in `src/app/globals.css` (DESIGN_SPEC §3).

## Notes

Stylistic sets are baked into the family names of these builds (Neue Montreal `ss02`, Frama `ss03`). Optionally subset to Latin with `pyftsubset` to cut weight (Frama ≈ 56 KB per file).

## Coverage

Latin + Latin Extended in all three; Neue Montreal also covers Cyrillic. **No Armenian** glyphs in any of them. Fine for an English-only site; revisit if you add i18n (OPEN_QUESTIONS Q15).
