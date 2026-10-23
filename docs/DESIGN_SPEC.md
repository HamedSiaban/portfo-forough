# Design spec

Derived from the reference screenshots in `docs/reference/`. Values marked **(placeholder)** are best guesses until Foro confirms them in `OPEN_QUESTIONS.md`.

---

## 1. Visual language

Quiet, near-monochrome canvas with **one saturated accent** (hot pink in the reference). Huge, tightly tracked geometric display type. Soft rounded "cards on paper" surfaces. A **halftone dot texture** sits over grey gradients and is the signature of every "living" background. Utility text (buttons, labels, chips) is **monospaced uppercase**, which gives a technical counterpoint to the soft shapes.

---

## 2. Tokens

Defined as CSS variables in `globals.css`, exposed through Tailwind v4 `@theme`. Components only use semantic names.

| Token                 | Light                                                             | Dark                                                | Use                               |
| --------------------- | ----------------------------------------------------------------- | --------------------------------------------------- | --------------------------------- |
| `--background`        | `#F2F2F2`                                                         | `#0F0F10`                                           | page                              |
| `--surface`           | `#FFFFFF`                                                         | `#18181A`                                           | cards, panels                     |
| `--surface-muted`     | `#FAFAFA`                                                         | `#1F1F22`                                           | secondary cards, inputs           |
| `--surface-inverse`   | `#262626`                                                         | `#EDEDED`                                           | dark quote panel, primary buttons |
| `--on-inverse`        | `#F2F2F2`                                                         | `#0F0F10`                                           | text/icons on `--surface-inverse` |
| `--foreground`        | `#2B2B2B`                                                         | `#EDEDED`                                           | primary text                      |
| `--muted-foreground`  | `#6B6B6B` (was `#7A7A7A` — failed AA, see Phase 01 decisions log) | `#9A9A9A`                                           | body secondary                    |
| `--subtle-foreground` | `#B5B5B5`                                                         | `#5C5C5C`                                           | disabled steps, placeholders      |
| `--border`            | `#E4E4E4`                                                         | `#2A2A2D`                                           | hairlines, accordion rules        |
| `--accent`            | `#FF3D71` **(placeholder)**                                       | `#FF5C88` **(placeholder)**                         | wave core, dots, highlights       |
| `--accent-soft-1..3`  | `#FFB3C6` / `#FFCCD9` / `#FFE3EA` **(placeholder)**               | `#7A2E3F` / `#5C2433` / `#3D1B24` **(placeholder)** | pattern art, trails               |
| `--halftone-dot`      | `rgb(0 0 0 / .10)`                                                | `rgb(255 255 255 / .06)`                            | static halftone                   |
| `--ring`              | `--foreground`                                                    | `--foreground`                                      | focus                             |

**Radii:** panel `2rem` (hero/CTA frames, big cards) · card `1.75rem` · input `0.5rem` · header button `0.5rem` · CTA pill `9999px` · chip `9999px`.
**Spacing:** 4px base. Page gutter `16px` mobile / `48px` desktop. Framed panels inset `16px` from viewport edges.
**Shadows:** none, or near-invisible. Depth comes from surface contrast, not shadows.

---

## 3. Typography

Three **Pangram Pangram** families, self-hosted from `src/fonts/` via `next/font/local` (config in `src/fonts/index.ts`).

| Token            | Family                                         | Weights (CSS)        | Role                                |
| ---------------- | ---------------------------------------------- | -------------------- | ----------------------------------- |
| `--font-display` | **PP Frama** + `font-feature-settings: "ss01"` | 400, 500             | all `display-*` styles              |
| `--font-sans`    | **PP Neue Montreal**                           | 350 (Book), 400, 500 | body, headings, labels, form fields |
| `--font-mono`    | **PP Supply Mono**                             | 500                  | buttons, chips, credentials row     |

