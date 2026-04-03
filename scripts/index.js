function toggleFaq(clickedIndex) {
    const targetAnswer = document.getElementById(`faq-answer-${clickedIndex}`);
    const targetIcon = document.getElementById(`faq-icon-${clickedIndex}`);

    // Check if the clicked answer is currently closed (grid-rows-[0fr])
    const isClosed = targetAnswer.classList.contains('grid-rows-[0fr]');

    // FORCE CLOSE ALL FAQs FIRST
    const allAnswers = document.querySelectorAll('[id^="faq-answer-"]');
    const allIcons = document.querySelectorAll('[id^="faq-icon-"]');

    allAnswers.forEach(answer => {
        answer.classList.add('grid-rows-[0fr]', 'opacity-0');
        answer.classList.remove('grid-rows-[1fr]', 'opacity-100');
    });

    allIcons.forEach(icon => {
        icon.classList.remove('rotate-180');
    });

    // OPEN THE CLICKED ONE (If it was originally closed)
    if (isClosed) {
        targetAnswer.classList.remove('grid-rows-[0fr]', 'opacity-0');
        targetAnswer.classList.add('grid-rows-[1fr]', 'opacity-100'); // Smoothly expands to exact height
        targetIcon.classList.add('rotate-180');
    }
}

// 4. Initialize Core Layout
document.addEventListener("DOMContentLoaded", async () => {

    // 2. Initialize Navigation Logic (Requires siteContent to be loaded first)
    if (typeof siteContent !== 'undefined') {
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

            // FIX: Disable card flipping if there are no upcoming events
            if (!upcomingEvents || upcomingEvents.length === 0) return;

            // NEW: Disable toggle completely if the current event has no details image
            const currentEvent = upcomingEvents[currentEventIndex];
            const hasDetailsImage = !!currentEvent.details_image && currentEvent.details_image.trim() !== "";
            if (!hasDetailsImage) return;

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
                // NEW: Check if a details image actually exists
                const hasDetailsImage = !!eventData.details_image && eventData.details_image.trim() !== "";

                // Assume setImage, setText, and getDepartmentColor are globally defined elsewhere
                setImage("event-img", eventData.image);

                // Only try to set the details image if it exists
                if (hasDetailsImage) {
                    setImage("event-details-img", eventData.details_image);
                }

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
                if (igEl) {
                    if (eventData.instagram_link) {
                        igEl.href = eventData.instagram_link;
                        igEl.style.display = ""; // Remove inline style override
                        igEl.classList.remove("hidden");
                    } else {
                        igEl.removeAttribute("href"); // FIX: Clear the stale link
                        igEl.style.display = "none";  // FIX: Force hide, overriding flex/block classes
                        igEl.classList.add("hidden");
                    }
                }

                const trlEl = document.getElementById("event-trailer-link");
                if (trlEl) {
                    if (eventData.trailer_link) {
                        trlEl.href = eventData.trailer_link;
                        trlEl.style.display = "";
                        trlEl.classList.remove("hidden");
                    } else {
                        trlEl.removeAttribute("href"); // Clear stale link
                        trlEl.style.display = "none";  // Force hide
                        trlEl.classList.add("hidden");
                    }
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
                const mobileToggleBtn = document.querySelector("#featured-event-card .mobile-detail-toggle-btn");

                // NEW: Handle animation classes and visibility based on hasDetailsImage
                if (mainImg) {
                    mainImg.classList.remove("opacity-0");
                    if (hasDetailsImage) {
                        mainImg.classList.add("lg:group-hover:opacity-0", "group-[.show-details]:opacity-0");
                    } else {
                        mainImg.classList.remove("lg:group-hover:opacity-0", "group-[.show-details]:opacity-0");
                    }
                }

                if (detailsImg) {
                    if (hasDetailsImage) {
                        detailsImg.classList.remove("hidden");
                        detailsImg.classList.add("opacity-0");
                    } else {
                        detailsImg.classList.add("hidden");
                    }
                }

                if (mobileToggleBtn) {
                    mobileToggleBtn.style.display = hasDetailsImage ? "" : "none";
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
            // ==========================================
            // Default Empty State for Carousel
            // ==========================================
            const defaultData = siteContent.eventsPage?.default;

            if (defaultData && cardEl) {
                // 1. Populate default image and title
                if (typeof setImage === 'function') setImage("event-img", defaultData.default_image);
                if (typeof setText === 'function') setText("event-title", defaultData.default_title);

                // 2. Hide all dynamic tags, buttons, and carousel controls
                const elementsToHide = [
                    "event-date", "event-type", "event-department",
                    "event-ig-link", "event-trailer-link", "event-reg-btn",
                    "next-event-btn", "prev-event-btn", "event-details-img",
                    "carousel-indicators" // Assuming you might have dots to hide
                ];

                elementsToHide.forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.style.display = "none"; // Using display: none overrides Tailwind flex/block classes securely
                });

                // 3. Disable hover/click interactions on the image container
                if (imgContainer) {
                    imgContainer.style.cursor = "default";
                    imgContainer.style.pointerEvents = "none";
                }

                // 4. Ensure the card itself remains fully visible
                cardEl.classList.remove("opacity-0");
                cardEl.classList.add("opacity-100");

                if (wrapperEl) wrapperEl.style.display = "block"; // Make sure wrapper isn't hidden

            } else if (wrapperEl) {
                // Absolute fallback: entirely hide the wrapper if the default data is completely missing
                wrapperEl.style.display = "none";
            }
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

    } else {
        console.error("content.js not loaded! Navigation cannot be built.");
    }
});