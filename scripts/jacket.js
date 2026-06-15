// ============================================================================
// jacket.js — JACKET SALE PAGE
// ============================================================================
// Fills the Jacket Sale page from siteContent.jacketSale (content.js).
// Follows the same pattern as every other page script: one DOMContentLoaded
// handler, guard on siteContent, then build/fill the markup.
// Helpers setText / setImage / setLink are defined in script.js.
//
// Sections built here:
//   A. Hero            — title, tagline, price, front/back image swap, CTA
//   B. Price chart     — table with goal-tier highlighted
//   C. Progress timeline — live count + discount milestones + live pointer
//   C2. Group discount — blurb + scroll-to-FAQ CTA
//   C3. Countdown      — sale-ends date + live days-left + CTA
//   D. How it works    — four step cards from config
//   E. Try-it-on       — booth details from config
//   F. Size chart      — tap-to-zoom image
//   G. Pre-order       — Try-It-On CTA links out to the Google Form
//   H. FAQ             — accordion (toggleJacketFaq, global)
//   I. Deadline footer — close date + repeat CTA
//
// TO UPDATE: edit siteContent.jacketSale in content.js only.
// ============================================================================


// ============================================================================
// LIVE ORDER COUNT — cached fetch
// ============================================================================
// Stores { count, timestamp } in sessionStorage so repeated page visits within
// cacheMinutes don't hammer the endpoint.
async function fetchOrderCount(d) {
    const CACHE_KEY = 'jacketOrderCache';
    const now       = Date.now();

    // Try cache first
    try {
        const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) || 'null');
        if (cached && (now - cached.timestamp) < d.cacheMinutes * 60 * 1000) {
            return { count: cached.count, source: 'cache' };
        }
    } catch (_) { /* ignore parse errors */ }

    // Bail early if URL is still a placeholder
    if (!d.orderCountUrl || d.orderCountUrl.startsWith('<')) {
        return { count: d.currentOrdersFallback, source: 'fallback' };
    }

    try {
        const res  = await fetch(d.orderCountUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        // Endpoint returns only { count: N } — no respondent data is exposed.
        const { count } = await res.json();
        const safeCount = Math.max(0, Number(count) || 0);
        // Write cache
        sessionStorage.setItem(CACHE_KEY, JSON.stringify({ count: safeCount, timestamp: now }));
        return { count: safeCount, source: 'live' };
    } catch (err) {
        console.warn('jacket.js: order count fetch failed, using fallback.', err);
        return { count: d.currentOrdersFallback, source: 'fallback' };
    }
}


// ============================================================================
// FAQ ACCORDION
// ============================================================================
// Global — wired via inline onclick="toggleJacketFaq(n)" in generated markup.
// Same open/close pattern as toggleFaq() in index.js.
function toggleJacketFaq(clickedIndex) {
    const answer  = document.getElementById(`jacket-faq-answer-${clickedIndex}`);
    const icon    = document.getElementById(`jacket-faq-icon-${clickedIndex}`);
    const isClosed = answer.classList.contains('grid-rows-[0fr]');

    document.querySelectorAll('[id^="jacket-faq-answer-"]').forEach(el => {
        el.classList.add('grid-rows-[0fr]', 'opacity-0');
        el.classList.remove('grid-rows-[1fr]', 'opacity-100');
    });
    document.querySelectorAll('[id^="jacket-faq-icon-"]').forEach(el => {
        el.classList.remove('rotate-180');
    });

    if (isClosed) {
        answer.classList.remove('grid-rows-[0fr]', 'opacity-0');
        answer.classList.add('grid-rows-[1fr]', 'opacity-100');
        icon.classList.add('rotate-180');
    }
}


// ============================================================================
// SIZE CHART TAP-TO-ZOOM
// ============================================================================
function initSizeZoom(imgId) {
    const img = document.getElementById(imgId);
    if (!img) return;

    const overlay = document.createElement('div');
    overlay.id        = 'size-zoom-overlay';
    overlay.className = 'fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 hidden cursor-zoom-out';
    overlay.innerHTML = `<img src="${img.src}" alt="${img.alt}" class="max-w-full max-h-full rounded-2xl shadow-2xl object-contain">`;
    document.body.appendChild(overlay);

    img.classList.add('cursor-zoom-in');
    img.addEventListener('click', () => overlay.classList.remove('hidden'));
    overlay.addEventListener('click', () => overlay.classList.add('hidden'));
}


