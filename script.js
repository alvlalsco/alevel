// ==========================================
// 1. Function to load Nav and Footer
// ==========================================
async function loadComponent(elementId, filePath) {
    try {
        const response = await fetch(filePath);
        if (response.ok) {
            const content = await response.text();
            document.getElementById(elementId).innerHTML = content;
        } else {
            console.error(`Error loading ${filePath}: ${response.status}`);
        }
    } catch (error) {
        console.error(`Error fetching ${filePath}:`, error);
    }
}

// ==========================================
// 2. Function to Update all Site Content
// ==========================================
function updateSiteContent() {
    // Helper to set text content
    const setText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    };

    // Helper to set image source
    const setImage = (id, src) => {
        const el = document.getElementById(id);
        if (el) el.src = src;
    };

    // Helper to set link href
    const setLink = (id, url) => {
        const el = document.getElementById(id);
        if (el) el.href = url;
    };

    // New helper function for background images
    function setBackgroundImage(elementId, imageUrl) {
        const el = document.getElementById(elementId);
        if (el && imageUrl) {
            el.style.backgroundImage = `url('${imageUrl}')`;
        }
    };

    function getDepartmentColor(department) {
        let deptColorClass = "bg-red-100 text-red-700";
        const dept = department.toLowerCase();
        if (dept.includes("leadership")) deptColorClass = "bg-red-100 text-red-700";
        else if (dept.includes("welfare")) deptColorClass = "bg-blue-100 text-blue-700";
        else if (dept.includes("relations")) deptColorClass = "bg-pink-100 text-pink-700";
        else if (dept.includes("comserve") || dept.includes("community")) deptColorClass = "bg-green-100 text-green-700";
        else if (dept.includes("sst") || dept.includes("secretaries")) deptColorClass = "bg-amber-100 text-amber-700";
        return deptColorClass
    }
    // ==========================================
    // 1. HERO PAGE
    // ==========================================

    //  A. HERO SECTION
    setBackgroundImage("hero-background", siteContent.index.hero.image);
    setText("hero-desc", siteContent.index.hero.description);
    setLink("hero-handbook-btn", siteContent.index.hero.handbook_pdf);
    setLink("hero-trailer-btn", siteContent.index.hero.trailer_link);

    //  B. AFFILIATES 
    const affiliateContainer = document.getElementById("affiliates-grid");
    if (affiliateContainer && siteContent.index.affiliates) {
        // Clear any existing content first
        affiliateContainer.innerHTML = "";

        siteContent.index.affiliates.forEach(partner => {
            // Create the container for one affiliate
            const wrapper = document.createElement("div");
            wrapper.className = "flex flex-col items-center gap-3 group min-w-[120px]";

            // Create the image
            const img = document.createElement("img");
            img.src = partner.image;
            img.alt = partner.name;
            // Style: Grayscale by default, color on hover (modern effect)
            img.className = "w-20 h-20 md:w-auto md:h-44 object-contain opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 filter grayscale group-hover:grayscale-0";

            // Create the name text
            const name = document.createElement("span");
            name.textContent = partner.name;
            name.className = "text-xs md:text-sm font-bold text-gray-500 group-hover:primary-maroon transition-colors uppercase tracking-wider text-center";

            // Append them
            wrapper.appendChild(img);
            wrapper.appendChild(name);
            affiliateContainer.appendChild(wrapper);
        });
    }

    // --- C. FEATURED EVENT CAROUSEL LOGIC ---
    const upcomingEvents = siteContent.eventsPage?.upcoming || [];
    let currentEventIndex = 0;
    let carouselTimer;
    let interactionTimeout;
    let isInteracting = false; // FIX: Track interaction state to prevent overlapping timers
    const carouselDelay = 5000; // 5 seconds per slide

    const cardEl = document.getElementById("featured-event-card");
    const wrapperEl = document.getElementById("carousel-wrapper");
    const imgContainer = document.getElementById("details-img-container");

    window.toggleEventInfo = function (event) {
        event.preventDefault();
        event.stopPropagation();

        temporarilyPauseCarousel();

        const mainImg = document.getElementById("event-img");
        const detailsImg = document.getElementById("event-details-img");

        if (detailsImg && mainImg) {
            if (detailsImg.classList.contains("opacity-0")) {
                detailsImg.classList.remove("opacity-0");
                detailsImg.classList.add("opacity-100");
                mainImg.classList.add("opacity-0");
            } else {
                detailsImg.classList.add("opacity-0");
                detailsImg.classList.remove("opacity-100");
                mainImg.classList.remove("opacity-0");
            }
        }
    };

    function renderFeaturedEvent(index) {
        if (!upcomingEvents || upcomingEvents.length === 0 || !cardEl) return;

        const eventData = upcomingEvents[index];

        // 1. Fade out
        cardEl.classList.remove("opacity-100");
        cardEl.classList.add("opacity-0");

        // 2. Wait for fade out to finish, then swap data
        setTimeout(() => {
            // Assume setImage, setText, and getDepartmentColor are globally defined elsewhere
            setImage("event-img", eventData.image);
            setImage("event-details-img", eventData.details_image);
            setText("event-title", eventData.title);

            const dateEl = document.getElementById("event-date");
            if (dateEl && eventData.date) {
                dateEl.textContent = eventData.date;
                dateEl.classList.remove("hidden");
            }

            const eventtypeEl = document.getElementById("event-type");
            if (eventtypeEl && eventData.event_type) {
                eventtypeEl.textContent = eventData.event_type;
                eventtypeEl.classList.remove("hidden");
            }

            const deptEl = document.getElementById("event-department");
            if (deptEl && eventData.department) {
                deptEl.textContent = eventData.department;
                deptEl.className = `shrink-0 px-2 py-1 md:px-5 md:py-3 rounded-full text-xs md:text-lg font-bold uppercase tracking-widest shadow-sm backdrop-blur-md bg-opacity-90 whitespace-nowrap hidden ${getDepartmentColor(eventData.department)}`;
                deptEl.classList.remove("hidden");
            } else if (deptEl) {
                deptEl.classList.add("hidden");
            }

            const igEl = document.getElementById("event-ig-link");
            if (igEl && eventData.instagram_link) {
                igEl.href = eventData.instagram_link;
                igEl.classList.remove("hidden");
            } else if (igEl) {
                igEl.classList.add("hidden");
            }

            const trlEl = document.getElementById("event-trailer-link");
            if (trlEl && eventData.trailer_link) {
                trlEl.href = eventData.trailer_link;
                trlEl.classList.remove("hidden");
            } else if (igEl) {
                trlEl.classList.add("hidden");
            }

            const eventBtn = document.getElementById("event-reg-btn");
            if (eventBtn) {
                const regLink = eventData.registration_link;
                if (regLink && regLink !== "#") {
                    eventBtn.href = regLink;
                    setText("event-reg-btn-text", "Register Now!");
                    eventBtn.classList.remove("cursor-not-allowed", "opacity-70");
                } else {
                    eventBtn.href = "#";
                    setText("event-reg-btn-text", "Coming Soon");
                    eventBtn.classList.add("cursor-not-allowed", "opacity-70");
                }
            }

            const detailsImg = document.getElementById("event-details-img");
            const mainImg = document.getElementById("event-img");
            if (detailsImg && mainImg) {
                detailsImg.classList.add("opacity-0");
                mainImg.classList.remove("opacity-0");
            }

            // 3. Fade back in
            cardEl.classList.remove("opacity-0");
            cardEl.classList.add("opacity-100");
        }, 500);
    }

    function nextSlide() {
        currentEventIndex = (currentEventIndex + 1) % upcomingEvents.length;
        renderFeaturedEvent(currentEventIndex);
    }

    function prevSlide() {
        currentEventIndex = (currentEventIndex - 1 + upcomingEvents.length) % upcomingEvents.length;
        renderFeaturedEvent(currentEventIndex);
    }

    // FIX: Improved 10-Second Pause Logic
    function temporarilyPauseCarousel() {
        clearInterval(carouselTimer);
        clearTimeout(interactionTimeout);
        isInteracting = true; // Lock the timer state

        interactionTimeout = setTimeout(() => {
            isInteracting = false; // Unlock state
            carouselTimer = setInterval(nextSlide, carouselDelay);
        }, 10000);
    }

    function triggerManualSlide(direction) {
        if (direction === 'next') nextSlide();
        if (direction === 'prev') prevSlide();
        temporarilyPauseCarousel();
    }

    // --- INITIALIZE CAROUSEL & EVENT LISTENERS ---
    if (upcomingEvents.length > 0) {
        renderFeaturedEvent(0);

        carouselTimer = setInterval(nextSlide, carouselDelay);

        if (wrapperEl) {
            wrapperEl.addEventListener('mouseenter', () => {
                clearInterval(carouselTimer);
                clearTimeout(interactionTimeout);
                isInteracting = false; // Reset lock if user manually hovers
            });

            wrapperEl.addEventListener('mouseleave', () => {
                // FIX: Only restart if we aren't currently serving a 10s interaction pause
                if (!isInteracting) {
                    clearInterval(carouselTimer);
                    carouselTimer = setInterval(nextSlide, carouselDelay);
                }
            });

            // FIX: Removed touchstart here to avoid double-firing with click on mobile browsers
            wrapperEl.addEventListener('click', temporarilyPauseCarousel);
        }

        document.getElementById("next-event-btn")?.addEventListener('click', (e) => {
            e.stopPropagation();
            triggerManualSlide('next');
        });

        document.getElementById("prev-event-btn")?.addEventListener('click', (e) => {
            e.stopPropagation();
            triggerManualSlide('prev');
        });

        // 4. Mobile: Swipe Gestures Navigation
        if (imgContainer) {
            imgContainer.style.cursor = 'default';
            let touchStartX = 0;
            let touchStartY = 0; // FIX: Added Y tracking
            let touchEndX = 0;
            let touchEndY = 0;   // FIX: Added Y tracking

            imgContainer.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
                touchStartY = e.changedTouches[0].screenY;
            }, { passive: true });

            imgContainer.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                touchEndY = e.changedTouches[0].screenY;
                handleSwipe();
            }, { passive: true });

            function handleSwipe() {
                const deltaX = touchEndX - touchStartX;
                const deltaY = touchEndY - touchStartY;
                const swipeThreshold = 50;

                // FIX: Ignore swipe if vertical scrolling is dominant over horizontal
                if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > swipeThreshold) {
                    if (deltaX < 0) {
                        triggerManualSlide('next');
                    } else {
                        triggerManualSlide('prev');
                    }
                }
            }
        }
    } else {
        if (wrapperEl) wrapperEl.style.display = "none";
    }


    //Publications
    const allPublications = siteContent.publicationPage.publications;
    const newsContainer = document.getElementById('latest-newsletter-container')
    const postContainer = document.getElementById('latest-post-container')

    // 2. Find the latest of each category 
    // .find() stops at the first match it sees, so it grabs the newest one!
    const latestNewsletter = allPublications.find(item => item.category === 'newsletter');
    const latestPost = allPublications.find(item => item.category === 'post');

    // 3. Reusable function to generate the card HTML
    function generateCardHTML(item) {
        if (!item) return ''; // Fallback if data is missing

        const link = item.pdf_link || '#';
        const target = link !== '#' ? '_blank' : '_self';
        const isDisabled = link === '#';

        // Note: Assuming getDepartmentColor() is defined elsewhere in your scripts
        return `
        <div class="flex flex-col gap-3">
            
            <div class="flex flex-row flex-nowrap gap-2 md:gap-3 items-center justify-start w-full overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-1">
                ${item.department ? `<span class="shrink-0 px-2 py-1 md:px-3 md:py-2 rounded-full text-xs md:text-base font-bold uppercase tracking-widest shadow-sm backdrop-blur-md ${getDepartmentColor(item.department)} bg-opacity-90 whitespace-nowrap" style="font-size: 10px;">${item.department}</span>` : ''}
                
                ${item.instagram_link ? `
                <a href="${item.instagram_link}" target="_blank" aria-label="View on Instagram"
                    class="shrink-0 bg-[#E1306C] text-white p-2 md:p-2.5 rounded-full transition-all duration-300 lg:hover:scale-110 lg:hover:shadow-lg">
                    <svg class="w-4 h-4 md:w-5 md:h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                </a>
                ` : ''}  
            </div>

            <div class="relative block rounded-3xl overflow-hidden shadow-lg border border-gray-200 group">
                <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover">

                <div class="absolute inset-0 z-20 flex items-center justify-center transition-all duration-500 bg-black/0 lg:group-hover:bg-black/30 pointer-events-none">
                    <a href="${link}" target="${target}" 
                        class="pointer-events-auto text-white font-bold bg-black/10 lg:bg-transparent lg:hover:bg-white lg:hover:text-black tracking-[0.2em] uppercase opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-500 transform lg:translate-y-4 lg:group-hover:translate-y-0 border-2 border-white px-4 py-1.5 md:px-6 md:py-2.5 rounded-full backdrop-blur-sm ${isDisabled ? 'cursor-not-allowed hover:bg-transparent hover:text-white' : ''}" style="font-size: 11px;">
                        ${isDisabled ? 'Coming Soon' : item.button_text}
                    </a>
                </div>
            </div>
            
            <h4 class="text-base md:text-lg font-bold mt-1 text-main text-center">${item.title}</h4>
        </div>
        `;
    }

    // 4. Inject into the DOM
    if (newsContainer && postContainer && latestNewsletter && latestPost) {
        newsContainer.innerHTML = generateCardHTML(latestNewsletter)
        postContainer.innerHTML = generateCardHTML(latestPost)
    }

    //  E. FAQ SECTION
    const faqContainer = document.getElementById("faq-accordion-container");

    // Make sure the container and the data actually exist
    if (faqContainer && siteContent.index && siteContent.index.faq) {
        faqContainer.innerHTML = ""; // Clear the loading text

        siteContent.index.faq.forEach((item, index) => {
            // Build the HTML for each row
            const faqHTML = `
                <div class="border-b-2 border-[#d1d5db]">
                    <button 
                        onclick="toggleFaq(${index})" 
                        class="w-full py-6 flex justify-between items-center text-left focus:outline-none group">
                        
                        <span class="text-lg font-bold group-hover:text-maroon transition-colors pr-6">
                            ${item.question}
                        </span>
                        
                        <div class="shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                            <svg id="faq-icon-${index}" class="w-5 h-5 text-gray-600 group-hover:text-maroon transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </div>
                    </button>
                    
                    <div id="faq-answer-${index}" class="grid grid-rows-[0fr] opacity-0 transition-all duration-500 ease-in-out">
                        <div class="overflow-hidden">
                            <p class="pb-8 text-gray-600 leading-relaxed pr-4 md:pr-12">
                                ${item.answer}
                            </p>
                        </div>
                    </div>
                </div>
            `;
            faqContainer.insertAdjacentHTML('beforeend', faqHTML);
        });
    }

    // ==========================================
    // 2. ABOUT PAGE
    // ==========================================
    setText("about-mission-p1", siteContent.about.missionp1);
    setText("about-mission-p2", siteContent.about.missionp2);
    setText("about-representation", siteContent.about.representation);
    setText("about-development", siteContent.about.development);
    setText("about-welfare", siteContent.about.welfare);

    // ==========================================
    // 3. COMMITTEE PAGE
    // ==========================================

    // --- Mobile Interaction Logic ---
    // --- Mobile Interaction & Collision Logic ---
    window.toggleQuote = function (event, btn) {
        event.stopPropagation();
        const popup = btn.nextElementSibling;
        const arrow = popup.querySelector('.popup-arrow');
        // Get the parent card container
        const card = btn.closest('.group\\/card');
        const isVisible = popup.classList.contains('opacity-100');

        // Hide all other open popups first
        document.querySelectorAll('.quote-popup').forEach(p => {
            p.classList.remove('opacity-100', 'scale-100');
            p.classList.add('opacity-0', 'scale-95');
        });

        if (!isVisible) {

            // Mobile Collision Detection
            if (window.innerWidth < 768 && card && popup && arrow) {
                // Measure where the card is physically located on the screen
                const rect = card.getBoundingClientRect();
                const cardCenter = rect.left + rect.width / 2;
                const screenCenter = window.innerWidth / 2;
                const threshold = 30; // Pixel margin to consider a card "centered"

                // 1. Strip ALL mobile positioning classes first to start with a blank slate
                popup.classList.remove(
                    'top-full', 'left-1/2', '-translate-x-1/2', 'mt-4',
                    'top-1/2', 'left-[90%]', '-translate-y-1/2', 'translate-x-2.5',
                    'right-[90%]', '-translate-x-2.5', 'left-auto'
                );

                arrow.classList.remove(
                    '-top-2', 'left-1/2', '-translate-x-1/2', 'border-t', 'border-l',
                    '-left-2', 'top-1/2', '-translate-y-1/2', 'border-b',
                    '-right-2', 'border-r', 'left-auto'
                );

                // 2. Apply classes based on screen position
                if (Math.abs(cardCenter - screenCenter) < threshold) {
                    // Centered (1 person row) -> Pop to Bottom
                    popup.classList.add('top-full', 'left-1/2', '-translate-x-1/2', 'mt-4');
                    arrow.classList.add('-top-2', 'left-1/2', '-translate-x-1/2', 'border-t', 'border-l');

                } else if (cardCenter < screenCenter) {
                    // Left person -> Pop to Right
                    popup.classList.add('top-1/2', 'left-[90%]', '-translate-y-1/2', 'translate-x-2.5');
                    arrow.classList.add('-left-2', 'top-1/2', '-translate-y-1/2', 'border-b', 'border-l');

                } else {
                    // Right person -> Pop to Left
                    popup.classList.add('top-1/2', 'right-[90%]', '-translate-y-1/2', '-translate-x-2.5', 'left-auto');
                    arrow.classList.add('-right-2', 'top-1/2', '-translate-y-1/2', 'border-t', 'border-r', 'left-auto');
                }
            }

            // Finally, reveal the popup
            popup.classList.remove('opacity-0', 'scale-95');
            popup.classList.add('opacity-100', 'scale-100');
        }
    };

    window.toggleDeptImg = function (event, btn) {
        event.preventDefault();
        const container = btn.closest('.relative');
        const playful = container.querySelector('.playful-img');
        const formal = container.querySelector('.formal-img');

        if (playful.classList.contains('opacity-0')) {
            playful.classList.remove('opacity-0');
            playful.classList.add('opacity-100');
            formal.classList.add('opacity-0');
        } else {
            playful.classList.add('opacity-0');
            playful.classList.remove('opacity-100');
            formal.classList.remove('opacity-0');
        }
    };

    document.addEventListener('click', () => {
        document.querySelectorAll('.quote-popup').forEach(p => {
            p.classList.remove('opacity-100', 'scale-100');
            p.classList.add('opacity-0', 'scale-95');
        });
    });

    // --- Collision Detection for Desktop Popups ---
    // This flips the popup to the left side if it goes off the right edge of the screen
    window.checkPopupBounds = function (card) {
        if (window.innerWidth < 768) return; // Skip on mobile (handled by bottom popups)

        const popup = card.querySelector('.quote-popup');
        const arrow = card.querySelector('.popup-arrow');
        if (!popup || !arrow) return;

        // 1. Reset to default (Right side)
        popup.classList.remove('md:right-[90%]', 'md:-translate-x-2.5', 'md:left-auto');
        popup.classList.add('md:left-[90%]', 'md:translate-x-2.5');

        arrow.classList.remove('md:-right-2', 'md:left-auto', 'md:border-t', 'md:border-r');
        arrow.classList.add('md:-left-2', 'md:border-b', 'md:border-l');

        // 2. Measure the bounding box
        const rect = popup.getBoundingClientRect();

        // 3. Flip to Left Side if it overflows the window width (with a 20px safety margin)
        if (rect.right > window.innerWidth - 20) {
            popup.classList.remove('md:left-[90%]', 'md:translate-x-2.5');
            popup.classList.add('md:right-[90%]', 'md:-translate-x-2.5', 'md:left-auto');

            arrow.classList.remove('md:-left-2', 'md:border-b', 'md:border-l');
            arrow.classList.add('md:-right-2', 'md:left-auto', 'md:border-t', 'md:border-r');
        }
    };

    const hcContainer = document.getElementById("high-council-tree");
    const deptRoster = document.getElementById("dept-roster");
    if (hcContainer && siteContent.committee) {

        // --- 1. RENDER HIGH COUNCIL (The Pyramid) ---
        const hc = siteContent.committee.highCouncil;

        const createCard = (member, size = "normal") => {
            const card = document.createElement("div");

            // ADDED onmouseenter EVENT HERE
            card.className = "flex flex-col items-center text-center group/card w-40 sm:w-48 md:w-64";
            card.setAttribute("onmouseenter", "checkPopupBounds(this)");

            const imgSize = size === "large"
                ? "w-40 h-40 md:w-52 md:h-52"
                : "w-32 h-32 md:w-40 md:h-40";

            const userQuote = member.quote || "Dedicated to serving the A-Level Student Committee";

            card.innerHTML = `
                    <div class="relative mb-4">
                        
                        <div class="${imgSize} rounded-full overflow-hidden border-4 border-gray-100 md:group-hover/card:border-maroon md:group-hover/card:shadow-[0_0_20px_rgba(136,17,59,0.3)] transition-all duration-300 p-1 bg-white relative z-30">
                            <img src="${member.image}" class="w-full h-full object-cover object-top rounded-full" loading="lazy">
                        </div>

                        <button onclick="toggleQuote(event, this)" class="md:hidden absolute bottom-0 right-0 md:right-2 bg-white border border-gray-200 text-maroon rounded-full w-9 h-9 flex items-center justify-center shadow-lg z-50 active:scale-95 transition-transform">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>
                        </button>

                        <div class="quote-popup absolute top-full left-1/2 -translate-x-1/2 mt-4 md:mt-0 md:top-1/2 md:left-[90%] md:-translate-y-1/2 w-44 sm:w-max min-w-44 sm:min-w-48 max-w-[50vw] sm:max-w-xs bg-white/95 backdrop-blur-sm p-2 rounded-2xl shadow-[0_8px_30px_rgba(136,17,59,0.15)] border border-maroon/10 z-40 opacity-0 md:group-hover/card:opacity-100 transition-all duration-300 ease-out transform scale-95 md:translate-x-2.5 md:group-hover/card:translate-x-0 md:group-hover/card:scale-100 pointer-events-none">
                            
                            <div class="popup-arrow absolute -top-2 left-1/2 -translate-x-1/2 md:top-1/2 md:-left-2 md:-translate-y-1/2 md:translate-x-0 w-4 h-4 bg-white/95 transform rotate-45 border-t border-l md:border-t-0 md:border-b md:border-l border-maroon/10"></div>
                            
                            <span class="absolute top-2 left-3 text-maroon/20 text-4xl font-serif leading-none -z-10"></span>
                            
                            <p class="text-maroon text-sm font-medium italic leading-relaxed relative z-10 pl-2">
                                "${userQuote}"
                            </p>
                        </div>
                    </div>

                    <h4 class="font-bold text-lg leading-tight text-main mt-2">${member.name}</h4>
                    <p class="text-xs font-bold text-maroon uppercase tracking-widest mt-1">${member.role}</p>
                `;
            return card;
        };

        const row1 = document.createElement("div");
        row1.className = "flex justify-center w-full relative";
        row1.innerHTML = `<div class="absolute -bottom-6 left-1/2 w-0.5 h-6 bg-gray-300"></div>`;
        if (hc[0]) row1.appendChild(createCard(hc[0], "large"));
        hcContainer.appendChild(row1);

        const row2 = document.createElement("div");
        row2.className = "flex justify-center gap-12 md:gap-24 w-full relative pt-2";
        row2.innerHTML = `<div class="absolute -top-2 left-1/2 -translate-x-1/2 w-1/2 h-4 border-t-2 border-x-2 border-gray-300 rounded-t-xl"></div>`;
        if (hc[1]) row2.appendChild(createCard(hc[1]));
        if (hc[2]) row2.appendChild(createCard(hc[2]));
        hcContainer.appendChild(row2);

        const row3 = document.createElement("div");
        row3.className = "flex flex-wrap justify-center gap-8 md:gap-16 w-full pt-6 border-t-2 border-gray-200 mt-4";
        if (hc[3]) row3.appendChild(createCard(hc[3]));
        if (hc[4]) row3.appendChild(createCard(hc[4]));
        if (hc[5]) row3.appendChild(createCard(hc[5]));
        hcContainer.appendChild(row3);


        // --- 2. RENDER DEPARTMENTS ---
        deptRoster.innerHTML = "";
        siteContent.committee.departments.forEach(dept => {
            const section = document.createElement("div");

            let html = `
                    <div class="flex items-center gap-4 mb-10 justify-center">
                        <div class="h-0.5 w-12 bg-gray-300"></div>
                        <h3 class="text-2xl font-black uppercase tracking-tight text-main">${dept.name}</h3>
                        <div class="h-0.5 w-12 bg-gray-300"></div>
                    </div>
                    
                    <div class="flex flex-wrap justify-center gap-12 mb-12">`;

            if (dept.leaders && dept.leaders.length > 0) {
                dept.leaders.forEach(leader => {
                    const userQuote = leader.quote || "Dedicated to serving the A-Level Student Committee";

                    // ADDED onmouseenter AND updated w-52 AND popup-arrow
                    html += `
                            <div class="flex flex-col items-center text-center group/card w-48 md:w-64" onmouseenter="checkPopupBounds(this)">
                                <div class="relative mb-4">
                                    <div class="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-gray-200 md:group-hover/card:border-maroon md:group-hover/card:shadow-[0_0_15px_rgba(136,17,59,0.4)] transition-all duration-300 p-1 bg-white relative z-10">
                                        <img src="${leader.image}" class="w-full h-full object-cover object-top rounded-full" loading="lazy">
                                    </div>

                                    <button onclick="toggleQuote(event, this)" class="md:hidden absolute bottom-0 right-0 md:right-2 bg-white border border-gray-200 text-maroon rounded-full w-9 h-9 flex items-center justify-center shadow-lg z-50 active:scale-95 transition-transform">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>
                                    </button>

                                    <div class="quote-popup absolute top-full left-1/2 -translate-x-1/2 mt-4 md:mt-0 md:top-1/2 md:left-[90%] md:-translate-y-1/2 w-max min-w-48 max-w-xs bg-white/95 backdrop-blur-sm p-5 rounded-2xl shadow-[0_8px_30px_rgba(136,17,59,0.15)] border border-maroon/10 z-40 opacity-0 md:group-hover/card:opacity-100 transition-all duration-300 ease-out transform scale-95 md:translate-x-2.5 md:group-hover/card:translate-x-0 md:group-hover/card:scale-100 pointer-events-none">
                                        
                                        <div class="popup-arrow absolute -top-2 left-1/2 -translate-x-1/2 md:top-1/2 md:-left-2 md:-translate-y-1/2 md:translate-x-0 w-4 h-4 bg-white/95 transform rotate-45 border-t border-l md:border-t-0 md:border-b md:border-l border-maroon/10"></div>
                                        
                                        <span class="absolute top-2 left-3 text-maroon/20 text-4xl font-serif leading-none -z-10"></span>
                                        
                                        <p class="text-maroon text-sm font-medium italic leading-relaxed relative z-10 pl-2">
                                            "${userQuote}"
                                        </p>
                                    </div>
                                </div>
                                <h4 class="font-bold text-lg leading-tight text-main">${leader.name}</h4>
                                <p class="text-xs font-bold text-maroon uppercase tracking-widest mt-1">${leader.role}</p>
                            </div>`;
                });
            };
            html += `</div>`;

            if (dept.members && dept.members.length > 0) {
                html += `<div class="flex flex-wrap justify-center gap-x-8 gap-y-12 max-w-6xl mx-auto">`;

                dept.members.forEach(member => {
                    const userQuote = member.quote || "Dedicated to serving the A-Level Student Committee";

                    // ADDED onmouseenter AND updated w-52 AND popup-arrow
                    html += `
                        <div class="flex flex-col items-center text-center group/card w-48 md:w-64" onmouseenter="checkPopupBounds(this)">
                            <div class="relative mb-4">
                                <div class="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-gray-200 md:group-hover/card:border-maroon md:group-hover/card:shadow-[0_0_15px_rgba(136,17,59,0.4)] transition-all duration-300 p-1 bg-white relative z-10">
                                    <img src="${member.image}" class="w-full h-full object-cover object-top rounded-full" loading="lazy">
                                </div>
                                
                                <button onclick="toggleQuote(event, this)" class="md:hidden absolute bottom-0 right-0 md:right-2 bg-white border border-gray-200 text-maroon rounded-full w-9 h-9 flex items-center justify-center shadow-lg z-50 active:scale-95 transition-transform">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>
                                </button>

                                <div class="quote-popup absolute top-full left-1/2 -translate-x-1/2 mt-4 md:mt-0 md:top-1/2 md:left-[90%] md:-translate-y-1/2 w-max min-w-48 max-w-xs bg-white/95 backdrop-blur-sm p-5 rounded-2xl shadow-[0_8px_30px_rgba(136,17,59,0.15)] border border-maroon/10 z-40 opacity-0 md:group-hover/card:opacity-100 transition-all duration-300 ease-out transform scale-95 md:translate-x-2.5 md:group-hover/card:translate-x-0 md:group-hover/card:scale-100 pointer-events-none">
                            
                                    <div class="popup-arrow absolute -top-2 left-1/2 -translate-x-1/2 md:top-1/2 md:-left-2 md:-translate-y-1/2 md:translate-x-0 w-4 h-4 bg-white/95 transform rotate-45 border-t border-l md:border-t-0 md:border-b md:border-l border-maroon/10"></div>
                                    
                                    <span class="absolute top-2 left-3 text-maroon/20 text-4xl font-serif leading-none -z-10"></span>
                                    
                                    <p class="text-maroon text-sm font-medium italic leading-relaxed relative z-10 pl-2">
                                        "${userQuote}"
                                    </p>
                                </div>
                            </div>
                            <h4 class="font-bold text-lg leading-tight text-main">${member.name}</h4>
                            <p class="text-xs font-bold text-maroon uppercase tracking-widest mt-1">${member.role}</p>
                        </div>`;
                });

                html += `</div>`;
            }

            section.innerHTML = html;
            deptRoster.appendChild(section);
        });

        // --- CORE STRUCTURE (Committee Page) ---
        const deptContainer = document.getElementById("departments-container");
        if (deptContainer && siteContent.committee && siteContent.committee.coreStructure) {
            deptContainer.innerHTML = "";

            siteContent.committee.coreStructure.forEach(dept => {
                const igHTML = dept.ig_link ? `
                        <a href="${dept.ig_link}" target="_blank" class="mt-6 inline-flex w-fit items-center gap-2 text-maroon hover:text-[#E1306C] font-bold transition-colors group/link">
                            <svg class="w-5 h-5 transform group-hover/link:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                <path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clip-rule="evenodd" />
                            </svg>
                            Follow ${dept.title}
                        </a>
                    ` : '';

                const cardHTML = `
                        <div class="border-custom bg-white overflow-hidden rounded-2xl flex flex-col shadow-sm hover:shadow-md transition-shadow group/dept">
                            
                            <div class="relative w-full aspect-5/4 bg-gray-100 overflow-hidden">
                                
                                <img src="${dept.image}" alt="${dept.title} Formal" loading="lazy"
                                    class="formal-img absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-600 md:group-hover/dept:opacity-0">
                                
                                <img src="${dept.image_playful}" alt="${dept.title} Playful" loading="lazy"
                                    class="playful-img absolute inset-0 w-full h-full object-cover object-top opacity-0 transition-all duration-600 md:group-hover/dept:opacity-100">
                                
                                <button onclick="toggleDeptImg(event, this)" class="md:hidden absolute bottom-4 right-4 bg-white/90 backdrop-blur text-maroon p-2.5 rounded-full shadow-lg z-20 flex items-center justify-center border border-maroon/20 active:scale-90 transition-transform" aria-label="Toggle playful image">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                                </button>
                            </div>

                            <div class="p-6 md:p-8 flex flex-col grow">
                                <h3 class="text-2xl font-bold mb-4 tracking-tight">${dept.title}</h3>
                                <p class="leading-relaxed text-base text-main text-justify grow">
                                    ${dept.description}
                                </p>
                                ${igHTML}
                            </div>
                        </div>
                    `;

                deptContainer.insertAdjacentHTML('beforeend', cardHTML);
            });
        }
    }
    // ==========================================
    // 4. EVENTS PAGE
    // ==========================================
    const upcomingContainer = document.getElementById("events-upcoming-container");
    const pastContainer = document.getElementById("events-past-container");

    // A. Render UPCOMING Events (Zig-Zag Editorial Gallery)
    if (upcomingContainer && siteContent.eventsPage && siteContent.eventsPage.upcoming) {
        upcomingContainer.innerHTML = "";
        const events = siteContent.eventsPage.upcoming;

        if (events.length > 0 && events[0].title) {

            // Override default classes to force the zig-zag layout
            upcomingContainer.className = "grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 items-start";

            events.forEach((evt, index) => {

                // 2. Zig-Zag Stagger & Links
                const staggerClass = (index % 2 !== 0) ? "md:mt-24" : "";
                const regLink = evt.registration_link || "#";
                const target = regLink !== "#" ? "_blank" : "";

                // 3. New Event Type Tag 
                // FIX: Added 'shrink-0' so the tag itself doesn't get squished
                const typeTagHTML = evt.event_type ? `<span class="shrink-0 px-2 py-1 md:px-3 md:py-2 rounded-full text-xs md:text-base font-bold uppercase tracking-widest shadow-sm bg-maroon text-white backdrop-blur-md bg-opacity-90 whitespace-nowrap" style="font-size: 10px;">${evt.event_type}</span>` : '';

                // 4. Build the HTML Card
                const html = `
                <div class="flex flex-col gap-3 ${staggerClass}">
                    
                    <div class="flex justify-between items-center w-full gap-2">

                        <div class="flex flex-row flex-nowrap gap-2 md:gap-3 items-center justify-start flex-1 w-0 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-1">
                            ${typeTagHTML}
                            ${evt.department ? `<span class="shrink-0 px-2 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-base font-bold uppercase tracking-widest shadow-sm backdrop-blur-md ${getDepartmentColor(evt.department)} bg-opacity-90 whitespace-nowrap" style="font-size: 10px;">${evt.department}</span>` : ''}
                            ${evt.date ? `<span class="shrink-0 px-2 py-1 md:px-3 md:py-2 rounded-full text-xs md:text-base bg-black/20 font-bold uppercase tracking-widest shadow-sm text-black backdrop-blur-md whitespace-nowrap" style="font-size: 10px;">${evt.date}</span>` : ''}
                        </div>

                        ${evt.instagram_link ? `
                        <a href="${evt.instagram_link}" target="_blank" aria-label="View on Instagram"
                            class="shrink-0 bg-[#E1306C] text-white p-2 md:p-2.5 rounded-full transition-all duration-300 lg:hover:scale-110 lg:hover:shadow-lg">
                            <svg class="w-4 h-4 md:w-5 md:h-5 fill-current" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                        </a>
                        ` : ''}
                        
                    </div>

                    <div class="relative aspect-4/5 block rounded-3xl overflow-hidden shadow-lg border border-gray-200 group">
                        <img src="${evt.image}" alt="${evt.title}" loading="lazy"
                            class="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 lg:group-hover:opacity-0 group-[.show-details]:opacity-0">

                        <img src="${evt.details_image}" loading="lazy" alt="details image"
                            class="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700 lg:group-hover:opacity-100 group-[.show-details]:opacity-100">
                        
                        <button type="button" aria-label="Toggle details"
                            class="mobile-detail-toggle-btn absolute bottom-4 right-4 z-40 lg:hidden bg-black/60 hover:bg-black/80 text-white p-2.5 rounded-full backdrop-blur-md border border-white/30 transition-all shadow-lg">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                            </svg>
                        </button>

                        <div class="absolute inset-0 z-20 flex items-center justify-center transition-all duration-500 group-[.show-details]:opacity-0 pointer-events-none">
                            <a href="${regLink}" target="${target}" 
                                class="pointer-events-auto text-white font-bold bg-black/10 lg:bg-transparent lg:hover:bg-white lg:hover:text-maroon tracking-[0.2em] uppercase opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-500 transform lg:translate-y-4 lg:group-hover:translate-y-0 border-2 border-white px-4 py-1.5 md:px-6 md:py-2.5 rounded-full backdrop-blur-sm ${regLink === '#' ? 'cursor-not-allowed hover:bg-transparent hover:text-white' : ''}" style="font-size: 11px;">
                                ${regLink !== '#' ? 'Register Now' : 'Coming Soon'}
                            </a>
                        </div>
                    </div>
                </div>
                `;

                upcomingContainer.insertAdjacentHTML('beforeend', html);
            });
        } else {
            // Default Empty State
            upcomingContainer.className = "";
            upcomingContainer.innerHTML = `<p class="text-center text-gray-400 py-12 col-span-full">Stay tuned for upcoming events!</p>`;
        }
    }


    // B. Render PAST Events (Zig-Zag Editorial Gallery)
    if (pastContainer && siteContent.eventsPage && siteContent.eventsPage.past) {
        pastContainer.innerHTML = "";

        siteContent.eventsPage.past.forEach((evt, index) => {

            // 1. Zig-Zag Stagger & Links
            const staggerClass = (index % 2 !== 0) ? "md:mt-24" : "";
            const link = evt.instagram_link || "#";
            const target = link !== "#" ? "_blank" : "";

            // 2. Build the HTML Card
            const html = `
                <div class="flex flex-col gap-3 ${staggerClass}">
                    
                    <div class="flex justify-between items-center w-full gap-2">

                        <div class="flex flex-row flex-nowrap gap-2 md:gap-3 items-center justify-start flex-1 w-0 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-1">
                            ${evt.department ? `<span class="shrink-0 px-2 py-1 md:px-3 md:py-2 rounded-full text-xs md:text-base font-bold uppercase tracking-widest shadow-sm backdrop-blur-md ${getDepartmentColor(evt.department)} bg-opacity-90 whitespace-nowrap" style="font-size: 10px;">${evt.department}</span>` : ''}
                            ${evt.date ? `<span class="shrink-0 px-2 py-1 md:px-3 md:py-2 rounded-full text-xs md:text-base bg-black/20 font-bold uppercase tracking-widest shadow-sm text-black backdrop-blur-md whitespace-nowrap" style="font-size: 10px;">${evt.date}</span>` : ''}
                        </div>

                        ${evt.instagram_link ? `
                        <a href="${evt.instagram_link}" target="_blank" aria-label="View on Instagram"
                            class="shrink-0 bg-[#E1306C] text-white p-2 md:p-2.5 rounded-full transition-all duration-300 lg:hover:scale-110 lg:hover:shadow-lg">
                            <svg class="w-4 h-4 md:w-5 md:h-5 fill-current" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                        </a>
                        ` : ''}    
                    </div>

                    <div class="relative aspect-4/5 block rounded-3xl overflow-hidden shadow-lg border border-gray-200 group">
                        
                        <img src="${evt.image}" alt="${evt.title}" loading="lazy"
                            class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 lg:group-hover:scale-105">

                        <div class="absolute inset-0 z-20 flex items-center justify-center transition-all duration-500 bg-black/0 lg:group-hover:bg-black/30 pointer-events-none">
                            <a href="${link}" target="${target}" 
                                class="pointer-events-auto text-white font-bold bg-black/10 lg:bg-transparent lg:hover:bg-white lg:hover:text-black tracking-[0.2em] uppercase opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-500 transform lg:translate-y-4 lg:group-hover:translate-y-0 border-2 border-white px-4 py-1.5 md:px-6 md:py-2.5 rounded-full backdrop-blur-sm ${link === '#' ? 'cursor-not-allowed hover:bg-transparent hover:text-white' : ''}" style="font-size: 11px;">
                                ${link !== '#' ? 'View More' : 'Upcoming'}
                            </a>
                        </div>
                    </div>
                </div>
            `;

            pastContainer.insertAdjacentHTML('beforeend', html);
        });
    }

    // ==========================================
    //  5. PUBLICATION PAGE
    // ==========================================
    const publicationContainer = document.getElementById("publication-list-container");
    const publicationHero = document.getElementById("publication-hero-bg");
    const newsData = siteContent.publicationPage.publications; // The raw data

    if (publicationContainer && newsData) {

        // 1. Set Background Image
        if (publicationHero) {
            publicationHero.style.backgroundImage = `url('${siteContent.publicationPage.heroImage}')`;
        }

        // 2. THE RENDERING FUNCTION
        function renderGallery(filterCategory) {
            publicationContainer.innerHTML = ""; // Clear the board

            // 1. Filter the array based on the button clicked
            const filteredNews = filterCategory === 'all'
                ? newsData
                : newsData.filter(item => item.category === filterCategory);

            if (filteredNews.length > 0) {
                const gridDiv = document.createElement("div");
                // Add a gentle fade-in animation to the grid rebuild
                gridDiv.className = "grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 items-start animate-[fadeIn_0.5s_ease-out]";

                filteredNews.forEach((item, index) => {
                    const isDisabled = item.button_text.toLowerCase().includes("soon");
                    const link = isDisabled ? '#' : item.pdf_link;
                    const target = isDisabled ? '' : '_blank';

                    // CRITICAL: We stagger based on the new FILTERED index, so the layout never breaks!
                    const staggerClass = (index % 2 !== 0) ? "md:mt-24" : "";
                    const cardHTML = `
                        <div class="flex flex-col gap-3 ${staggerClass}">
    
                        <div class="flex flex-row flex-nowrap gap-2 md:gap-3 items-center justify-start w-full overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-1">
                            
                            ${item.department ? `<span class="shrink-0 px-2 py-1 md:px-3 md:py-2 rounded-full text-xs md:text-base font-bold uppercase tracking-widest shadow-sm backdrop-blur-md ${getDepartmentColor(item.department)} bg-opacity-90 whitespace-nowrap" style="font-size: 12px;">${item.department}</span>` : ''}
                            
                            ${item.instagram_link ? `
                            <a href="${item.instagram_link}" target="_blank" aria-label="View on Instagram"
                                class="shrink-0 bg-[#E1306C] text-white p-2 md:p-2.5 rounded-full transition-all duration-300 lg:hover:scale-110 lg:hover:shadow-lg">
                                <svg class="w-4 h-4 md:w-5 md:h-5 fill-current" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                            </a>
                            ` : ''}  
                        </div>

                        <div class="relative block rounded-3xl overflow-hidden shadow-lg border border-gray-200 group">
                            
                            <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover">

                            <div class="absolute inset-0 z-20 flex items-center justify-center transition-all duration-500 bg-black/0 lg:group-hover:bg-black/30 pointer-events-none">
                                <a href="${link}" target="${target}" 
                                    class="pointer-events-auto text-white font-bold bg-black/10 lg:bg-transparent lg:hover:bg-white lg:hover:text-black tracking-[0.2em] uppercase opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-500 transform lg:translate-y-4 lg:group-hover:translate-y-0 border-2 border-white px-4 py-1.5 md:px-6 md:py-2.5 rounded-full backdrop-blur-sm ${link === '#' ? 'cursor-not-allowed hover:bg-transparent hover:text-white' : ''}" style="font-size: 11px;">
                                    ${isDisabled ? 'Coming Soon' : item.button_text}
                                </a>
                            </div>
                        </div>
                    </div>
                    `;
                    gridDiv.insertAdjacentHTML('beforeend', cardHTML);
                });

                publicationContainer.appendChild(gridDiv);
            } else {
                publicationContainer.innerHTML = `<p class="text-center text-gray-400 py-12">No documents found in this category.</p>`;
            }
        }

        // 3. FILTER BUTTON CLICK LOGIC
        const filterButtons = document.querySelectorAll('.filter-btn');

        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const clickedBtn = e.target;

                // 1. Reset all buttons to the "inactive" (transparent) style
                filterButtons.forEach(b => {
                    b.classList.remove('bg-maroon', 'text-white');
                    b.classList.add('bg-transparent', 'text-maroon', 'hover:bg-gray-100');
                });

                // 2. Highlight the button they just clicked (solid maroon)
                clickedBtn.classList.remove('bg-transparent', 'text-maroon', 'hover:bg-gray-100');
                clickedBtn.classList.add('bg-maroon', 'text-white');

                // 3. Grab the category name and rebuild the gallery!
                const categoryToLoad = clickedBtn.getAttribute('data-filter');
                renderGallery(categoryToLoad);
            });
        });

        // 4. LOAD THE PAGE INITIALLY
        renderGallery('all');
    }

    const handbookContainer = document.getElementById("handbook-list-container")

    // B. Render Handbook (Zig-Zag Editorial Gallery)
    if (handbookContainer && siteContent.publicationPage && siteContent.publicationPage.handbook) {
        handbookContainer.innerHTML = "";

        siteContent.publicationPage.handbook.forEach((book, index) => {

            // 1. Zig-Zag Stagger & Links
            const staggerClass = (index % 2 !== 0) ? "md:mt-24" : "";
            const link = book.pdf_link || "#";
            const target = link !== "#" ? "_blank" : "";

            // 2. Build the HTML Card
            const html = `
                <div class="flex flex-col gap-3 ${staggerClass}">
                    
                    <div class="flex justify-between items-center w-full gap-2">

                        <div class="flex flex-row flex-nowrap gap-2 md:gap-3 items-center justify-start flex-1 w-0 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-1">
                            ${book.department ? `<span class="shrink-0 px-2 py-1 md:px-3 md:py-2 rounded-full text-xs md:text-base font-bold uppercase tracking-widest shadow-sm backdrop-blur-md ${getDepartmentColor(book.department)} bg-opacity-90 whitespace-nowrap" style="font-size: 12px;">${book.department}</span>` : ''}
                            ${book.intake ? `<span class="shrink-0 px-2 py-1 md:px-3 md:py-2 rounded-full text-xs md:text-base bg-black/20 font-bold uppercase tracking-widest shadow-sm text-black backdrop-blur-md whitespace-nowrap" style="font-size: 12px;">${book.intake}</span>` : ''}
                        </div>

                    </div>

                    <div class="relative block rounded-3xl overflow-hidden shadow-lg border border-gray-200 group">
                        
                        <img src="${book.image}" alt="${book.title}" loading="lazy"
                            class=" w-full h-full object-cover transition-transform duration-700 lg:group-hover:scale-105">

                        <div class="absolute inset-0 z-20 flex items-center justify-center transition-all duration-500 bg-black/0 lg:group-hover:bg-black/30 pointer-events-none">
                            <a href="${link}" target="${target}" 
                                class="pointer-events-auto text-white font-bold bg-black/10 lg:bg-transparent lg:hover:bg-white lg:hover:text-black tracking-[0.2em] uppercase opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-500 transform lg:translate-y-4 lg:group-hover:translate-y-0 border-2 border-white px-4 py-1.5 md:px-6 md:py-2.5 rounded-full backdrop-blur-sm ${link === '#' ? 'cursor-not-allowed hover:bg-transparent hover:text-white' : ''}" style="font-size: 11px;">
                                ${link !== '#' ? 'View More' : 'Upcoming'}
                            </a>
                        </div>
                    </div>
                </div>
            `;

            handbookContainer.insertAdjacentHTML('beforeend', html);
        });
    }



    // ==========================================
    // 6. ALSTAR PAGE
    // ==========================================
    const alstarContainer = document.getElementById("about-alstar-details");

    if (alstarContainer && siteContent.alstarPage) {

        // A. Alstar logo
        setImage("alstar-logo", siteContent.alstarPage.alstar_logo);

        // B. Text Content
        setText("alstar-description-text", siteContent.alstarPage.description);
        setText("alstar-difference-text", siteContent.alstarPage.difference);

        // C. Generate Certificate Pillars Dynamically
        const pillarsContainer = document.getElementById("certificate-pillars-container");
        if (pillarsContainer && siteContent.alstarPage.certificate) {
            pillarsContainer.innerHTML = ""; // Clear out any existing content

            siteContent.alstarPage.certificate.forEach((pillar, index) => {
                // Apply the specific border classes only to the middle item (index 1)
                const borderClasses = index === 1
                    ? "border-t-custom border-b-custom sm:border-t-0 sm:border-b-0 sm:border-x-custom py-6 sm:py-0"
                    : "";

                pillarsContainer.innerHTML += `
                    <div class="flex flex-col items-center ${borderClasses}">
                        <span class="text-4xl font-black text-main mb-1">${pillar.count}</span>
                        <span class="text-xs font-bold uppercase tracking-widest primary-maroon">${pillar.label}</span>
                        <span class="text-sm text-gray-500 mt-2">${pillar.desc}</span>
                    </div>
                `;
            });
        }

        // C. Submission Forms
        setLink("btn-submit-amendment", siteContent.alstarPage.forms.amendment);
        setLink("btn-submit-talk", siteContent.alstarPage.forms.talk);

        // D. Google Calendar Embed
        const calFrame = document.getElementById("calendar-frame");
        if (calFrame) calFrame.src = siteContent.alstarPage.calendar;
    }
}
// ==========================================
// 3. Function to Manage Navigation
// ==========================================
function navbarManagement() {
    const btn = document.getElementById("menu-btn");
    const panel = document.getElementById("menu-panel");
    const overlay = document.getElementById("menu-overlay");
    const content = document.getElementById("menu-content");
    const navbar = document.getElementById("navbar");

    let isOpen = false;

    // 🔥 TOGGLE MENU
    function toggleMenu() {
        isOpen = !isOpen;

        btn.classList.toggle("open");

        if (isOpen) {
            panel.classList.remove("-translate-y-full", "opacity-0", "pointer-events-none");
            panel.classList.add("translate-y-0", "opacity-100");
            overlay.classList.remove("opacity-0", "pointer-events-none");
            document.body.classList.add("overflow-hidden");
        } else {
            panel.classList.add("-translate-y-full", "opacity-0", "pointer-events-none");
            panel.classList.remove("translate-y-0", "opacity-100");
            overlay.classList.add("opacity-0", "pointer-events-none");
            document.body.classList.remove("overflow-hidden");
        }
    }

    btn.addEventListener("click", toggleMenu);
    overlay.addEventListener("click", toggleMenu);

    // 🔥 GENERATE MENU
    function renderMenu() {
        content.innerHTML = "";

        siteContent.navStructure.forEach(page => {
            const wrapper = document.createElement("div");
            wrapper.className = "flex flex-col gap-3 items-start text:left lg:items-center lg:text-center";

            let html = `
                    <a href="${page.link}" 
                    class="text-2xl font-bold w-fit transition-all duration-300 hover:scale-105 hover:[text-shadow:0_0_10px_rgba(255,255,255,0.3)]">
                        ${page.name}
                    </a>
            `;

            if (page.sections.length > 0) {
                html += `<div class="flex flex-col gap-2 mt-1">`;

                page.sections.forEach(sec => {
                    html += `
                        <a href="${page.link}#${sec.id}" 
                        class="text-base opacity-80 w-fit items-center hover:opacity-100 transition-all duration-200 hover:[text-shadow:0_0_8px_rgba(255,255,255,0.6)]">
                            ${sec.name}
                        </a>
                    `;
                });

                html += `</div>`;
            }
            wrapper.innerHTML = html;
            content.appendChild(wrapper);
        });

        // 🔥 CLOSE MENU WHEN CLICK LINK
        content.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", (e) => {
                // 1. Parse the clicked URL
                const url = new URL(link.href);

                // 2. Check if this is an anchor link (#) on the CURRENT page
                if (url.hash && url.pathname === window.location.pathname) {
                    e.preventDefault(); // Stop the default instant, broken jump

                    toggleMenu(); // Close the menu and remove 'overflow-hidden'

                    // Wait a tiny bit for the DOM to restore scrolling, then smooth scroll to the section
                    setTimeout(() => {
                        const targetSection = document.querySelector(url.hash);
                        if (targetSection) {
                            // scrollIntoView is native and provides a nice smooth scrolling effect
                            targetSection.scrollIntoView({ behavior: "smooth" });
                        }
                    }, 300); // 300ms gives your menu time to fade out before moving

                } else {
                    // Normal cross-page link (e.g., going from Home to Events)
                    // Just close the menu and let the browser navigate normally
                    toggleMenu();
                }
            });
        });
    }
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && isOpen) {
            toggleMenu();
        }
    });
    renderMenu();

    // 🔥 HIGHLIGHT ACTIVE PAGE
    function setActiveLink() {
        // 1. Get the exact, full URL of the current window (ignoring any #hashes)
        const currentUrl = window.location.href.split('#')[0];

        // 2. Grab all the links inside the menu
        const links = document.querySelectorAll('#menu-content a');

        links.forEach(link => {
            // 3. 'link.href' asks the browser for the fully resolved, absolute URL.
            // We split at '#' so it ignores subsection jumps.
            const linkUrl = link.href.split('#')[0];

            // 4. Strict Exact Match! No more fuzzy traps.
            if (currentUrl === linkUrl) {

                // If it is the Main Page Title (e.g., "Events")
                if (link.classList.contains('text-2xl')) {
                    link.classList.add('text-yellow-400', 'underline', 'underline-offset-8');
                }
                // If it is a Sub-section Link (e.g., "Past", "Upcoming")
                else {
                    link.classList.remove('opacity-80');
                    link.classList.add('text-yellow-200', 'font-bold');
                }
            }
        });
    }

    setActiveLink();

    // Add this variable just above your handleScroll function
    let lastScrollY = window.scrollY;

    function handleScroll() {
        // 🔥 THE FIX: If the menu is open, ignore scrolling entirely!
        if (isOpen) return;

        const currentScrollY = window.scrollY;

        // 1. Always show the navbar if we are at the very top of the page
        // (This also handles the "rubber-banding" bounce effect on Safari/iOS)
        if (currentScrollY <= 0) {
            navbar.classList.remove('-translate-y-full', 'opacity-0');
            navbar.classList.add('translate-y-0', 'opacity-100');
            lastScrollY = currentScrollY;
            return;
        }

        // 2. Determine scroll direction
        if (currentScrollY > lastScrollY) {
            // Scrolling DOWN: Hide navbar
            navbar.classList.remove('translate-y-0', 'opacity-100');
            navbar.classList.add('-translate-y-full', 'opacity-0');
        } else {
            // Scrolling UP: Show navbar
            navbar.classList.remove('-translate-y-full', 'opacity-0');
            navbar.classList.add('translate-y-0', 'opacity-100');
        }

        // 3. Update the last scroll position for the next time the user scrolls
        lastScrollY = currentScrollY;
    }

    // 1. Listen for standard scrolling
    window.addEventListener('scroll', handleScroll);

    // 2. Run it immediately once on page load to set the correct initial state
    handleScroll();

    // ==========================================
    // 🔥 HANDLE CROSS-PAGE HASH NAVIGATION
    // ==========================================
    function checkHashOnLoad() {
        // 1. Check if the URL has a hash (e.g., #upcoming)
        if (window.location.hash) {

            // 2. Wait 150ms to ensure the DOM and images have started rendering
            setTimeout(() => {
                const targetSection = document.querySelector(window.location.hash);

                if (targetSection) {
                    // 3. Smoothly scroll to the section
                    targetSection.scrollIntoView({ behavior: "smooth" });
                }
            }, 150);
        }
    }

    // Run the check when the script loads
    checkHashOnLoad();
}

document.addEventListener("DOMContentLoaded", async () => {
    await loadComponent("navbar-placeholder", "/html_pages/nav.html");
    await loadComponent("footer-placeholder", "/html_pages/footer.html");

    // Run content update ONLY if siteContent is loaded
    if (typeof siteContent !== 'undefined') {
        updateSiteContent();
        navbarManagement();
    } else {
        console.error("content.js not loaded!");
    }

});