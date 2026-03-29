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

// --- C. FEATURED EVENT CAROUSEL LOGIC ---
const upcomingEvents = siteContent.eventsPage?.upcoming || [];
let currentEventIndex = 0;
let carouselTimer;
const carouselDelay = 5000; // 5 seconds per slide

const cardEl = document.getElementById("featured-event-card");
const wrapperEl = document.getElementById("carousel-wrapper");
const imgContainer = document.getElementById("details-img-container");

function renderFeaturedEvent(index) {
    if (!upcomingEvents || upcomingEvents.length === 0) return;

    const eventData = upcomingEvents[index];

    // 1. Fade out
    cardEl.classList.remove("opacity-100");
    cardEl.classList.add("opacity-0");

    // 2. Wait for fade out to finish, then swap data
    setTimeout(() => {
        setImage("event-img", eventData.image);
        setImage("event-details-img", eventData.details_image);
        setText("event-title", eventData.title);

        // Date
        const dateEl = document.getElementById("event-date");
        if (dateEl && eventData.date) {
            dateEl.textContent = eventData.date;
            dateEl.classList.remove("hidden");
        }

        // Event Tag
        const eventtypeEl = document.getElementById("event-type");
        if (eventtypeEl && eventData.event_type) {
            eventtypeEl.textContent = eventData.event_type;
            eventtypeEl.classList.remove("hidden");
        }

        // Department Tag
        const deptEl = document.getElementById("event-department");
        if (deptEl && eventData.department) {
            deptEl.textContent = eventData.department;
            deptEl.className = `px-3 py-1 rounded-full text-xs md:text-sm font-bold uppercase tracking-wider inline-block ${getDepartmentColors(eventData.department)}`;
            deptEl.classList.remove("hidden");
        }

        // Instagram
        const igEl = document.getElementById("event-ig-link");
        if (igEl && eventData.instagram_link) {
            igEl.href = eventData.instagram_link;
            igEl.classList.remove("hidden");
        } else if (igEl) {
            igEl.classList.add("hidden");
        }

        // Button Logic
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

        // 3. Fade back in
        cardEl.classList.remove("opacity-0");
        cardEl.classList.add("opacity-100");
    }, 500);
}

// Navigation Functions
function nextSlide() {
    currentEventIndex = (currentEventIndex + 1) % upcomingEvents.length;
    renderFeaturedEvent(currentEventIndex);
}

function prevSlide() {
    currentEventIndex = (currentEventIndex - 1 + upcomingEvents.length) % upcomingEvents.length;
    renderFeaturedEvent(currentEventIndex);
}

// Helper to manually trigger slide (resets the auto-play timer)
function triggerManualSlide(direction) {
    clearInterval(carouselTimer);
    if (direction === 'next') nextSlide();
    if (direction === 'prev') prevSlide();
    carouselTimer = setInterval(nextSlide, carouselDelay);
}

// --- INITIALIZE CAROUSEL & EVENT LISTENERS ---
if (upcomingEvents.length > 0) {
    renderFeaturedEvent(0);

    // 1. Auto-play timer
    carouselTimer = setInterval(nextSlide, carouselDelay);

    // 2. Pause on Hover (Desktop)
    if (wrapperEl) {
        wrapperEl.addEventListener('mouseenter', () => clearInterval(carouselTimer));
        wrapperEl.addEventListener('mouseleave', () => {
            clearInterval(carouselTimer);
            carouselTimer = setInterval(nextSlide, carouselDelay);
        });
    }

    // 3. Arrow Buttons
    document.getElementById("next-event-btn")?.addEventListener('click', () => triggerManualSlide('next'));
    document.getElementById("prev-event-btn")?.addEventListener('click', () => triggerManualSlide('prev'));

    // 4. Laptop: Left/Right Half Click Navigation
    if (imgContainer) {
        imgContainer.style.cursor = 'pointer'; // Show user it's clickable
        imgContainer.addEventListener('click', (e) => {
            // Calculate where the user clicked relative to the image container
            const rect = imgContainer.getBoundingClientRect();
            const clickX = e.clientX - rect.left;

            // If clicked on left half, go prev. If right half, go next.
            if (clickX < rect.width / 2) {
                triggerManualSlide('prev');
            } else {
                triggerManualSlide('next');
            }
        });

        // 5. Mobile: Swipe Gesture Navigation
        let touchStartX = 0;
        let touchEndX = 0;

        imgContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            clearInterval(carouselTimer); // Pause while swiping
        }, { passive: true });

        imgContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            carouselTimer = setInterval(nextSlide, carouselDelay); // Resume after swipe
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50; // Minimum pixels to count as a swipe
            if (touchEndX < touchStartX - swipeThreshold) {
                // Swiped Left -> Go to Next
                triggerManualSlide('next');
            }
            if (touchEndX > touchStartX + swipeThreshold) {
                // Swiped Right -> Go to Prev
                triggerManualSlide('prev');
            }
        }
    }
} else {
    // Hide or load fallback if array is empty
    if (wrapperEl) wrapperEl.style.display = "none";
}

// MOBILE SHOW DETAILS TOGGLE BUTTON
document.addEventListener('DOMContentLoaded', () => {
    const detailToggleBtn = document.getElementById('mobile-details-toggle');
    const detailContainer = document.getElementById('details-img-container');

    if (detailToggleBtn && detailContainer) {
        detailToggleBtn.addEventListener('click', (e) => {
            // Prevent the button from doing anything else (like scrolling)
            e.preventDefault();

            // Toggle the custom class that shows the details image
            detailContainer.classList.toggle('show-details');
        });
    }
});