// ============================================================================
// DATE HELPER — "30th June 2026" (ordinal day + full month + year)
// ============================================================================
function formatOrdinalDate(dateInput) {
    const dt  = new Date(dateInput);
    const day = dt.getDate();
    const k   = day % 100, j = day % 10;
    const suffix = (k >= 11 && k <= 13) ? 'th'
                 : j === 1 ? 'st' : j === 2 ? 'nd' : j === 3 ? 'rd' : 'th';
    const month = dt.toLocaleDateString('en-MY', { month: 'long' });
    return `${day}${suffix} ${month} ${dt.getFullYear()}`;
}


// ============================================================================
// PROGRESS TIMELINE — bar + discount milestones + live pointer
// ============================================================================
// Builds an x-axis-style timeline into `container`:
//   • a track (0 → goal) with a maroon fill up to the live order count
//   • a grey vertical tick at each milestone, "RMx" above and the order count
//     below; both labels light up maroon (with a faint glow) once passed
//   • a maroon pointer line + count label at the live count, layered above the
//     milestone labels so it overlaps them when they coincide
function buildTimeline(container, { milestones = [], goal, count }) {
    if (!container) return;

    const pos     = v => Math.max(0, Math.min((v / goal) * 100, 100));
    const fillPct = pos(count);
    const litClass = 'text-maroon [text-shadow:0_0_10px_rgba(136,17,59,0.55)]';
    const dimClass = 'text-gray-400';

    let ticks = '';
    milestones.forEach(m => {
        const left = pos(m.orders);
        const lit  = count >= m.orders ? litClass : dimClass;
        // grey vertical tick line (only the text lights up, not the line)
        ticks += `<div class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-px h-8 bg-gray-300 z-10" style="left:${left}%"></div>`;
        // discount label above the bar
        ticks += `<div class="absolute -translate-x-1/2 z-10 text-sm font-black transition-colors duration-500 ${lit}" style="left:${left}%; top:6px">RM${m.discount}</div>`;
        // order-count label below the bar
        ticks += `<div class="absolute -translate-x-1/2 z-10 text-sm font-bold transition-colors duration-500 ${lit}" style="left:${left}%; bottom:6px">${m.orders}</div>`;
    });

    container.innerHTML = `
        <div class="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-3 bg-gray-100 rounded-full overflow-hidden">
            <div id="jacket-timeline-fill" class="h-full bg-maroon rounded-full transition-all duration-1000 ease-out" style="width:0%"></div>
        </div>
        ${ticks}
        <div id="jacket-timeline-pointer-line"
             class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-0.5 h-10 bg-maroon rounded-full z-20 transition-all duration-1000 ease-out"
             style="left:0%"></div>
        <div id="jacket-timeline-pointer-label"
             class="absolute -translate-x-1/2 z-30 text-sm font-black text-maroon [text-shadow:0_0_10px_rgba(136,17,59,0.55)] transition-all duration-1000 ease-out"
             style="left:0%; bottom:6px">${count}</div>
    `;

    // Animate fill + pointer in from the left on first paint.
    requestAnimationFrame(() => {
        const fill  = container.querySelector('#jacket-timeline-fill');
        const pLine = container.querySelector('#jacket-timeline-pointer-line');
        const pTxt  = container.querySelector('#jacket-timeline-pointer-label');
        if (fill)  fill.style.width  = `${fillPct}%`;
        if (pLine) pLine.style.left  = `${fillPct}%`;
        if (pTxt)  pTxt.style.left   = `${fillPct}%`;
    });
}