**Why `ss01` on Frama:** it swaps in the single-storey `a`, straight-tailed `y` and cut `t` that give the reference headlines their geometric look. Without it, Frama looks much closer to Neue Montreal. Don't enable it on Neue Montreal: body text keeps the double-storey `a`.

Wiring in `globals.css` (Tailwind v4):

```css
@theme inline {
  --font-display: var(--font-frama);
  --font-display--font-feature-settings: "ss01";
  --font-sans: var(--font-neue-montreal);
  --font-mono: var(--font-supply-mono);
  --font-weight-book: 350;
}
```

`next/font` variables go on `<html>` (`className={fontVariables}`). Call `ScrollTrigger.refresh()` after `document.fonts.ready`, because the big display sizes change section heights.

| Style                                                     | Family · weight          | Size                           | Line height | Tracking | Notes                           |
| --------------------------------------------------------- | ------------------------ | ------------------------------ | ----------- | -------- | ------------------------------- |
| `display-xl` (hero, interlude)                            | Frama 500                | `clamp(3.5rem, 11vw, 12.5rem)` | 0.86        | -0.055em | centred or left                 |
| `display-lg` (section titles: FAQ, work, CTA)             | Frama 400                | `clamp(3rem, 7vw, 7.5rem)`     | 0.88        | -0.05em  |                                 |
| `display-md` (quote, legal page titles)                   | Frama 400                | `clamp(2rem, 5vw, 6rem)`       | 0.92        | -0.045em | quote is on the inverse surface |
| `display-sm` (FAQ title, matches ref 09 scale)            | Frama 400                | `clamp(2rem, 3.4vw, 3.5rem)`   | 1           | -0.045em | added in Phase 09               |
| `heading` ("Start to Finish", "Single Project", legal h2) | Neue Montreal 500        | `clamp(1.75rem, 3vw, 3rem)`    | 1.0         | -0.035em |                                 |
| `title` (project card titles, FAQ questions)              | Neue Montreal 400        | 1.5rem                         | 1.25        | -0.015em |                                 |
| `body-lg`                                                 | Neue Montreal 400        | 1.25rem                        | 1.35        | -0.01em  |                                 |
| `body`                                                    | Neue Montreal 350 (Book) | 1rem                           | 1.5         | 0        | FAQ answers, legal prose        |
| `label` (step names "YOUR PROJECT", "STANDARD")           | Neue Montreal 400        | 0.8125rem                      | 1           | 0.02em   | uppercase                       |
| `mono-ui` (buttons, chips, credentials row)               | Supply Mono 500          | 0.875rem                       | 1           | 0.04em   | uppercase                       |

---

## 4. Shared components

- **Header buttons:** `Start a conversation` = solid inverse mono button; theme toggle = small segmented pill (sun / moon), replacing FR/EN.
- **Framed panel:** full-bleed minus 16px inset, `2rem` radius, grey gradient + halftone + `<WaveField>`. Used by Hero, CTA and, in a dark variant, the Quote panel.
- **Numbered step row:** small rounded number badge · hairline that fills the width · uppercase label on the right. Inactive steps are dimmed to `--subtle-foreground` until the previous step is valid (used in pricing and the inquiry form).
- **Chips:** pill, `--surface-muted`, mono or sans small.
- **PatternArt:** generative pink compositions on halftone (diagonal stepped squares, a row of overlapping circles, concentric diamonds, a snake of stacked squares). Built as SVG or canvas from tokens. No raster files.

---

## 5. Sections (default order, reorderable via `config/sections.ts`)

### Header (fixed)

Logo tile (left, links to site URL `/`) · `Start a conversation` (opens the Inquiry modal) · theme toggle. Stays above all sections. Must remain legible over both light and dark panels (test over the quote panel).

### 1 · Hero — `#hero` · refs 05, 02

