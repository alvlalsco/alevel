# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Static marketing website for the Sunway A-Level Student Committee (ALSCO). No framework, no bundler — plain HTML + vanilla JS, styled with Tailwind CSS v4 (CLI). Deployed on Netlify.

## Human-facing docs

There are three Markdown guides written for the human maintainers (kept in sync with this file): `README.md` (onboarding hub: what it is, how to run, repo map), `GUIDE.md` (developer deep-dive: architecture, the load-order/`id` contracts, how to add a page, known quirks), and `EDITING-CONTENT.md` (copy-paste recipes for editing `content.js`). When you change architecture, consider whether these need updating too.

## Commands

```bash
npm run build      # Compile input.css -> output.css (minified). Netlify runs this on deploy.
npm run watch      # Recompile output.css on change while developing.
```

There are no tests or linters. `npm test` is a placeholder that exits 1.

**Serving locally:** the site fetches components and assets with absolute paths (e.g. `/html_pages/nav.html`, `/images/...`). Opening HTML files via `file://` breaks navigation and asset loading. Serve from the project root over HTTP instead (e.g. `npx serve .` or VS Code Live Server) so `/` resolves to the repo root.

## Architecture

The site is **content-driven**: structure lives in HTML, all editable copy/images/links live in one data object, and per-page scripts inject that data into the DOM at load.

- **`scripts/content.js`** — the single "data bank". Defines the global `const siteContent = { ... }`, organized by page (`navStructure`, `index`, `about`, `committee`, `events`, `resource`, `alstar`, `contact`, `jacketSale`, etc.). To change visible text, images, or links, edit the string values here — not the HTML or page scripts. Image paths point into `images/`.

- **`script.js`** — global layer loaded on every page. Exposes DOM helpers on `window` (`setText`, `setImage`, `setLink`, `setBackgroundImage`, `getDepartmentColor`), loads the shared nav/footer via `loadComponent()` (fetches `html_pages/nav.html` and `html_pages/footer.html` into placeholders), and runs `navbarManagement()` (mobile menu toggle, active-link highlight, scroll hide/show, hash-scroll). It reads `siteContent.navStructure` to build the menu.

- **`scripts/<page>.js`** — one script per page (`index.js`, `about.js`, `committee.js`, `events.js`, `resource.js`, `alstar.js`, `contact.js`, `jacket.js`). Each waits for `DOMContentLoaded`, guards on `typeof siteContent !== 'undefined'`, then reads its slice of `siteContent` and populates the page — either via the `window` helpers or by building `innerHTML` strings (see `createMemberCardHTML` patterns in `committee.js`). In `alstar.js`, only `lookupStudent()` is top-level (called from an inline `onclick`); its page-fill block uses the standard `DOMContentLoaded` + guard like the others. `resource.js`, `alstar.js`, and `jacket.js` also POST to / fetch from hard-coded Google Apps Script endpoints (newsletter sign-up; ALSTAR points lookup; jacket live order count).

- **`scripts/jacket.js` + `siteContent.jacketSale`** — the **Jacket Sale page**, designed as a **reusable product-sale template** (re-skin it for a T-shirt sale, hoodie sale, etc. — see GUIDE.md "The Jacket Sale page"). Everything is config-driven from `jacketSale`: hero with a front/back image swap (reuses the event-card `.show-details` hover/tap pattern), a tiered `priceTiers` table, a live **discount timeline** built by `buildTimeline()` from `milestones` + the live order count, a group-discount blurb, and a deadline **countdown** (date + days-left derived from `deadline`). The live count comes from a Google Apps Script Web App that returns **only `{ "count": N }`** (set in `orderCountUrl`) — the response sheet stays private, unlike a "publish to web" CSV. Leave `orderCountUrl` as a `<...>` placeholder to fall back to `currentOrdersFallback`.

- **`scripts/announcement.js` + `siteContent.announcementModal`** — the **homepage entry modal**, loaded only by `index.html`. On `DOMContentLoaded` it reads `announcementModal` (a master `enabled` flag plus an `announcements` array), shows the **first announcement whose `showFrom`→`expires` date window covers today**, and injects it into `#announcement-modal-placeholder`. Purpose: *push* the most important update (a jacket sale, event, newsletter, Instagram reel) to visitors instead of waiting for them to find it. Dismissal is remembered **per-id** in `localStorage` (`alsco_dismissed_announcements`), so it shows once per announcement — changing the `id` re-triggers it for everyone. Closing (✕ / ESC / click-outside) and following the CTA both record the dismissal. Reuses existing styling (`.btn-maroon`, the nav overlay/scroll-lock pattern); single curated item only. The card is responsive (a `hasImage` flag drives a two-column image-beside-text layout on laptop, stacked on mobile) and shows the image at its natural ratio (`w-full h-auto`) so portrait posters aren't cropped.

- **HTML** — `index.html` is at the repo root; all other pages are in `html_pages/`. Each page includes scripts in this order: `scripts/content.js`, then `script.js`, then its own `scripts/<page>.js`. HTML holds static layout with empty placeholder elements (often showing "Loading...") that scripts fill by `id`. `nav.html`, `footer.html`, and `svg-defs.html` are partials injected at runtime, not standalone pages.

### Load-order contract (important)

`content.js` must load before `script.js` and before any page script, because everything reads the global `siteContent`. Scripts find elements by `id`, so **element IDs in the HTML are the contract** between markup and script — renaming an `id` or a `siteContent` key without updating the matching script breaks injection silently (the placeholder just stays as "Loading...").

## Styling

Tailwind v4, configured entirely in `input.css` (no `tailwind.config.js`). Theme tokens (`--color-maroon`, `--color-main`, `--font-sans: Outfit`) are defined in the `@theme` block; reusable component classes (`.btn-maroon`, `.btn-ghost`, `.section-container`, etc.) live in `@layer components`. `@source` directives tell Tailwind to scan `html_pages/`, `scripts/`, and root `*.html`/`*.js` for class usage. Edit `input.css` and rebuild; never hand-edit the generated `output.css`.

## Design system

The ALSCO visual language is documented in **`design_system/`** — a portable design system meant to be reused across other ALSCO tech projects, not just this website. It holds `tokens.css` (the **single source of truth**: framework-agnostic CSS custom properties), `tokens.json` (machine-readable mirror), `tailwind-theme.css` (a Tailwind v4 `@theme` + `@layer components` starter), and `DESIGN-SYSTEM.md` (the human reference).

**Keep it in sync (important).** Whenever you change a design token, component class, or visual pattern in `input.css` — or the department palette (the `DEPARTMENT_COLORS` map in `script.js`) — update `design_system/` in the **same** change so it stays the source of truth. Specifically: a color/font/spacing value → `tokens.css` + `tokens.json` + `tailwind-theme.css` + `input.css`'s `@theme`; a component class → `tailwind-theme.css` + `input.css`; a department color → the table in `DESIGN-SYSTEM.md` + the tokens + the `DEPARTMENT_COLORS` map in `script.js` (the single place department colors are defined).

## Images

Production images are AVIF in `images/`, grouped by page/section. The standalone **`image-converter/`** project (separate `package.json`, uses `sharp`) batch-converts source JPG/PNG to width-1200 AVIF at quality 80 — run `node convert.js` inside that folder, reading from `image-original/` and writing to `image-optimized/`. It is a tooling helper, unrelated to the site's runtime or the Netlify build.