// ============================================================================
// MAIN
// ============================================================================
document.addEventListener('DOMContentLoaded', async () => {

    // Guard: bail if content.js didn't load.
    if (typeof siteContent === 'undefined' || !siteContent.jacketSale) {
        console.error('jacket.js: siteContent.jacketSale not found — is content.js loaded first?');
        return;
    }

    const d = siteContent.jacketSale;

    const deadlineDate = new Date(d.deadline).toLocaleDateString('en-MY', { weekday: 'long' })
        + ', ' + formatOrdinalDate(d.deadline);


    // -------------------------------------------------------------------------
    // A. HERO
    // -------------------------------------------------------------------------
    setText('jacket-hero-title',   d.title);
    setText('jacket-hero-tagline', d.tagline);
    setText('jacket-hero-price',   d.priceTag);
    setLink('jacket-hero-cta',     d.formUrl);

    // Front/back jacket image — desktop hover swaps, mobile tap toggles. Same
    // .show-details mechanism as the event cards (events.js / index.js).
    const imgs      = d.designImages || [];
    const frontImg  = document.getElementById('jacket-img-front');
    const backImg   = document.getElementById('jacket-img-back');
    const imgToggle = document.getElementById('jacket-img-toggle');
    const imgGroup  = document.getElementById('jacket-image-group');
    const hasBack   = imgs.length > 1;

    if (frontImg && imgs[0]) {
        frontImg.src = imgs[0].src;
        frontImg.alt = imgs[0].alt || d.title;
    }

    if (backImg) {
        if (hasBack) {
            backImg.src = imgs[1].src;
            backImg.alt = imgs[1].alt || d.title;
        } else {
            backImg.classList.add('hidden');
        }
    }

    if (!hasBack) {
        // One image only: drop the hover-swap (no blank state) and hide the toggle.
        frontImg?.classList.remove('lg:group-hover:opacity-0', 'group-[.show-details]:opacity-0');
        imgToggle?.classList.add('hidden');
    } else if (imgToggle && imgGroup) {
        imgToggle.addEventListener('click', () => imgGroup.classList.toggle('show-details'));
    }

    // -------------------------------------------------------------------------
    // C. PROGRESS TIMELINE
    // -------------------------------------------------------------------------
    const { count: currentOrders, source } = await fetchOrderCount(d);

    const activeTier = d.priceTiers.find(t => t.goalTier) || d.priceTiers[d.priceTiers.length - 1];
    const toGo       = Math.max(0, d.orderGoal - currentOrders);

    setText('jacket-order-count', String(currentOrders));
    setText('jacket-order-goal',  String(d.orderGoal));

    buildTimeline(document.getElementById('jacket-timeline'), {
        milestones: d.milestones || [],
        goal:       d.orderGoal,
        count:      currentOrders,
    });

    const toGoEl = document.getElementById('jacket-to-go-label');
    if (toGoEl) {
        toGoEl.textContent = toGo > 0
            ? `${toGo} more to go until everyone gets RM${activeTier.base}!`
            : `🎉 Goal reached! Everyone gets RM${activeTier.base}.`;
    }

    // Show live/fallback badge
    const sourceBadge = document.getElementById('jacket-source-badge');
    if (sourceBadge) {
        sourceBadge.textContent = source === 'live' ? '● Live' : source === 'cache' ? '● Updated recently' : '● Estimated';
        sourceBadge.className   = source === 'live'
            ? 'text-xs font-semibold text-green-600'
            : 'text-xs font-semibold text-gray-400';
    }


    // -------------------------------------------------------------------------
    // B. PRICE CHART
    // -------------------------------------------------------------------------
    const tableBody = document.getElementById('jacket-price-table-body');

    if (tableBody) {
        tableBody.innerHTML = '';

        d.priceTiers.forEach(tier => {
            const isGoal = !!tier.goalTier;
            tableBody.insertAdjacentHTML('beforeend', `
                <tr class="${isGoal ? 'bg-maroon text-white font-bold' : 'bg-white text-main'} border-b border-gray-100">
                    <td class="px-6 py-4 text-sm">${tier.range} orders
                        ${isGoal ? '<span class="ml-2 text-[10px] uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full">Goal</span>' : ''}
                    </td>
                    <td class="px-6 py-4 text-sm font-black">RM${tier.base}</td>
                    <td class="px-6 py-4 text-sm">RM${tier.withName}</td>
                </tr>
            `);
        });
    }


    // -------------------------------------------------------------------------
    // C2. SPECIAL GROUP DISCOUNT  (CTA scroll handled by static href in HTML)
    // -------------------------------------------------------------------------
    if (d.groupDiscount) {
        setText('jacket-group-title',   d.groupDiscount.title);
        setText('jacket-group-desc',    d.groupDiscount.description);
        setText('jacket-group-faqhint', d.groupDiscount.faqHint);
    }


    // -------------------------------------------------------------------------
    // C3. SALE-ENDS COUNTDOWN  (date + days-left derived from d.deadline)
    // -------------------------------------------------------------------------
    if (d.countdown) {
        const daysLeft = Math.max(0, Math.ceil((new Date(d.deadline) - new Date()) / 86400000));
        const countdownWeekday = new Date(d.deadline).toLocaleDateString('en-MY', { weekday: 'long' });
        setText('jacket-countdown-prefix', d.countdown.prefix);
        setText('jacket-countdown-date',   `${countdownWeekday}, ${formatOrdinalDate(d.deadline)}`);
        setText('jacket-countdown-days',   d.countdown.urgency.replace('{days}', String(daysLeft)));
        setLink('jacket-countdown-cta',    d.formUrl);
    }


    // -------------------------------------------------------------------------
    // D. HOW IT WORKS
    // -------------------------------------------------------------------------
    const howContainer = document.getElementById('jacket-how-container');

    if (howContainer) {
        howContainer.innerHTML = '';

        d.howItWorks.forEach(item => {
            howContainer.insertAdjacentHTML('beforeend', `
                <div class="border-custom rounded-[2rem] p-8 bg-white flex flex-col gap-4">
                    <span class="text-4xl font-black text-maroon/20 leading-none">${item.step}</span>
                    <h4 class="font-bold text-main">${item.heading}</h4>
                    <p class="text-sm text-gray-500 leading-relaxed">${item.body}</p>
                </div>
            `);
        });
    }


    // -------------------------------------------------------------------------
    // E. TRY-IT-ON
    // -------------------------------------------------------------------------
    setText('jacket-tryon-week',        d.tryItOn.week);
    setText('jacket-tryon-location',    d.tryItOn.location);
    setText('jacket-tryon-hours',       d.tryItOn.hours);
    setText('jacket-tryon-description', d.tryItOn.description);


    // -------------------------------------------------------------------------
    // F. SIZE CHART
    // -------------------------------------------------------------------------
    const sizeImg = document.getElementById('jacket-size-chart-img');
    if (sizeImg) {
        setImage('jacket-size-chart-img', d.sizeChartImage);
        initSizeZoom('jacket-size-chart-img');
    }


    // -------------------------------------------------------------------------
    // G. PRE-ORDER (link-out) — Try-It-On CTA points at the Google Form,
    //    same as the hero/footer/sticky CTAs. No on-page embed.
    // -------------------------------------------------------------------------
    setLink('jacket-hero-cta-tryon', d.formUrl);


    // -------------------------------------------------------------------------
    // H. FAQ ACCORDION
    // -------------------------------------------------------------------------
    const faqContainer = document.getElementById('jacket-faq-container');

    if (faqContainer) {
        faqContainer.innerHTML = '';

        d.faq.forEach((item, index) => {
            faqContainer.insertAdjacentHTML('beforeend', `
                <div class="border-b-custom">
                    <button onclick="toggleJacketFaq(${index})"
                            class="w-full py-5 sm:py-6 flex justify-between items-center text-left focus:outline-none group">
                        <span class="text-base sm:text-lg font-bold group-hover:text-maroon transition-colors pr-4 sm:pr-6">
                            ${item.question}
                        </span>
                        <div class="shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-100 flex items-center justify-center
                                    group-hover:bg-maroon/10 transition-colors">
                            <svg id="jacket-faq-icon-${index}"
                                 class="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-maroon transition-transform duration-300"
                                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </div>
                    </button>
                    <div id="jacket-faq-answer-${index}"
                         class="grid grid-rows-[0fr] opacity-0 transition-all duration-500 ease-in-out">
                        <div class="overflow-hidden">
                            <p class="pb-6 sm:pb-8 text-sm md:text-base text-gray-500 leading-relaxed pr-4 md:pr-12">
                                ${item.answer}
                            </p>
                        </div>
                    </div>
                </div>
            `);
        });
    }


    // -------------------------------------------------------------------------
    // I. DEADLINE FOOTER + STICKY BAR
    // -------------------------------------------------------------------------
    setText('jacket-footer-deadline', deadlineDate);
    setLink('jacket-footer-cta',      d.formUrl);
    setLink('jacket-sticky-cta',      d.formUrl);
    setText('jacket-sticky-deadline', deadlineDate);

});
