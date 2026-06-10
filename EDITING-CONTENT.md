# Content Editing Cheat Sheet

Everyday edits, step by step. **Almost everything here happens in one file:
[`scripts/content.js`](scripts/content.js).** You don't need to touch the HTML or the page
scripts for any of these.

### Golden rules
1. **Only change text inside the quotes** `"like this"`. Don't rename the words before the
   colon (those are *keys* — the code depends on them).
2. **To add an item to a list, copy a whole existing entry** (everything between a `{` and
   its matching `},` including the comma) and edit the copy. Keep the same field names.
3. **Keep the commas.** Every item in a list ends with a comma `},`. A missing or extra
   comma breaks the whole file — see [If the site goes blank](#if-the-site-goes-blank).
4. **Save, then refresh the browser** (you don't need to rebuild anything for content edits).
5. When in doubt, make a small change first and check the page before doing more.

> Tip: edit in VS Code. If a bracket or quote turns red, or a big chunk suddenly changes
> colour, you've broken the syntax — undo and try again.

---

## Contents
- [Change a piece of text](#change-a-piece-of-text)
- [Change a link](#change-a-link)
- [Swapping or adding an image](#swapping-or-adding-an-image)
- [Add / edit a committee member](#add--edit-a-committee-member)
- [Add an event](#add-an-event)
- [Add an FAQ](#add-an-faq)
- [Add a publication / newsletter / handbook](#add-a-publication--newsletter--handbook)
- [Update the ALSTAR forms or calendar](#update-the-alstar-forms-or-calendar)
- [Edit the contact cards](#edit-the-contact-cards)
- [Run a jacket / T-shirt / product sale](#run-a-jacket--t-shirt--product-sale)
- [If the site goes blank](#if-the-site-goes-blank)

---

## Change a piece of text

Find the text in `content.js` and edit what's inside the quotes. Example — the home-page
hero blurb:

```js
hero: {
    image: "/images/index/alsco_group.avif",
    description: "We are the official student committee representing all A-Level students...",
    //            ^^^^^^^^^^ edit this text only ^^^^^^^^^^
},
```

Don't touch `description:` itself — only the string after it.

---

## Change a link

Links are also just strings. Find the relevant field and paste the new URL between the
quotes. Example — the hero "Handbook" button:

```js
handbook_pdf: "https://drive.google.com/file/d/XXXX/view?usp=sharing",
```

For Google Drive PDFs, use the normal "share" link (set sharing to *Anyone with the link*).

---

## Swapping or adding an image

Image fields hold a **path** to a file in the `images/` folder, e.g.
`"/images/committee/high_council/president.avif"`.

**To swap an existing image** for one that's already in `images/`: just change the path
string.

**To add a brand-new photo** (optimise it first — the site uses small AVIF files):

1. Put your `.jpg`/`.png` into `image-converter/image-original/`.
2. In a terminal:
   ```bash
   cd image-converter
   npm install        # first time only
   node convert.js
   ```
3. Grab the new `.avif` from `image-converter/image-optimized/`.
4. Move it into the appropriate subfolder under `images/` (e.g. `images/events/past/`).
5. In `content.js`, set the image field to the new path, e.g.
   `image: "/images/events/past/my-new-event.avif"`.

> Paths start with `/` and are case-sensitive on the live server. `MyPhoto.avif` and
> `myphoto.avif` are different files.

---

## Add / edit a committee member

In `content.js`, under `committee`. Members live in `departments[].members` (and
`departments[].leaders`); the top team lives in `highCouncil`.

**To edit** someone: change their `name`, `image`, or `quote` string. Leave `role` and the
structure alone.

**To add a general member**, copy an existing member line and edit it:

```js
members: [
    { role: "General Member", name: "ONG XI WEN", image: "/images/committee/leadership_dev/ldmember1.avif", quote: "Yep still surviving :))" },
    // ⬇ copy a line above, paste here, and change name / image / quote
    { role: "General Member", name: "NEW PERSON", image: "/images/committee/leadership_dev/ldmemberX.avif", quote: "Their quote here" },
],
```

Notes:
- `quote` can be left empty (`quote: ""`) — a default quote is shown.
- ⚠️ **`highCouncil` order is fixed by layout.** The page draws a pyramid: position 0 =
  President, 1–2 = VPs, 3–5 = Secretaries/Treasurer. Don't reorder it or add a 7th person
  without expecting the layout to change.
- The department **photo cards** (formal/playful images + blurb) are separate, under
  `committee.coreStructure`. Don't change the `id` fields there.

---

## Add an event

In `content.js`, under `eventsPage`. There are two lists: `upcoming` and `past`.

### Past event
Copy an entry in `past` and edit it:

```js
past: [
    {
        title: "Lecturer Appreciation Week 2026",
        date: "Thursday, 26th February 2026",
        department: "Student Welfare Department",
        image: "/images/events/past/lxs.avif",
        ig_link: "https://www.instagram.com/p/XXXX/",
    },
    // ⬇ new past event — copy the block above and edit
]
```

### Upcoming event
The `upcoming` list is currently **commented out** (wrapped in `/* ... */`) because there
are no upcoming events — the site shows a "Stay tuned" card instead. To publish upcoming
events, remove the `/*` and `*/` around the `upcoming: [ ... ]` block and fill in real
entries. Each entry supports `title`, `department`, `event_type`, `date`, `image`,
`details_image` (optional second image), `ig_link`, `registration_link`, `trailer_link`, and
`button_text`. Optional fields can be `""`; the script hides whatever you leave empty.

> The `department` controls the coloured tag. Use a name containing one of the known
> keywords (Leadership, Welfare, Relations, Comserve/Community, SST/Secretaries) so it gets
> the right colour — otherwise it falls back to red.

---

## Add an FAQ

In `content.js`, under `index.faq`. Copy a `{ question, answer }` block and edit both
strings:

```js
faq: [
    {
        question: "How do I join the ALSTAR programme?",
        answer: "Nope, no interviews needed! ..."
    },
    // ⬇ add a new one here
    {
        question: "Your new question?",
        answer: "Your new answer."
    },
],
```

The accordion is generated automatically — you don't number them or touch any HTML.

---

## Add a publication / newsletter / handbook

In `content.js`, under `resourcePage`.

- **Monthly posts & newsletters** go in `publications`. The `category` field
  (`"post"` or `"newsletter"`) controls which filter button shows it, and the home page
  shows the latest of each. Copy an entry:

  ```js
  {
      title: "April Monthly Post",
      image: "/images/resources/post4.avif",
      category: "post",                 // "post" or "newsletter"
      department: "Student Welfare",
      pdf_link: "https://drive.google.com/file/d/XXXX/view?usp=sharing",
      ig_link: "https://www.instagram.com/p/XXXX/",   // optional
      button_text: "Read Now"
  },
  ```
  > Set `button_text` to something containing "soon" (e.g. `"Coming Soon"`) to show a
  > disabled button while a PDF isn't ready.

- **Handbooks** go in `handbook` (same idea, with `intake` instead of a title).
- **Academic resource links** go in `resources`, grouped by `category` with a list of
  `items` (`{ title, description, url }`).

---

## Update the ALSTAR forms or calendar

In `content.js`, under `alstarPage`:

- `forms.amendment` and `forms.talk` — the Google Form links behind the "Points Amendment"
  and "Talk/Workshop" buttons.
- `calendar` — the Google Calendar **embed** URL (the `src` of the embed iframe, not the
  normal calendar link). Get it from Google Calendar → Settings → *Integrate calendar* →
  *Embed code*, and copy the `src="..."` URL.

> The **points tracker** and the **newsletter sign-up** are powered by Google Apps Script
> endpoints hard-coded in `scripts/alstar.js` and `scripts/resource.js`. Changing those is a
> developer task — see [GUIDE.md](GUIDE.md).

---

## Edit the contact cards

In `content.js`, under `contact.cards`. Each card is one contact method (Instagram, Email,
TikTok…). Edit the `title`, `description`, `link`, and `link_text` strings:

```js
{
    id: "contact_instagram",
    icon: "/images/footer/ig_logo.avif",
    title: "Instagram",
    description: "Follow us for live updates, event highlights and photo dumps.",
    link: "https://instagram.com/alevel.alsco/",
    link_text: "@alevel.alsco",
},
```

To **add a card**, copy a whole block and edit it. Notes:
- **Don't change the `id`** — the nav menu links to it as a scroll target.
- For an **email** card, use a `mailto:` link and add `isEmail: true,` so it opens the mail
  app instead of a new browser tab.
- `icon` points to a logo in `images/footer/`.

---

## Run a jacket / T-shirt / product sale

The **Jacket Sale page** is a reusable template — the same page can run a T-shirt sale, a
hoodie sale, or next year's jacket. Everything visible lives in `content.js` under
`jacketSale`. Edit the strings inside the quotes; don't rename the keys.

```js
jacketSale: {
    title:    "A-Level Varsity Jacket",         // big hero heading
    tagline:  "One batch. No restock. Don't miss it.",
    priceTag: "As low as RM80!",                // the price line under the tagline
    orderGoal: 100,                             // the target (right end of the timeline)
    deadline: "2026-06-30T23:59:59",            // close date — drives the countdown + footer
    formUrl:  "https://forms.gle/XXXX",         // the Google Form every "Pre-order now" opens

    designImages: [                             // image #1 = front, #2 = back (hover/tap to flip)
        { src: "/images/events/upcoming/jacketfront.avif", alt: "Jacket — front view" },
        { src: "/images/events/upcoming/jacketback.avif",  alt: "Jacket — back view"  },
    ],
    sizeChartImage: "/images/events/upcoming/size.avif",

    priceTiers: [                               // the price table; goalTier:true is highlighted
        { range: "30–49", base: 90, withName: 93 },
        { range: "50–99", base: 85, withName: 88 },
        { range: "100+",  base: 80, withName: 83, goalTier: true },
    ],
    milestones: [                               // the timeline ticks: orders → total discount
        { orders: 50,  discount: 5  },
        { orders: 100, discount: 10 },
    ],

    groupDiscount: { title: "Special Group Discount!", description: "RM25 off ...", faqHint: "..." },
    countdown:     { prefix: "Pre-order sale ends on", urgency: "You only have {days} days ..." },
    // ...howItWorks, tryItOn, faq lists — copy an entry to add more (same as elsewhere).
},
```

Notes:
- **`{days}`** in `countdown.urgency` is replaced automatically with the real number of days
  left until `deadline` — leave the `{days}` text in place.
- **Front/back swap:** put exactly two images in `designImages`. One image ⇒ no flip.
- **The live order counter** (`orderCountUrl`, `currentOrdersFallback`) and its Google Apps
  Script are a **developer task** — see [GUIDE.md → The Jacket Sale page](GUIDE.md#the-jacket-sale-page-a-reusable-product-sale-template).
  If you just want a static number, leave `orderCountUrl` as the `<...>` placeholder and set
  `currentOrdersFallback`.
- After editing images **or** anything that changes styling, a developer should run
  `npm run build` once so everything compiles (text edits alone don't need it).

---

## If the site goes blank

If after an edit a whole page (or all pages) shows nothing but "Loading..." or breaks
entirely, you almost certainly introduced a **syntax error in `content.js`** — usually:

- a missing or extra **comma** between items,
- a missing **quote** `"` or **bracket** `}` / `]`,
- accidentally deleting a key (the word before the colon).

How to fix:
1. Open the browser console (**F12** → *Console* tab). A red error like
   `Uncaught SyntaxError` will often point to the line number in `content.js`.
2. Look at that line and the few lines above it for a missing comma/quote/bracket.
3. If you can't spot it, **undo your changes** (Ctrl+Z) back to the last working state and
   redo the edit more carefully — copy a *whole* existing entry rather than typing one from
   scratch.

A single broken character in `content.js` stops *every* page from loading content, because
they all depend on it. That's expected — fix the syntax and everything returns.
