# ALSCO Design System

The shared visual language for **Sunway A-Level Student Committee (ALSCO)** digital
products — the marketing website and any future ALSCO tech project (forms, dashboards,
microsites, apps).

This document is the human-readable reference. The actual values live in three
machine-consumable files in this folder:

| File | For | Use it when |
|------|-----|-------------|
| [`tokens.css`](tokens.css) | **Source of truth.** CSS custom properties. | Any project — plain CSS, React, Vue, Svelte, etc. |
| [`tokens.json`](tokens.json) | JS / build tools / future Figma pipelines. | You need the values in code or a design tool. |
| [`tailwind-theme.css`](tailwind-theme.css) | Tailwind v4 projects. | Starting a new Tailwind project — get tokens + components for free. |

> **Keep it in sync.** `tokens.css` is the single source of truth. If you change a token,
> a component class, or a visual pattern anywhere, update **all** of these files (and the
> live site's `input.css`) in the same change. See the repo's CLAUDE.md / README.md / GUIDE.md.

---

## Principles

1. **Tokens, not magic numbers.** Reach for a token (`var(--alsco-color-primary)`) before
   hardcoding a hex or pixel value.
2. **Semantic over primitive.** Use intent-based tokens (`--alsco-color-text`) in product
   code; the raw palette (`--alsco-gray-700`) exists to define them, not to be used directly.
3. **Mobile-first, responsive ramp.** Type and spacing scale up at breakpoints. Hover
   affordances are desktop-only (`lg:hover:`) so touch devices don't get stuck states.
4. **Maroon is the signature.** One strong brand color, used deliberately — primary
   actions, accents, focus. Everything else is neutral so the maroon reads.

---

## Color

### Brand

| Token | Hex | Role |
|-------|-----|------|
| `--alsco-maroon` | `#88113b` | Primary brand red — primary buttons, accents, focus ring |
| `--alsco-maroon-dark` | `#6d0d2f` | Pressed / hover state of the primary |
| `--alsco-ink` | `#1f2937` | Headings (near-black) |

### Neutral

| Token | Hex | Role |
|-------|-----|------|
| `--alsco-white` | `#ffffff` | Page background, on-primary text |
| `--alsco-gray-700` | `#374151` | Body copy |
| `--alsco-gray-300` | `#d1d5db` | Hairline borders, dividers |
| `--alsco-black` | `#000000` | Used at low opacity for overlays |

### Semantic roles (use these in product code)

`--alsco-color-primary`, `--alsco-color-primary-hover`, `--alsco-color-on-primary`,
`--alsco-color-bg`, `--alsco-color-text`, `--alsco-color-heading`, `--alsco-color-border`,
`--alsco-color-focus-ring`.

### Department palette (tag colors)

Each ALSCO department has a soft background + strong text pair. This mirrors
`getDepartmentColor()` in `script.js`, which matches the department name **by substring**
and falls back to **leadership/red** if nothing matches.

| Department | Background | Text | Tailwind |
|-----------|-----------|------|----------|
| Leadership *(default)* | `#fee2e2` | `#b91c1c` | `bg-red-100 text-red-700` |
| Welfare | `#dbeafe` | `#1d4ed8` | `bg-blue-100 text-blue-700` |
| Relations | `#fce7f3` | `#be185d` | `bg-pink-100 text-pink-700` |
| Comserve / Community | `#dcfce7` | `#15803d` | `bg-green-100 text-green-700` |
| SST / Secretaries | `#fef3c7` | `#b45309` | `bg-amber-100 text-amber-700` |

> Department colors live in **two places**: the design system (tokens) and the
> `DEPARTMENT_COLORS` map at the top of `script.js` (which `getDepartmentColor()` reads).
> Adding a department means adding an entry to that map **and** a token here.

### Social

| Token | Hex | Role |
|-------|-----|------|
| `--alsco-instagram` | `#e1306c` | Instagram icon background |

### Contrast notes

- `--alsco-maroon` (#88113b) on white passes WCAG AA for normal text.
- **`.btn-blur`** uses dark-grey text (`text-gray-800`) on a faint white backing
  (`bg-white/40`) so it stays legible over any photo. (It previously used `text-black/60`
  with no fill, which could wash out over busy imagery.)

---

## Typography

**Family:** `Outfit` (Google Fonts), with a system sans-serif fallback. Token:
`--alsco-font-sans`.

**Weights loaded:** 300, 400, 500, 600, 700, **800, 900**. The font import must request
`Outfit:wght@300;400;500;600;700;800;900`.

> **Why 800/900 matter:** `h1` uses weight **900** (`font-black`). If the import only
> goes up to 700 (as it historically did), the browser *synthesizes* a fake bold that looks
> muddy. The live site's font import has been updated to include 800;900 — match this in
> any new project.

### Type scale

The site uses a responsive ramp. Pixel-exact values per breakpoint:

| Role | Weight | Mobile | `md` (≥768) | `lg` (≥1024) | Notes |
|------|--------|--------|-------------|--------------|-------|
| `h1` | 900 | 36px | 48px | 60px | Page hero |
| `h2` | 700 | 30px | 36px | 48px | **UPPERCASE** section titles |
| `h3` | 700 | 24px | 30px | 30px | Sub-sections |
| `h4` | 700 | 18px | 24px | 24px | Card titles |
| `p` / body | 400 | 14px | 16px | 18px | `line-height: 1.625` |

For non-Tailwind projects, fluid one-value equivalents are provided
(`--alsco-font-h1` … `--alsco-font-body`) using `clamp()`. For pixel parity with the live
site, use the per-breakpoint sizes via the scale tokens (`--alsco-text-*`).

---

## Spacing & layout

| Token | Value | Role |
|-------|-------|------|
| `--alsco-space-section-y` / `-lg` | `4rem` / `5rem` | Vertical section rhythm (`py-16` → `lg:py-20`) |
| `--alsco-space-gutter` / `-lg` | `1.5rem` / `2rem` | Container side padding (`px-6` → `lg:px-8`) |
| `--alsco-container-7xl` | `80rem` | Default content max-width (`.section-container`) |
| `--alsco-container-6xl` | `72rem` | Narrower content max-width (`.section-container-6xl`) |

Sections are typically wrapped in `.section-container`, separated by a bottom border
(`.section-intro`), and headed by a centered `.section-heading` + `.heading-divider`.

---

## Radius

| Token | Value | Role |
|-------|-------|------|
| `--alsco-radius-sm` | `0.5rem` | Inputs, small chips |
| `--alsco-radius-card` | `1.5rem` | Cards (`rounded-3xl`) |
| `--alsco-radius-pill` | `9999px` | Buttons, tags |

Two shapes define the ALSCO look: **pills** (every button/tag) and **soft 24px cards**.

---

## Elevation (shadow)

| Token | Role |
|-------|------|
| `--alsco-shadow-sm` | Tags, subtle lift |
| `--alsco-shadow` | Default card resting state |
| `--alsco-shadow-lg` | Media cards, hover lift |

---

## Motion

| Token | Value | Role |
|-------|-------|------|
| `--alsco-duration` | `300ms` | Default transitions (buttons, hovers) |
| `--alsco-duration-slow` | `500ms` | Card overlay reveals |
| `--alsco-ease` | `cubic-bezier(0.4, 0, 0.2, 1)` | Standard easing |

Respect `prefers-reduced-motion` in new projects where you add non-essential animation.

---

## Components

All component classes are defined in `tailwind-theme.css` (and live in the site's
`input.css`). Anatomy and rules:

### Buttons — pills, desktop-only hover

| Class | Use | Look |
|-------|-----|------|
| `.btn-maroon` | **Primary** action | Solid maroon, white text, darkens on hover |
| `.btn-outline` | **Secondary** ("View all") | White, maroon border + text, fills on hover |
| `.btn-blur` | Over imagery / hover cards | Frosted glass, white border; fills maroon on hover |
| `.btn-ghost` | Over dark imagery | Translucent white, blurred |

- **Do** use one primary action per view.
- **Don't** stack two `.btn-maroon`s side by side — pair primary + outline.
- All hover states are gated to `lg:` (desktop). On touch, the resting state is the state.
- All now carry a `focus-visible` ring for keyboard users.

### Icons

`.icon-ig` (Instagram pink), `.icon-trailer` (maroon, play), `.icon-info` (mobile-only
info button over cards). Each pairs with a matching `*-svg` class for the inner SVG.

### Tags

`.tag-wrapper` (horizontal scroll row) holds tags. `.tag-base` is the shared shape;
`.tag-primary` (maroon, event type), `.tag-secondary` (translucent black, date/intake),
and department-colored tags (apply the department classes from the table above onto
`.tag-base`).

### Sections & dividers

`.section-container` / `.section-container-6xl` (max-width + gutters), `.section-intro`
(vertical padding + bottom rule), `.section-heading` (centered stack), `.heading-divider`
(+ `-line`, `-dot`) for the accented underline.

### Cards

- `.media-card` — rounded-3xl image card with `.media-card-overlay` + `.media-card-cta`
  (CTA fades up on desktop hover via `group-hover`).
- `.stack-card` / `.card-meta-row` — the zig-zag content layout used on events/resources.
- `.contact-card` / `.contact-card-body` — bordered info cards.

---

## Accessibility

- **Focus:** interactive components carry a `focus-visible` ring
  (`--alsco-focus-ring`, 2px, 2px offset). Never remove focus outlines without a
  replacement.
- **Disabled:** a shared `:disabled` style (`opacity-50 cursor-not-allowed pointer-events-none`)
  is defined for the `.btn-*` family — set a button's `disabled` attribute and it styles
  itself. Used by the in-flight form buttons (ALSTAR lookup `.btn-maroon`; the resource
  newsletter button uses the `disabled:` utilities for the same effect).
- **Contrast:** the `.btn-blur` CTA now backs its grey text with a faint white tint (see the
  Color → Contrast notes). Still test text-over-image combinations for any new component.
- **Reduced motion:** honor `prefers-reduced-motion` for added animation.

---

## Known gaps & recommendations

Applied to the live site:

- ✅ **Font weights 800/900** added to the Google Fonts import so `h1`'s `font-black` is real.
- ✅ **Focus-visible rings** added to all `.btn-*` and `.icon-*` classes.
- ✅ **Disabled button state** — shared `:disabled` rule on the `.btn-*` family, wired into
  the in-flight form buttons (ALSTAR lookup, resource newsletter).
- ✅ **`.btn-blur` contrast** — resolved with grey text on a faint white backing.

Future ideas:

- Dark mode (define a `[data-theme="dark"]` override of the semantic color tokens).
- Form-input component classes (currently ad-hoc).
- A Style Dictionary / Figma Tokens pipeline fed from `tokens.json`.

---

## Changelog

- **2026-06-15** — Initial design system extracted from the website's `input.css` and
  `getDepartmentColor()`. Added focus rings + 800/900 font weights to the live site.
- **2026-06-15** — Wired the shared disabled state into the in-flight form buttons;
  resolved `.btn-blur` contrast (grey text + faint white backing); refactored the
  department palette into a single `DEPARTMENT_COLORS` map in `script.js`.
