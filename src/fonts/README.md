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

## Licence status: ⚠️ development only

All three families are commercial fonts by **Pangram Pangram** (pangrampangram.com). The embedded licence field reads "Pangram Pangram EULA" / "Contact Pangram Pangram Foundry".

These files are the **reference site's web builds** (their names ended in `-RD`, and stylistic sets are baked into the family names: Neue Montreal `ss02`, Frama `ss03`). They're fine for local development, but **must not go to production**.

Before launch (Phase 12 gate):

1. Buy **web licences** for PP Frama, PP Neue Montreal and PP Supply Mono (the weights above) from pangrampangram.com. Their free trial downloads cover personal, non-commercial use only.
2. Replace the six files here with your licensed `.woff2` files, keeping these names (or update the paths in `index.ts`).
3. The retail files won't have the reference's stylistic sets baked in. To keep the same look, set `font-feature-settings: "ss02"` on the sans token (and check Frama `ss03`) in `globals.css`. Compare against `docs/reference/` screenshots.
4. Optionally subset to Latin with `pyftsubset` to cut weight (Frama ≈ 56 KB per file now).
5. Tick the font item in `docs/phases/12-polish-launch.md` and remove this warning.

## Coverage

Latin + Latin Extended in all three; Neue Montreal also covers Cyrillic. **No Armenian** glyphs in any of them. Fine for an English-only site; revisit if you add i18n (OPEN_QUESTIONS Q15).
