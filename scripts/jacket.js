// ============================================================================
// jacket.js — JACKET SALE PAGE
// ============================================================================
// Fills the Jacket Sale page from siteContent.jacketSale (content.js).
// Follows the same pattern as every other page script: one DOMContentLoaded
// handler, guard on siteContent, then build/fill the markup.
// Helpers setText / setImage / setLink are defined in script.js.
//
// Sections built here:
//   A. Hero            — title, tagline, price tag, design carousel, CTA
//   B. Progress tracker— live CSV fetch with cache + graceful fallback
//   C. Price chart     — table with goal-tier highlighted
//   D. How it works    — four step cards from config
//   E. Try-it-on       — booth details from config
//   F. Size chart      — tap-to-zoom image
//   G. Pre-order form  — iframe embed + fallback link
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
    if (!d.sheetCsvUrl || d.sheetCsvUrl.startsWith('<')) {
        return { count: d.currentOrdersFallback, source: 'fallback' };
    }

    try {
        const res  = await fetch(d.sheetCsvUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();
        const count = Math.max(0, text.trim().split('\n').slice(1).filter(r => r.trim()).length);
        // Write cache
        sessionStorage.setItem(CACHE_KEY, JSON.stringify({ count, timestamp: now }));
        return { count, source: 'live' };
    } catch (err) {
        console.warn('jacket.js: CSV fetch failed, using fallback.', err);
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
// MAIN
// ============================================================================
document.addEventListener('DOMContentLoaded', async () => {

    // Guard: bail if content.js didn't load.
    if (typeof siteContent === 'undefined' || !siteContent.jacketSale) {
        console.error('jacket.js: siteContent.jacketSale not found — is content.js loaded first?');
        return;
    }

    const d = siteContent.jacketSale;

    const deadlineDate = new Date(d.deadline)
        .toLocaleDateString('en-MY', { day: 'numeric', month: 'long', year: 'numeric' });


    // -------------------------------------------------------------------------
    // A. HERO
    // -------------------------------------------------------------------------
    setText('jacket-hero-title',   d.title);
    setText('jacket-hero-tagline', d.tagline);
    setText('jacket-hero-price',   d.priceTag);
    setLink('jacket-hero-cta',     d.formUrl);

    const carouselTrack = document.getElementById('jacket-carousel-track');
    const carouselDots  = document.getElementById('jacket-carousel-dots');

    if (carouselTrack && d.designImages.length > 0) {
        carouselTrack.innerHTML = '';
        if (carouselDots) carouselDots.innerHTML = '';

        const totalImages = d.designImages.length;
        let currentIndex = 0;
        let isTransitioning = false;

        // 1. Initialize with the first image cleanly
        carouselTrack.innerHTML = `
            <div class="w-full h-full">
                <img id="jacket-active-img" src="${d.designImages[0].src}" alt="${d.designImages[0].alt}" 
                     loading="eager" class="w-full h-full object-cover rounded-[2rem] block">
            </div>
        `;

        // 2. Build dots navigation safely
        if (carouselDots && totalImages > 1) {
            d.designImages.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.dataset.slide = i;
                dot.setAttribute('aria-label', `View image ${i + 1}`);
                dot.className = `w-2 h-2 rounded-full transition-all duration-300 ${i === 0 ? 'bg-maroon w-5' : 'bg-gray-300'}`;
                dot.addEventListener('click', () => {
                    if (i !== currentIndex) transitionToImage(i, i > currentIndex ? 'next' : 'prev');
                });
                carouselDots.appendChild(dot);
            });
        }

        // 3. Update active dot visibility
        function updateDots(activeIdx) {
            document.querySelectorAll('[data-slide]').forEach((dot, i) => {
                dot.className = `w-2 h-2 rounded-full transition-all duration-300 ${i === activeIdx ? 'bg-maroon w-5' : 'bg-gray-300'}`;
            });
        }

        // 4. Perfect Slide-and-Swap Transition Engine
        function transitionToImage(targetIdx, direction = 'next') {
            if (isTransitioning) return;
            isTransitioning = true;

            const activeImg = document.getElementById('jacket-active-img');
            if (!activeImg) return;

            // Step A: Slide the active frame completely out of view
            carouselTrack.style.transition = 'transform 250ms ease-in-out';
            carouselTrack.style.transform = direction === 'next' ? 'translateX(-100%)' : 'translateX(100%)';

            setTimeout(() => {
                // Step B: While hidden, instantly swap the image file source path
                currentIndex = targetIdx;
                activeImg.src = d.designImages[currentIndex].src;
                activeImg.alt = d.designImages[currentIndex].alt;
                updateDots(currentIndex);

                // Step C: Teleport the frame instantly to the opposite side out of view
                carouselTrack.style.transition = 'none';
                carouselTrack.style.transform = direction === 'next' ? 'translateX(100%)' : 'translateX(-100%)';

                // Force layout reflow execution
                carouselTrack.offsetHeight;

                // Step D: Slide the newly updated image smoothly back to center center position
                carouselTrack.style.transition = 'transform 250ms ease-in-out';
                carouselTrack.style.transform = 'translateX(0%)';

                setTimeout(() => {
                    isTransitioning = false;
                }, 250);

            }, 250);
        }

        // Navigation controls handlers
        function handleNext() {
            let nextIdx = currentIndex + 1;
            if (nextIdx >= totalImages) nextIdx = 0;
            transitionToImage(nextIdx, 'next');
        }

        function handlePrev() {
            let prevIdx = currentIndex - 1;
            if (prevIdx < 0) prevIdx = totalImages - 1;
            transitionToImage(prevIdx, 'prev');
        }

        // Wire up HTML controls safely
        const prevBtn = document.getElementById('jacket-carousel-prev');
        const nextBtn = document.getElementById('jacket-carousel-next');
        if (prevBtn) prevBtn.addEventListener('click', handlePrev);
        if (nextBtn) nextBtn.addEventListener('click', handleNext);

        // Auto play looping timer (advances every 4 seconds)
        if (totalImages > 1) {
            setInterval(handleNext, 4000);
        }
    }

    // -------------------------------------------------------------------------
    // B. PROGRESS TRACKER
    // -------------------------------------------------------------------------
    const { count: currentOrders, source } = await fetchOrderCount(d);

    const activeTier = d.priceTiers.find(t => t.goalTier) || d.priceTiers[d.priceTiers.length - 1];
    const progress   = Math.min((currentOrders / d.orderGoal) * 100, 100);
    const toGo       = Math.max(0, d.orderGoal - currentOrders);

    setText('jacket-order-count', String(currentOrders));
    setText('jacket-order-goal',  String(d.orderGoal));

    const bar = document.getElementById('jacket-progress-bar');
    if (bar) bar.style.width = `${progress}%`;

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
    // C. PRICE CHART
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
    // G. PRE-ORDER FORM EMBED
    // -------------------------------------------------------------------------
    const formFrame    = document.getElementById('jacket-form-frame');
    const formFallback = document.getElementById('jacket-form-fallback');

    if (formFrame && d.formEmbedUrl && !d.formEmbedUrl.startsWith('<')) {
        formFrame.src = d.formEmbedUrl;
    } else if (formFrame) {
        // Hide iframe and show fallback link if embed URL not set
        formFrame.closest('div')?.classList.add('hidden');
    }

    if (formFallback) setLink('jacket-form-fallback', d.formUrl);


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