Framed panel. Mono credentials row with accent dot separators → `display-xl` headline (centred, ~6 lines on desktop) → `body-lg` subline.
**Effect: wave glow (comet).** A shiny accent glow whose bright, narrow head stays exactly on the pointer. Moving it drags a wider, dimmer body of light behind the head, like a comet or a flame, so the back is larger than the front. The head has **momentum** (a damped spring): it eases into motion, lagging the pointer briefly before catching up, and when the pointer stops it carries a little past it, then settles back onto it (~0.5s) while the tail collapses. The glow is always pulled back to the pointer, so it never lives independently of it. Size follows pointer speed (faster = bigger and longer tail, slower = smaller, relaxing to a small round resting glow), and it fades out in place when the pointer leaves. Output is rendered through a **halftone dot shader**, so the glow reads as a field of dots that fades to a soft halo at the edges. Where the glow passes over the headline, the letters turn accent-coloured with a slight **RGB/chromatic offset** (cyan fringe).
Technique (built in Phase 03, `<WaveField />`): dark DOM text, canvas above it with **normal alpha compositing** (no `mix-blend-mode` — `lighten`/`screen` has almost no headroom against a near-white backdrop; ref 19 confirmed the real effect reads as vivid pink over _both_ the background and dark text). The shader outputs full-saturation accent color with falloff driving alpha only, so low-density dots fade out as translucent pink rather than a dark muddy color. Chromatic offset is done in the shader.
**Scroll out:** the panel scrolls up and away, uncovering section 2's headline beneath it (ref 02).

**`<WaveField />` tuned defaults** (`src/components/effects/wave-field/`, tune further at `/styleguide/wave`): rest radius 34px · full-speed radius 120px (reached at ≥ 2200 px/s) · head spring (stiffness 225, damping 12 → ~25% overshoot, settles in ~0.5s) · 16-point comet tail chasing the head at 40/s, head narrowed and tail end widened by up to 70% at full speed, brightness falling ~3%/point · `intensity` 1 (size multiplier) · grow rate 14/s, shrink rate 3.5/s · `dotSize` 11px · `halftone`/`chromatic` on by default · DPR capped 1.5.

### 2 · Value cards — `#approach` · refs 06, 16, 12

Centred sticky `display-xl` headline + short paragraph. On scroll, **4 cards fly in from "in front of the screen"**: they start scaled up and blurred beyond the viewport, with strong perspective (`rotateX`, trapezoid silhouette, ref 06), then settle onto the headline one at a time. Each card = PatternArt image area + title + one-line copy. Earlier cards recede into a stack behind the newest (scale down, move up, slight darken; the tab edges stay visible, ref 16). The section is pinned for ~4 viewport heights; one card per step, scrubbed. Leaving: the stack fades/lifts as section 3 overlaps (ref 12).

### 3 · Work — `#work` · refs 12, 13, 15, 08

One screen (`min-h-svh`) at `lg`+, deliberately quiet so the work holds the focus: hairline borders and soft shadows only. Intro row (title, note, contact button) above a 2×2 grid of large horizontal cards (cover left, number/title/arrow right); below `lg` the cards stack. No reel tile. The section scrolls normally: no pin and no scroll gate (both were removed).

- **Reel tile (top band, ~40% of the height):** dark, muted looping preview + `SHOWREEL` button centred. The intro sits on it: "Latest delivery" title, "projects typically start within…" and `Request a quote` (→ Inquiry modal). On click the tile opens the **Video modal** with a shared-element transition: it expands into the full-screen player (GSAP Flip or Motion `layoutId`), and closing reverses it. A real video needs a dark scrim behind the intro text.
- **Project cards (one row, ~60%):** four tall cards (2 per row on `md`, stacked on mobile). Number, title, region + duration chips, arrow icon or "NDA". The whole card is the link; NDA cards are static with no hover. Space above the title is reserved for project thumbnails.
- **Effects:** only a hairline that draws along the card's bottom edge on hover/focus, a border and shadow lift, an arrow nudge, and a 1px press. Section enter is the shared staggered rise.

### Interlude — "Let's talk about your project." · refs 08, 10

