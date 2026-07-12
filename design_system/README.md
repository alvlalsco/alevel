# ALSCO Design System

A portable, framework-agnostic design system for **Sunway A-Level Student Committee
(ALSCO)** digital products. It captures the brand's colors, typography, spacing, and
component patterns so any ALSCO project — this website or a future form, dashboard, or
microsite — looks consistent.

## What's in here

| File | What it is |
|------|-----------|
| **[`DESIGN-SYSTEM.md`](DESIGN-SYSTEM.md)** | The human reference — read this first. Colors, type, components, do/don'ts, accessibility. |
| **[`tokens.css`](tokens.css)** | **Source of truth.** CSS custom properties (`--alsco-*`) on `:root`. |
| **[`tokens.json`](tokens.json)** | Machine-readable mirror of the tokens for JS/build tools. |
| **[`tailwind-theme.css`](tailwind-theme.css)** | Tailwind v4 starter: `@theme` tokens + `@layer components`. |

## Pick your stack

| Your project uses… | Use |
|--------------------|-----|
| Plain CSS / any framework | `tokens.css` — import it, then use `var(--alsco-color-primary)` etc. |
| JavaScript / a build step / Figma later | `tokens.json` |
| **Tailwind v4** | `tailwind-theme.css` — paste into your entry CSS for tokens + components |
| A human deciding how something should look | `DESIGN-SYSTEM.md` |

### Quick start (plain CSS)

```html
<link rel="stylesheet" href="design_system/tokens.css">
<!-- load the font: Outfit weights 300;400;500;600;700;800;900 -->
```
```css
.cta { background: var(--alsco-color-primary); color: var(--alsco-color-on-primary); border-radius: var(--alsco-radius-pill); }
```

### Quick start (Tailwind v4)

Copy the `@theme` and `@layer components` blocks from `tailwind-theme.css` into the file
that does `@import "tailwindcss";`, add your `@source` lines, and load Outfit.

## ⚠️ Keep this in sync — the one rule

**`tokens.css` is the single source of truth.** Whenever you change a design value or
pattern, update everything in this folder *and* the live site in the same change:

- A color/font/spacing value → update `tokens.css`, `tokens.json`, `tailwind-theme.css`,
  and the website's `input.css` `@theme`.
- A component class → update `tailwind-theme.css` **and** the website's `input.css`.
- A department color → update the table in `DESIGN-SYSTEM.md`, the tokens, **and** the
  `DEPARTMENT_COLORS` map in `script.js` (the single place department colors are defined;
  `getDepartmentColor()` reads from it).

If you don't, the "system" stops describing reality and becomes worse than nothing. This
rule is also recorded in the repo's `CLAUDE.md`, `README.md`, and `GUIDE.md`.
