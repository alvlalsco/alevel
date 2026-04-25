/**
 * ==========================================
 * FAQ ACCORDION LOGIC
 * ==========================================
 */
function toggleFaq(clickedIndex) {
    const targetAnswer = document.getElementById(`faq-answer-${clickedIndex}`);
    const targetIcon = document.getElementById(`faq-icon-${clickedIndex}`);

    const isClosed = targetAnswer.classList.contains('grid-rows-[0fr]');

    const allAnswers = document.querySelectorAll('[id^="faq-answer-"]');
    const allIcons = document.querySelectorAll('[id^="faq-icon-"]');

    allAnswers.forEach(answer => {
        answer.classList.add('grid-rows-[0fr]', 'opacity-0');
        answer.classList.remove('grid-rows-[1fr]', 'opacity-100');
    });

    allIcons.forEach(icon => {
        icon.classList.remove('rotate-180');
    });

    if (isClosed) {
        targetAnswer.classList.remove('grid-rows-[0fr]', 'opacity-0');
        targetAnswer.classList.add('grid-rows-[1fr]', 'opacity-100');
        targetIcon.classList.add('rotate-180');
    }
}

/**
 * ==========================================
 * MAIN DOM CONTENT LOAD
 * ==========================================
 */
document.addEventListener("DOMContentLoaded", async () => {

    if (typeof siteContent !== 'undefined') {

        // --- A. HERO SECTION ---
        setBackgroundImage("hero-background", siteContent.index.hero.image);
        setText("hero-desc", siteContent.index.hero.description);
        setLink("hero-handbook-btn", siteContent.index.hero.handbook_pdf);
        setLink("hero-trailer-btn", siteContent.index.hero.trailer_link);

        // --- B. AFFILIATES SECTION ---
        const affiliateContainer = document.getElementById("affiliates-grid");

        if (affiliateContainer && siteContent.index.affiliates) {
            affiliateContainer.innerHTML = "";

            siteContent.index.affiliates.forEach(partner => {
                const wrapper = document.createElement("div");
                wrapper.className = "flex flex-col items-center gap-2 sm:gap-3 group min-w-[80px] sm:min-w-[120px]";

                const img = document.createElement("img");
                img.src = partner.image;
                img.alt = partner.name;
                img.className = "w-16 h-16 sm:w-20 sm:h-20 md:w-auto md:h-44 object-contain opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 filter grayscale group-hover:grayscale-0";

                const name = document.createElement("span");
                name.textContent = partner.name;
                name.className = "text-[10px] sm:text-xs md:text-sm font-bold text-gray-500 group-hover:primary-maroon transition-colors uppercase tracking-wider text-center";

                wrapper.appendChild(img);
                wrapper.appendChild(name);
                affiliateContainer.appendChild(wrapper);
            });
        }

        // --- C. FEATURED EVENT CAROUSEL ---
        const upcomingEvents = siteContent.eventsPage?.upcoming || [];
        let currentEventIndex = 0;
        let carouselTimer;
        let interactionTimeout;
        let isInteracting = false;
        const carouselDelay = 5000;

        const cardEl = document.getElementById("event-card");
        const wrapperEl = document.getElementById("events-carousel-wrapper");
        const imgContainer = document.getElementById("img-container");

        window.toggleEventInfo = function (event) {
            event.preventDefault();
            event.stopPropagation();

            if (!upcomingEvents || upcomingEvents.length === 0) return;

            const currentEvent = upcomingEvents[currentEventIndex];
            const hasDetailsImage = !!currentEvent.details_image?.trim();
            if (!hasDetailsImage) return;

            temporarilyPauseCarousel();

            const mainImg = document.getElementById("event-img");
            const detailsImg = document.getElementById("event-details-img");

            if (detailsImg && mainImg) {
                const isHidden = detailsImg.classList.contains("opacity-0");
                detailsImg.classList.toggle("opacity-0", !isHidden);
                detailsImg.classList.toggle("opacity-100", isHidden);
                mainImg.classList.toggle("opacity-0", isHidden);
            }
        };

        function renderFeaturedEvent(index) {
            if (!upcomingEvents?.length || !cardEl) return;

            const eventData = upcomingEvents[index];

            cardEl.classList.remove("opacity-100");
            cardEl.classList.add("opacity-0");

            setTimeout(() => {
                const hasDetailsImage = !!eventData.details_image?.trim();

                setImage("event-img", eventData.image);
                if (hasDetailsImage) setImage("event-details-img", eventData.details_image);
                setText("event-title", eventData.title);

                const dateEl = document.getElementById("event-date");
                if (dateEl) {
                    dateEl.textContent = eventData.date || "";
                    dateEl.classList.toggle("hidden", !eventData.date);
                }

                const typeEl = document.getElementById("event-type-tag");
                if (typeEl) {
                    typeEl.textContent = eventData.event_type || "";
                    typeEl.classList.toggle("hidden", !eventData.event_type);
                }

                const deptEl = document.getElementById("event-department-tag");
                if (deptEl) {
                    if (eventData.department) {
                        deptEl.textContent = eventData.department;
                        deptEl.className = `tag-base ${getDepartmentColor(eventData.department)}`;
                    } else {
                        deptEl.classList.add("hidden");
                    }
                }

                const igEl = document.getElementById("event-ig-tag");
                if (igEl) {
                    igEl.href = eventData.ig_link || "#";
                    igEl.classList.toggle("hidden", !eventData.ig_link);
                }

                const trlEl = document.getElementById("event-trailer-tag");
                if (trlEl) {
                    trlEl.href = eventData.trailer_link || "#";
                    trlEl.classList.toggle("hidden", !eventData.trailer_link);
                }

                const eventBtn = document.getElementById("event-reg-btn");
                if (eventBtn) {
                    const regLink = eventData.registration_link;
                    const isValidReg = regLink && regLink !== "#";

                    eventBtn.href = isValidReg ? regLink : "#";
                    setText("event-reg-btn-text", isValidReg ? "Register Now" : "Coming Soon");
                    eventBtn.classList.toggle("cursor-not-allowed", !isValidReg);
                    eventBtn.classList.toggle("opacity-70", !isValidReg);
                }

                const mainImg = document.getElementById("event-img");
                const detailsImg = document.getElementById("event-details-img");
                const mobileToggleBtn = document.getElementById("mobile-details-toggle");

                if (mainImg) {
                    mainImg.classList.remove("opacity-0");
                    mainImg.classList.toggle("lg:group-hover:opacity-0", hasDetailsImage);
                    mainImg.classList.toggle("group-[.show-details]:opacity-0", hasDetailsImage);
                }

                if (detailsImg) {
                    detailsImg.classList.toggle("hidden", !hasDetailsImage);
                    if (hasDetailsImage) detailsImg.classList.add("opacity-0");
                }

                if (mobileToggleBtn) {
                    mobileToggleBtn.classList.toggle("hidden", !hasDetailsImage);
                }

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

        function temporarilyPauseCarousel() {
            clearInterval(carouselTimer);
            clearTimeout(interactionTimeout);
            isInteracting = true;

            interactionTimeout = setTimeout(() => {
                isInteracting = false;
                carouselTimer = setInterval(nextSlide, carouselDelay);
            }, 10000);
        }

        function triggerManualSlide(direction) {
            direction === 'next' ? nextSlide() : prevSlide();
            temporarilyPauseCarousel();
        }

        if (upcomingEvents.length > 0) {
            renderFeaturedEvent(0);

            if (upcomingEvents.length > 1) {
                carouselTimer = setInterval(nextSlide, carouselDelay);

                if (wrapperEl) {
                    wrapperEl.addEventListener('mouseenter', () => {
                        clearInterval(carouselTimer);
                        clearTimeout(interactionTimeout);
                        isInteracting = false;
                    });

                    wrapperEl.addEventListener('mouseleave', () => {
                        if (!isInteracting) {
                            clearInterval(carouselTimer);
                            carouselTimer = setInterval(nextSlide, carouselDelay);
                        }
                    });

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

                if (wrapperEl) {
                    let touchStartX = 0, touchStartY = 0;
                    let touchEndX = 0, touchEndY = 0;

                    wrapperEl.addEventListener('touchstart', (e) => {
                        touchStartX = e.changedTouches[0].screenX;
                        touchStartY = e.changedTouches[0].screenY;
                    }, { passive: true });

                    wrapperEl.addEventListener('touchend', (e) => {
                        touchEndX = e.changedTouches[0].screenX;
                        touchEndY = e.changedTouches[0].screenY;

                        const deltaX = touchEndX - touchStartX;
                        const deltaY = touchEndY - touchStartY;

                        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                            triggerManualSlide(deltaX < 0 ? 'next' : 'prev');
                        }
                    }, { passive: true });
                }
            } else {

                // 3. If there is EXACTLY 1 event, hide the navigation controls
                document.getElementById("event-nav-controls")?.classList.add("hidden");
                document.getElementById("next-event-btn")?.classList.add("hidden");
                document.getElementById("prev-event-btn")?.classList.add("hidden");

            }

        } else {
            const defaultData = siteContent.eventsPage.default;

            if (defaultData && wrapperEl) {
                setImage("event-img", defaultData.default_image);
                setText("event-title", defaultData.default_title);

                const elementsToHide = [
                    "event-date", "event-type-tag", "event-department-tag",
                    "event-ig-tag", "event-trailer-tag", "event-regis",
                    "event-nav-controls", "event-details-img", "event-desc"
                ];

                elementsToHide.forEach(id => {
                    document.getElementById(id)?.classList.add("hidden");
                });

                if (imgContainer) {
                    imgContainer.style.cursor = "default";
                    imgContainer.style.pointerEvents = "none";
                }

                cardEl.classList.remove("opacity-0");
                cardEl.classList.add("opacity-100");

            } else if (wrapperEl) {
                wrapperEl.classList.add("hidden");
            }
        }

        // --- D. PUBLICATIONS SECTION ---
        const allPublications = siteContent.publicationPage?.publications || [];
        const newsContainer = document.getElementById('latest-newsletter-container');
        const postContainer = document.getElementById('latest-post-container');

        const latestNewsletter = allPublications.find(item => item.category === 'newsletter');
        const latestPost = allPublications.find(item => item.category === 'post');

        function generateCardHTML(item) {
            if (!item) return '';

            const link = item.pdf_link || '#';
            const target = link !== '#' ? '_blank' : '_self';
            const isDisabled = link === '#';

            return `
            <div class="stack-card">
                <div class="tag-wrapper">
                    ${item.department ? `<span class="tag-base ${getDepartmentColor(item.department)} ">${item.department}</span>` : ''}
                    
                    ${item.ig_link ? `
                    <a href="${item.ig_link}" target="_blank" rel="noopener noreferrer" aria-label="View on Instagram" class="icon-ig">
                        <svg class="icon-ig-svg">
                           <use href="#ig-svg"></use>
                        </svg>
                    </a>` : ''}  
                </div>

                <div class="media-card group">
                    <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover">
                    <div class="media-card-overlay group ">
                        <a href="${link}" target="${target}" rel="noopener noreferrer" class="media-card-cta btn-blur ${isDisabled ? 'cursor-not-allowed lg:hover:bg-transparent! lg:hover:text-white!' : ''}">
                            ${isDisabled ? 'Coming Soon' : item.button_text}
                        </a>
                    </div>
                </div>
                
                <h4 class="text-sm sm:text-base md:text-lg font-bold mt-1 text-main text-center">${item.title}</h4>
            </div>`;
        }

        if (newsContainer && postContainer && latestNewsletter && latestPost) {
            newsContainer.innerHTML = generateCardHTML(latestNewsletter);
            postContainer.innerHTML = generateCardHTML(latestPost);
        }

        // --- E. FAQ SECTION ---
        const faqContainer = document.getElementById("faq-accordion-container");

        if (faqContainer && siteContent.index?.faq) {
            faqContainer.innerHTML = "";

            siteContent.index.faq.forEach((item, index) => {
                const faqHTML = `
                <div class="border-b-2 border-[#d1d5db]">
                    <button onclick="toggleFaq(${index})" class="w-full py-5 sm:py-6 flex justify-between items-center text-left focus:outline-none group">
                        <span class="text-base sm:text-lg font-bold group-hover:text-maroon transition-colors pr-4 sm:pr-6">${item.question}</span>
                        <div class="shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                            <svg id="faq-icon-${index}" class="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-maroon transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </div>
                    </button>
                    <div id="faq-answer-${index}" class="grid grid-rows-[0fr] opacity-0 transition-all duration-500 ease-in-out">
                        <div class="overflow-hidden">
                            <p class="pb-6 sm:pb-8 text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed pr-4 md:pr-12">${item.answer}</p>
                        </div>
                    </div>
                </div>`;
                faqContainer.insertAdjacentHTML('beforeend', faqHTML);
            });
        }

    } else {
        console.error("content.js not loaded! Navigation cannot be built.");
    }
});