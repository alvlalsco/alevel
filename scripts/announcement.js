// ============================================================================
// announcement.js — HOMEPAGE ENTRY MODAL
// ============================================================================
// Pops up a single curated "featured announcement" when a visitor lands on the
// home page, so the most important update (jacket sale, big event, newsletter,
// Instagram reel) reaches them instead of waiting to be found.
//
// Loaded ONLY by index.html (homepage-only by design). Follows the same pattern
// as every other page script: one DOMContentLoaded handler, guard on
// siteContent, then build/fill the markup.
//
// Content + scheduling live in siteContent.announcementModal (content.js).
// Behaviour:
//   • Shows the FIRST announcement whose showFrom→expires window covers today.
//   • Dismissal is remembered per-id in localStorage so it shows once per
//     announcement; publishing a NEW id re-triggers it for everyone.
//   • Baseline a11y/UX: ESC + click-outside + close button dismiss; scroll is
//     locked while open; focus moves into the modal.
//
// TO UPDATE: edit siteContent.announcementModal in content.js only.
// ============================================================================

(() => {
    const STORAGE_KEY = "alsco_dismissed_announcements";

    // ── localStorage helpers — list of dismissed announcement ids ────────────
    function getDismissedIds() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            const parsed = raw ? JSON.parse(raw) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch (_) {
            return []; // corrupted value — treat as nothing dismissed
        }
    }

    function rememberDismissed(id) {
        try {
            const ids = getDismissedIds();
            if (!ids.includes(id)) {
                ids.push(id);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
            }
        } catch (_) { /* storage unavailable (private mode) — ignore */ }
    }

    // ── Scheduling — is today inside the announcement's showFrom→expires window?
    // Dates are inclusive; expires runs to the end of that day.
    function isActive(a) {
        const now = new Date();
        if (a.showFrom && now < new Date(a.showFrom)) return false;
        if (a.expires && now > new Date(`${a.expires}T23:59:59`)) return false;
        return true;
    }

    document.addEventListener("DOMContentLoaded", () => {
        if (typeof siteContent === "undefined" || !siteContent.announcementModal) return;

        const config = siteContent.announcementModal;
        if (!config.enabled || !Array.isArray(config.announcements)) return;

        const placeholder = document.getElementById("announcement-modal-placeholder");
        if (!placeholder) return; // not on the homepage

        // Pick the first scheduled-active, not-yet-dismissed announcement.
        const dismissed = getDismissedIds();
        const announcement = config.announcements.find(
            (a) => a && a.id && isActive(a) && !dismissed.includes(a.id)
        );
        if (!announcement) return;

        // ── Build markup (string injection, like committee.js / index.js) ────
        const eyebrowHTML = announcement.eyebrow
            ? `<p class="text-maroon font-bold tracking-[0.2em] uppercase text-[10px] md:text-xs mb-2 pr-8">${announcement.eyebrow}</p>`
            : "";

        // Image keeps its natural ratio (no forced aspect / object-fit) so portrait
        // posters aren't cropped. On laptop the card becomes two columns (see below).
        const hasImage = !!announcement.image;
        const imageHTML = hasImage
            ? `<div class="w-full md:w-2/5 md:shrink-0 mb-5 md:mb-0">
                    <img src="${announcement.image}" alt="${announcement.imageAlt || announcement.title || ""}"
                         class="w-full h-auto rounded-2xl" loading="eager" decoding="async">
               </div>`
            : "";

        placeholder.innerHTML = `
            <div id="announcement-backdrop" role="dialog" aria-modal="true" aria-labelledby="announcement-title"
                 class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm opacity-0 pointer-events-none transition-opacity duration-300">
                <div id="announcement-card"
                     class="relative w-full ${hasImage ? "max-w-md md:max-w-2xl" : "max-w-md"} bg-white rounded-3xl shadow-2xl p-6 sm:p-8 transform scale-95 transition-transform duration-300 max-h-[90vh] overflow-y-auto">

                    <button id="announcement-close" type="button" aria-label="Close announcement"
                            class="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-maroon hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>

                    <div class="flex flex-col ${hasImage ? "md:flex-row md:gap-6 md:items-center" : ""}">
                        ${imageHTML}
                        <div class="flex flex-col ${hasImage ? "md:flex-1" : ""}">
                            ${eyebrowHTML}
                            <h2 id="announcement-title" class="font-black text-main text-xl sm:text-2xl leading-tight mb-2 pr-8">${announcement.title || ""}</h2>
                            <p class="text-gray-600 text-sm sm:text-base mb-6">${announcement.body || ""}</p>

                            <a id="announcement-cta" href="${announcement.ctaLink || "#"}" class="btn-maroon w-full">
                                ${announcement.ctaText || "Learn More"}
                            </a>
                        </div>
                    </div>
                </div>
            </div>`;

        const backdrop = document.getElementById("announcement-backdrop");
        const card = document.getElementById("announcement-card");
        const closeBtn = document.getElementById("announcement-close");
        const ctaBtn = document.getElementById("announcement-cta");

        // ── Open / close (mirrors toggleMenu in script.js) ───────────────────
        function open() {
            backdrop.classList.remove("opacity-0", "pointer-events-none");
            backdrop.classList.add("opacity-100");
            card.classList.remove("scale-95");
            card.classList.add("scale-100");
            document.body.classList.add("overflow-hidden");
            closeBtn.focus();
        }

        function dismiss() {
            rememberDismissed(announcement.id);
            backdrop.classList.add("opacity-0", "pointer-events-none");
            backdrop.classList.remove("opacity-100");
            card.classList.add("scale-95");
            card.classList.remove("scale-100");
            document.body.classList.remove("overflow-hidden");
            document.removeEventListener("keydown", onKeydown);
            setTimeout(() => placeholder.replaceChildren(), 300); // after fade-out
        }

        function onKeydown(e) {
            if (e.key === "Escape") dismiss();
        }

        closeBtn.addEventListener("click", dismiss);
        // Click on the backdrop (outside the card) dismisses; clicks inside don't.
        backdrop.addEventListener("click", (e) => {
            if (e.target === backdrop) dismiss();
        });
        // Following the CTA counts as handled — don't re-pop after they come back.
        ctaBtn.addEventListener("click", () => rememberDismissed(announcement.id));
        document.addEventListener("keydown", onKeydown);

        // Small delay so the modal doesn't fight the nav/footer injection.
        setTimeout(open, 400);
    });
})();
