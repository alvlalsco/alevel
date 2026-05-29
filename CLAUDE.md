# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Static marketing website for the Sunway A-Level Student Committee (ALSCO). No framework, no bundler — plain HTML + vanilla JS, styled with Tailwind CSS v4 (CLI). Deployed on Netlify.

## Commands

```bash
npm run build      # Compile input.css -> output.css (minified). Netlify runs this on deploy.
npm run watch      # Recompile output.css on change while developing.
```

There are no tests or linters. `npm test` is a placeholder that exits 1.

**Serving locally:** the site fetches components and assets with absolute paths (e.g. `/html_pages/nav.html`, `/images/...`). Opening HTML files via `file://` breaks navigation and asset loading. Serve from the project root over HTTP instead (e.g. `npx serve .` or VS Code Live Server) so `/` resolves to the repo root.

## Architecture

The site is **content-driven**: structure lives in HTML, all editable copy/images/links live in one data object, and per-page scripts inject that data into the DOM at load.

- **`scripts/content.js`** — the single "data bank". Defines the global `const siteContent = { ... }`, organized by page (`navStructure`, `index`, `about`, `committee`, `events`, `resource`, `alstar`, `contact`, etc.). To change visible text, images, or links, edit the string values here — not the HTML or page scripts. Image paths point into `images/`.

- **`script.js`** — global layer loaded on every page. Exposes DOM helpers on `window` (`setText`, `setImage`, `setLink`, `setBackgroundImage`, `getDepartmentColor`), loads the shared nav/footer via `loadComponent()` (fetches `html_pages/nav.html` and `html_pages/footer.html` into placeholders), and runs `navbarManagement()` (mobile menu toggle, active-link highlight, scroll hide/show, hash-scroll). It reads `siteContent.navStructure` to build the menu.

- **`scripts/<page>.js`** — one script per page (`index.js`, `about.js`, `committee.js`, `events.js`, `resource.js`, `alstar.js`). Each waits for `DOMContentLoaded`, guards on `typeof siteContent !== 'undefined'`, then reads its slice of `siteContent` and populates the page — either via the `window` helpers or by building `innerHTML` strings (see `createMemberCardHTML` patterns in `committee.js`).

- **HTML** — `index.html` is at the repo root; all other pages are in `html_pages/`. Each page includes scripts in this order: `scripts/content.js`, then `script.js`, then its own `scripts/<page>.js`. HTML holds static layout with empty placeholder elements (often showing "Loading...") that scripts fill by `id`. `nav.html` and `footer.html` are partials injected at runtime, not standalone pages.

### Load-order contract (important)

`content.js` must load before `script.js` and before any page script, because everything reads the global `siteContent`. Scripts find elements by `id`, so **element IDs in the HTML are the contract** between markup and script — renaming an `id` or a `siteContent` key without updating the matching script breaks injection silently (the placeholder just stays as "Loading...").

## Styling

Tailwind v4, configured entirely in `input.css` (no `tailwind.config.js`). Theme tokens (`--color-maroon`, `--color-main`, `--font-sans: Outfit`) are defined in the `@theme` block; reusable component classes (`.btn-maroon`, `.btn-ghost`, `.section-container`, etc.) live in `@layer components`. `@source` directives tell Tailwind to scan `html_pages/`, `scripts/`, and root `*.html`/`*.js` for class usage. Edit `input.css` and rebuild; never hand-edit the generated `output.css`.

## Images

Production images are AVIF in `images/`, grouped by page/section. The standalone **`image-converter/`** project (separate `package.json`, uses `sharp`) batch-converts source JPG/PNG to width-1200 AVIF at quality 80 — run `node convert.js` inside that folder, reading from `image-original/` and writing to `image-optimized/`. It is a tooling helper, unrelated to the site's runtime or the Netlify build.
