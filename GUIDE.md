# Developer Guide

This is the "how it actually works" document. It assumes you know HTML, CSS, and JavaScript
basics — it explains *this project's* conventions, not the language. If you only need to
change text or images, you may not need this at all: see
[EDITING-CONTENT.md](EDITING-CONTENT.md).

- [Mental model](#mental-model)
- [The lifecycle of a page load](#the-lifecycle-of-a-page-load)
- [The two contracts (read this twice)](#the-two-contracts-read-this-twice)
- [`content.js` — the data bank](#contentjs--the-data-bank)
- [`script.js` — the global layer](#scriptjs--the-global-layer)
- [The page scripts](#the-page-scripts)
- [The Jacket Sale page (a reusable product-sale template)](#the-jacket-sale-page-a-reusable-product-sale-template)
- [Shared partials (nav, footer, SVG icons)](#shared-partials-nav-footer-svg-icons)
- [Styling system](#styling-system)
- [Images & the converter](#images--the-converter)
- [How to add a new page](#how-to-add-a-new-page)
- [Known quirks & inconsistencies](#known-quirks--inconsistencies)

---

## Mental model

The site separates **structure**, **data**, and **plumbing**:

| Layer | Lives in | Responsibility |
|-------|----------|----------------|
| **Structure** | the `.html` files | Static layout: sections, headings, and empty placeholder boxes with `id`s. |
| **Data** | `scripts/content.js` | Every editable string, image path, and link, grouped by page. |
| **Plumbing** | `script.js` + `scripts/<page>.js` | Reads the data and writes it into the placeholders by `id`. |

The win: a non-developer (or future-you) can change almost anything visible by editing one
data file, without reading a line of layout code. The cost: the HTML and the scripts are
coupled by element `id`s and object keys — rename one without the other and content silently
stops appearing. That coupling is "[the two contracts](#the-two-contracts-read-this-twice)"
below.

---

## The lifecycle of a page load

Take `index.html`. At the bottom of `<body>` it loads three scripts, in order:

```html
<script src="/scripts/content.js"></script>   <!-- 1 -->
<script src="/script.js"></script>             <!-- 2 -->
<script src="/scripts/index.js"></script>      <!-- 3 -->
```

1. **`content.js`** runs first and defines one global: `const siteContent = { ... }`.
   It's just data — no logic.
2. **`script.js`** runs on every page. It:
   - defines small DOM helpers on `window` (`setText`, `setImage`, `setLink`,
     `setBackgroundImage`, `smoothScroll`, `getDepartmentColor`);
   - on `DOMContentLoaded`, fetches the shared partials (`svg-defs.html`, `nav.html`,
     `footer.html`) and injects them into their placeholder `<div>`s;
   - builds the navigation menu from `siteContent.navStructure` and wires up the mobile
     menu, active-link highlighting, scroll hide/show, and hash-scrolling.
3. **`scripts/index.js`** runs last. On `DOMContentLoaded` it checks that `siteContent`
   exists, then reads `siteContent.index` (and a couple of shared slices) and fills the
   home page's placeholders.

The other pages follow the identical pattern — only step 3 differs (each loads its own
page script).

---

## The two contracts (read this twice)

Most "it just stopped working" bugs come from breaking one of these two invisible contracts.
Nothing throws a loud error — the placeholder simply stays as "Loading..." forever.

### Contract 1 — load order
`content.js` **must** be the first script on the page, before `script.js` and before the
page script, because everything reads the global `siteContent`. The page scripts guard
against this with:

```js
if (typeof siteContent !== 'undefined') { /* ... */ }
else { console.error("content.js not loaded! ..."); }
```

If you ever see that error in the browser console, a script tag is in the wrong order or
missing.

### Contract 2 — matching `id`s and keys
A page script finds a placeholder with `document.getElementById("some-id")` and fills it
with `siteContent.somePage.someKey`. That means **three things must agree**:

```
HTML:        <p id="about-mission-p1">Loading...</p>
content.js:  about: { missionp1: "To enhance the student experience..." }
about.js:    setText("about-mission-p1", siteContent.about.missionp1);
```

- Rename the HTML `id` → the script's `getElementById` returns `null` → nothing fills.
- Rename/typo the `content.js` key → the script reads `undefined` → nothing fills.

The helpers are deliberately defensive (`if (el && text)`), so a mismatch fails *silently*
rather than crashing. **If a section is stuck on "Loading...", check that the `id` in the
HTML, the key in `content.js`, and the reference in the page script all still match.**

---

## `content.js` — the data bank

One file, one global object: `siteContent`. It's organised by page, and the top-level keys
map to pages:

| Key | Used by | Notes |
|-----|---------|-------|
| `navStructure` | `script.js` (the menu) | Array of pages → each has a `link` and a list of `sections` (`{ name, id }`) that become the dropdown links. The `id`s here are scroll targets on the destination page. |
| `index` | `index.js` | Hero, affiliates list, FAQ array. |
| `about` | `about.js` | Mission paragraphs and the three value blurbs. |
| `committee` | `committee.js` | `highCouncil`, `departments` (each with `leaders`/`members`), and `coreStructure` (the department photo cards). **Order matters** in `highCouncil` — the layout pyramid reads positions 0–5. |
| `eventsPage` | `events.js` + `index.js` | `default` (empty state), `upcoming`, `past`. The home-page carousel reads `upcoming`. |
| `resourcePage` | `resource.js` + `index.js` | `publications` (filtered by `category`), `handbook`, `resources`. The home page shows the latest of each `category`. |
| `alstarPage` | `alstar.js` | Logo, descriptions, certificate pillars, form links, calendar embed URL. |
| `jacketSale` | `jacket.js` | A whole product-sale campaign: hero copy + front/back `designImages`, `priceTiers`, the timeline `milestones`, `orderGoal`/`deadline`, `groupDiscount`, `countdown`, form URLs, and the live-count `orderCountUrl`. See [The Jacket Sale page](#the-jacket-sale-page-a-reusable-product-sale-template). |

Editing rules of thumb:
- Change values **inside the quotes**. Don't rename keys.
- To add an item to a list (a committee member, an event, an FAQ), **copy an existing entry
  in the array and edit it** — keep the same field names. `content.js` has inline comments
  showing where to copy.
- Image values are **paths** into `images/` (e.g. `/images/committee/high_council/president.avif`).
- Leaving an optional field as an empty string `""` is usually handled gracefully (the
  script hides that bit) — see how the scripts check `if (evt.date)` etc.

See [EDITING-CONTENT.md](EDITING-CONTENT.md) for worked examples.

---

## `script.js` — the global layer

Loaded on every page. Four parts:

1. **Helpers on `window`** — so page scripts and inline `onclick=` handlers can call them:
   - `setText(id, text)` / `setImage(id, src)` / `setLink(id, url)` /
     `setBackgroundImage(id, url)` — guarded setters: they no-op if the element is missing
     or the value is empty.
   - `smoothScroll(event, targetId)` — used by inline `onclick` on in-page anchor buttons.
   - `getDepartmentColor(department)` — maps a department name to its Tailwind colour
     classes (used for the coloured tags on cards). Colours are defined in one place: the
     `DEPARTMENT_COLORS` map at the top of `script.js`. To add or change a department,
     edit that map (and mirror the colour in `design_system/`) — no need to touch the
     function.

2. **`loadComponent(elementId, filePath)`** — `fetch`es an HTML partial and injects it into
   the placeholder `<div>`. Silently skips if the placeholder isn't on the page (that's why
   pages without `#svg-defs-placeholder` don't error).

3. **`navbarManagement()`** — builds the menu from `siteContent.navStructure` and handles:
   mobile open/close, closing on link click, active-link highlighting, the navbar
   hide-on-scroll-down / show-on-scroll-up behaviour, and scrolling to a `#hash` when you
   arrive from another page's menu link.

4. **The bootstrap** — a `DOMContentLoaded` handler that injects the partials *then* calls
   `navbarManagement()` (which needs both the injected nav DOM and `siteContent`).

---

## The page scripts

Each `scripts/<page>.js` does the same job for its page: wait for `DOMContentLoaded`, confirm
`siteContent` exists, read its slice, fill the placeholders. Two techniques are used:

- **Simple fields** → the `window` helpers, e.g. `setText("about-mission-p1", ...)`.
- **Repeating lists** (members, events, cards) → build an HTML string in a template literal
  and `insertAdjacentHTML` / `innerHTML` it into a container. `committee.js`'s
  `createMemberCardHTML()` is the canonical example — one function reused for the High
  Council, department leaders, and members.

Per-page notes:
- **`index.js`** — the biggest one. Hero, affiliates grid, the **featured-events carousel**
  (auto-advance, hover-pause, swipe, manual prev/next, and a default "stay tuned" card when
  there are no upcoming events), the latest-publications cards, and the FAQ accordion
  (`toggleFaq` is global so the inline `onclick` can reach it).
- **`committee.js`** — renders the High Council "pyramid" (reads `highCouncil[0..5]` by
  position), department rosters, and the department detail cards with the formal/playful
  image toggle. Several functions are on `window` for inline handlers
  (`toggleQuote`, `toggleDeptImg`, `checkPopupBounds`).
- **`events.js`** — upcoming (with registration links / empty state) and past events, both
  in the zig-zag gallery layout.
- **`resource.js`** — the publications gallery with category **filter buttons**, the
  handbook list, the academic-resources grid, *and* `submitEmail()` (posts the newsletter
  sign-up to a Google Apps Script endpoint).
- **`about.js`** — the simplest: five `setText` calls.
- **`alstar.js`** — logo/text/pillars/forms/calendar, plus `lookupStudent()` which queries a
  Google Apps Script endpoint for a student's ALSTAR points. `lookupStudent()` lives at the
  top level (the inline `onclick` calls it); the page-fill block uses the same
  `DOMContentLoaded` + `siteContent` guard as the others.
- **`contact.js`** — builds the contact cards from `siteContent.contact.cards`. Each card
  keeps its `id` (e.g. `contact_instagram`) so the nav menu's scroll-target links still work.
- **`jacket.js`** — the product-sale page. Bigger than most: front/back image swap, the
  `buildTimeline()` discount timeline, the live order-count fetch (`fetchOrderCount`, cached
  in `sessionStorage`), the FAQ accordion (`toggleJacketFaq`, global), and a derived
  countdown. Covered in detail in its own section below.
- **`announcement.js`** — the **homepage entry modal**, loaded only by `index.html`. Reads
  `siteContent.announcementModal`, shows the first date-active announcement, and remembers
  dismissals per-id in `localStorage`. Covered in its own section below.

> **External endpoints:** `resource.js`, `alstar.js`, and `jacket.js` talk to Google Apps
> Script Web App URLs (newsletter sign-ups → a Google Sheet; student-ID lookups → the points
> sheet; jacket order count → the responses sheet). Those URLs are hard-coded in the scripts
> (`jacket.js` reads its URL from `siteContent.jacketSale.orderCountUrl`). If a form, tracker,
> or counter breaks, the Apps Script deployment behind that URL is the place to look.

---

## The Jacket Sale page (a reusable product-sale template)

`html_pages/jacket.html` + `scripts/jacket.js` + `siteContent.jacketSale` are built to be
**re-skinned for any one-batch product sale** — a T-shirt sale, hoodie sale, next year's
jacket, etc. Almost nothing is hard-coded in the markup; the page reads everything from the
`jacketSale` slice and builds the dynamic bits at load. To run a new sale you mostly edit
`content.js` (and deploy one small Apps Script). See the
[reuse recipe](#reusing-it-for-a-new-sale-t-shirt-hoodie-) at the end.

### What `siteContent.jacketSale` holds

| Key | Drives |
|-----|--------|
| `title`, `tagline`, `priceTag` | Hero heading (maroon), sub-line (grey), and the "As low as RM80!" price line. |
| `formUrl` / `formEmbedUrl` | The Google Form pre-order link. `formUrl` is used by every "Pre-order now" CTA (hero, try-it-on, countdown, footer, sticky bar). |
| `orderGoal`, `deadline` | The timeline's right end (the goal) and the close date (ISO string) used by the countdown + footer. |
| `orderCountUrl` | Apps Script Web App that returns **only `{ "count": N }`** (see below). A `<...>` placeholder disables the live fetch. |
| `currentOrdersFallback`, `cacheMinutes` | Count shown if the fetch fails/placeholder; how long a fetched count is cached in `sessionStorage`. |
| `designImages` | Array of `{ src, alt }`. Image #1 = front, #2 = back (the hover/tap swap). One image only ⇒ no swap, no flip button. |
| `sizeChartImage` | The tap-to-zoom size-chart image. |
| `priceTiers` | The price table rows (`{ range, base, withName, goalTier? }`). The `goalTier: true` row is highlighted. |
| `milestones` | Timeline ticks: `{ orders, discount }` (e.g. 50 → RM5 off, 100 → RM10 off). |
| `howItWorks`, `tryItOn`, `faq` | The step cards, the try-it-on booth details, and the FAQ accordion items. |
| `groupDiscount` | The "Special Group Discount" blurb (`title`, `description`, `faqHint`). |
| `countdown` | `prefix` + an `urgency` string containing `{days}`, which is replaced with the live days-left. |

### The reusable mechanisms (how the dynamic bits work)

- **Front/back image swap** — the hero image reuses the **same `.show-details` pattern as the
  event cards** (`events.js` / `index.js`). On desktop, `lg:group-hover:opacity-0/100` cross-
  fades front→back on hover; on mobile, the flip button toggles `.show-details` on the
  `#jacket-image-group` element. The container is borderless/shadowless so the (non-
  transparent) square image blends into the white hero. **Trade-off:** because the image is a
  rectangle, hovering its empty corners still triggers the swap — accepted, since per-pixel
  hit-testing isn't practical for raster images. Tightly-cropped images minimise the dead zone.
- **Discount timeline** — `buildTimeline(container, { milestones, goal, count })` draws an
  x-axis-style bar into `#jacket-timeline`: a maroon fill up to `count/goal`, a grey vertical
  tick at each milestone with `RMx` above and the order number below, and a maroon **pointer**
  (line + count label, `z-30`) at the live count that overlaps the milestone labels when they
  coincide. A milestone's labels light up maroon **with a faint glow** once `count` passes it
  — the glow is an arbitrary utility, `[text-shadow:0_0_10px_rgba(136,17,59,0.55)]`, so it
  **only appears after `npm run build`** (arbitrary classes must be scanned + compiled).
- **Live order count (private)** — `fetchOrderCount()` hits `orderCountUrl` and reads `.count`
  from the JSON. The endpoint is a Google Apps Script Web App whose `doGet` returns *only the
  count*, so the **response sheet stays private** — this is deliberately different from a
  "Publish to web → CSV", which would expose every respondent's data to anyone who views the
  page source. The fetch is cached in `sessionStorage` for `cacheMinutes`, and degrades
  gracefully to `currentOrdersFallback` (with an "● Estimated" badge) on any failure.
- **Countdown** — `formatOrdinalDate(deadline)` renders "30th June 2026", and the days-left is
  `Math.ceil((deadline - now) / 86400000)` substituted into `countdown.urgency`'s `{days}`.

### The Apps Script behind the order count

Deploy this as a **Web App** (Deploy → New deployment → *Web app*, **Execute as: Me**,
**Who has access: Anyone**), then paste the `/exec` URL into `orderCountUrl`:

```js
function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet()
                  .getSheetByName('Form Responses 1');   // match the real tab name
  const count = Math.max(0, sheet.getLastRow() - 1);     // minus the header row
  return ContentService
    .createTextOutput(JSON.stringify({ count }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

The URL is safe to commit — it returns only an integer, never respondent rows. (Same trust
model as the `alstar.js` points endpoint.)

### Reusing it for a new sale (T-shirt, hoodie, …)

1. **Copy the data, not the code.** In `content.js`, edit `siteContent.jacketSale` in place
   (or duplicate the whole page — see [How to add a new page](#how-to-add-a-new-page) — and
   rename the slice/ids if you want both live at once). Update `title`/`tagline`/`priceTag`,
   the `priceTiers`, `milestones`, `orderGoal`, `deadline`, `groupDiscount`, `countdown`, and
   the `formUrl`/`formEmbedUrl`.
2. **Swap the images.** Replace `designImages` (front/back) and `sizeChartImage` with new
   AVIFs (optimise via `image-converter/` — see [Images](#images--the-converter)).
3. **Point the live count at the new form's responses** — deploy the Apps Script above against
   the new response sheet and update `orderCountUrl` (or leave the `<...>` placeholder and edit
   `currentOrdersFallback` by hand).
4. **Rebuild** (`npm run build`) so any new arbitrary classes (e.g. the glow) compile.
5. The page is wired into the menu via `siteContent.navStructure` ("Jacket Sale"); its section
   `id`s (`jacket-image-group`, `price-chart`, `total-order-timeline`, `jacket-how-section`,
   `jacket-size-chart`, `jacket-faq-section`) are the dropdown scroll targets — keep them in
   sync with the menu if you rename anything (see [Contract 2](#contract-2--matching-ids-and-keys)).

---

## The homepage announcement modal

`scripts/announcement.js` + `siteContent.announcementModal` add a pop-up that appears when a
visitor lands on the **home page** (it's loaded only by `index.html`). The point is to *push*
the single most important update — a jacket sale, a big event, a new newsletter, an Instagram
reel — to students the moment they arrive, instead of relying on them to navigate and find it.

**How it decides what (and whether) to show:**

1. Bails unless `announcementModal.enabled` is `true` and the page has the
   `#announcement-modal-placeholder` div (homepage only).
2. Picks the **first** entry in `announcements` that is **date-active** — today is on/after
   `showFrom` (if set) and on/before the end of `expires` (if set) — and **not already
   dismissed**. Omit either date to leave that side of the window open.
3. Dismissals are stored **per-id** as a JSON array in `localStorage` under
   `alsco_dismissed_announcements`. Because the check is by `id`, the modal shows **once per
   announcement**: closing it hides it for that visitor forever, but publishing a new
   announcement with a **new `id`** re-triggers it for everyone. (Queuing a future
   announcement with a later `showFrom` is how you line up the next one.)

**Behaviour / contract:**

- Single curated item only (no carousel). The card reuses existing styling — `.btn-maroon`
  for the CTA, and the nav overlay's backdrop + `overflow-hidden` scroll-lock pattern.
- **Responsive layout (`hasImage` flag).** With an image the card is two-column on
  laptop (`md:flex-row`, image in a `md:w-2/5` left column, text/CTA right) and stacks on
  mobile; the card widens to `md:max-w-2xl`. With no image it falls back to a single-column
  `max-w-md` card. The image is shown at its **natural ratio** (`w-full h-auto`, no
  `aspect-*`/`object-*`) so any shape — portrait Instagram posters included — displays
  uncropped with no letterbox whitespace.
- Closing via the ✕ button, **ESC**, or **click-outside** all record the dismissal; following
  the CTA does too (so it won't re-pop when the visitor comes back).
- The `id` is the contract: change it to re-show, keep it to keep it dismissed. The
  `ctaLink` can be an internal page, a `#hash`, or a full external URL.

To publish or change an announcement, edit `siteContent.announcementModal` only — see
EDITING-CONTENT.md "Publishing a homepage announcement".

---

## Shared partials (nav, footer, SVG icons)

`html_pages/nav.html`, `footer.html`, and `svg-defs.html` are **not standalone pages** —
they're fragments injected at runtime by `loadComponent()` into placeholder `<div>`s:

```html
<div id="svg-defs-placeholder"></div>   <!-- only on pages that use <use href="#..."> icons -->
<div id="navbar-placeholder"></div>
<div id="footer-placeholder"></div>
```

This means the navbar/footer markup lives in **one** place — edit `nav.html` once and every
page updates. The trade-off is the [serve-over-HTTP requirement](README.md#run-it-locally):
`fetch` can't load partials off the `file://` protocol.

`svg-defs.html` defines reusable SVG `<symbol>`s (Instagram, trailer, info icons) that the
markup references with `<svg><use href="#ig-svg"></use></svg>`. Only pages that use those
icons include `#svg-defs-placeholder` (currently the home, events, and resource pages).

---

## Styling system

Tailwind v4, configured **only in `input.css`** (no `tailwind.config.js`):

- `@theme { ... }` — design tokens: `--color-maroon`, `--color-main`, `--font-sans: Outfit`,
  etc. Use these via Tailwind utilities like `text-maroon`, `bg-maroon`.
- `@layer components { ... }` — the reusable classes sprinkled through the markup and the
  page scripts: `.btn-maroon`, `.btn-ghost`, `.btn-outline`, `.section-container`,
  `.stack-card`, `.media-card`, `.tag-base`, `.heading-divider`, … When you see an unfamiliar
  class in the HTML that isn't a standard Tailwind utility, it's defined here.
- `@source` directives tell Tailwind which files to scan for class names (`html_pages/`,
  `scripts/`, and the root `*.html`/`*.js`). **If you write Tailwind classes in a new
  folder, add an `@source` for it** or those classes won't be generated.

Workflow: edit `input.css` → `npm run watch` regenerates `output.css` → refresh the browser.
**Never hand-edit `output.css`.**

### The design system (`design_system/`)

The visual language is also packaged as a portable, framework-agnostic **design system** in
`design_system/`, intended for reuse in other ALSCO tech projects. It contains
`tokens.css` (the **single source of truth** — CSS custom properties), `tokens.json` (a
machine-readable mirror), `tailwind-theme.css` (a Tailwind v4 `@theme` + `@layer
components` starter), and `DESIGN-SYSTEM.md` (the human reference).

**Keep it in sync.** Whenever you change a token, component class, or visual pattern in
`input.css`, mirror the change in `design_system/` in the same commit. One thing to watch:
the **department colours live in two places** — `getDepartmentColor()` in `script.js`
(the runtime classes) *and* the design system (tokens + the table in `DESIGN-SYSTEM.md`).
Change a department colour, or add a department, in **both**.

---

## Images & the converter

- Production images are AVIF, in `images/<page>/<section>/...`. Paths are referenced as
  strings in `content.js`.
- `image-converter/` is a **separate mini-project** (its own `package.json`, depends on
  [`sharp`](https://sharp.pixelplumbing.com/)). `convert.js` reads every JPG/PNG from
  `image-original/`, resizes to max width 1200px, encodes to AVIF at quality 80, and writes
  to `image-optimized/`. Run `node convert.js` inside that folder.
- It's purely a tooling helper. It is not imported by the site and not part of the Netlify
  build.

---

## How to add a new page

1. **Create the HTML** in `html_pages/`. Copy an existing page (e.g. `about.html`) for the
   `<head>`, the `#navbar-placeholder`/`#footer-placeholder` divs, and the script tags. Give
   your content sections empty placeholders with unique `id`s.
2. **Add a data slice** to `content.js`: a new top-level key (e.g. `myPage: { ... }`).
3. **Create the page script** `scripts/mypage.js`: wrap in `DOMContentLoaded`, guard on
   `typeof siteContent !== 'undefined'`, then `setText(...)` / build HTML from your slice.
4. **Wire the scripts** at the bottom of the new HTML, in order: `content.js`, `script.js`,
   then `scripts/mypage.js`.
5. **Add it to the menu**: append an entry to `siteContent.navStructure` with the `link` and
   any in-page `sections`.
6. If your new content uses any custom component classes, you're covered by the existing
   `@source` globs; if you put it in a brand-new folder, add an `@source` to `input.css`.

---

## Known quirks & inconsistencies

Things that are easy to trip over — documented so you don't think they're bugs you caused:

- **Copy-pasted comments in the small page scripts.** `about.js`, `events.js`, and
  `resource.js` historically carried headers copied from `script.js` like
  `// 4. Initialize Core Layout` / `// 2. Initialize Navigation Logic` that don't describe
  what those files do. These have been corrected to describe each file's real job.
- **`getDepartmentColor` matches by substring.** It lowercases the department name and looks
  it up against the `DEPARTMENT_COLORS` map in `script.js` — each entry lists the keyword(s)
  to match (`leadership`, `welfare`, `relations`, `comserve`/`community`, `sst`/`secretaries`)
  and the Tailwind classes. First match wins; a department whose name doesn't contain one of
  those falls back to red (`DEPARTMENT_COLOR_DEFAULT`). Add an entry to that map if you
  introduce a new department.