`display-xl` centred statement between Work and FAQ. A reveal on enter (line-by-line rise/mask) is enough.

### 4 · Pricing — removed

Dropped (the site is a hiring portfolio). Sections keep their numbering; ids and the registry are unaffected.

### 5 · FAQ — `#faq` · refs 09, 14

Title + "Need more information? Feel free to reach out." (link opens the Inquiry modal). Accordion with full-width hairlines. The `+` rotates to `×`. The body expands with a height + opacity transition. Single-open.

### 6 · CTA — `#contact` · ref 11

Framed panel, plain gradient (no halftone, no wave). Left-aligned `display-lg` "Ready to build something exceptional from 0 to 1?" + pill CTA (→ Inquiry modal).
**Effect: cursor image trail.** Pointer movement spawns design tiles at the cursor from a recycled pool: each new tile lands on top, tilts with the travel direction and fades/scales out after ~1s. Spawn by distance travelled, not time; an accent dot eases after the cursor. Touch: a slow scripted path auto-plays while on screen. Reduced motion: a static three-tile collage.

### Footer

Left: `Legals`, `Privacy` → routes. Centre: email (`mailto:`). Right: `LinkedIn` (external, `rel="noopener noreferrer"`).

---

## 6. Modals

### Inquiry — ref 01

Backdrop: page dims to grey with halftone. Layout: left column = title card ("Let's talk") + info card (copy, email link, WhatsApp link, location/timezone: _Yerevan, Armenia · UTC+4_ (placeholder)); right = form card with numbered steps:

1. **You:** Name*, Email*
2. **Your company:** Company name, Website
3. **The role:** Role title, Employment type (select), Work setup (select), Ideal start date
4. **Tell me more:** textarea "About the role and your team …"
   Consent line with privacy-policy link · `Send` pill (disabled until valid). Later step groups are dimmed until the required fields above are valid. Enter: backdrop fade + cards rise with a stagger (Motion). Success: in-place confirmation state, not a toast. Error: inline message + retry. Close: `×`, `Esc`, backdrop click (with a confirm if the form is dirty).

### Video — opened from the Showreel tile

Shared-element expansion from the tile. Native `<video>` with custom minimal controls (play/pause, scrub, mute, captions), `Esc` to close, focus returns to the tile.

---

## 7. Legal pages — refs 03, 17

Header + footer as usual. Small title card ("Legal notice" / "Privacy policy") + large content card with prose (`display`-style h2s, comfortable measure). Content comes from `src/content/legal/` and is Foro's own (Armenia-based business details). Don't adapt the reference's French legal text.

---

## 8. Motion defaults

|                 | Value                                                           |
| --------------- | --------------------------------------------------------------- |
| Ease, entrances | `expo.out` / `cubic-bezier(0.16, 1, 0.3, 1)`                    |
| Ease, scrubbed  | `none` (let Lenis provide the smoothing)                        |
| Ease, UI        | `power2.out`, 200–300ms                                         |
| Stagger         | 0.06–0.1s                                                       |
| Lenis           | `lerp: 0.1`, `smoothWheel: true`, disabled under reduced motion |
| Hover           | 150–200ms, transform/opacity/colour only                        |

## Case-study pages (`/work/[slug]`)

Deliberately quiet so the reader's focus stays on the work: one centred column (`max-w-5xl`; text capped at `max-w-2xl`), no panels or effects, hairline-separated sections, the shared type scale and tokens, and the CSS-only hero fade (off under reduced motion). Hero = back link · `display-md` title · summary · meta row (role / timeline / deliverables) · results · cover. Body = sections of typed blocks (`p`, `subheading`, `list`, `quote`, `metrics`, `image`, `video`); media may break out wide, text never does. Video uses native controls, `preload="none"`, a poster and a captions track. Content: `src/content/case-studies/`; add a study by copying `wondrfly.ts`, registering it in `index.ts` and setting `slug` on its project in `content/work.ts`.
