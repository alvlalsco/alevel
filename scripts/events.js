

// 4. Initialize Core Layout
document.addEventListener("DOMContentLoaded", async () => {

    // 2. Initialize Navigation Logic (Requires siteContent to be loaded first)
    if (typeof siteContent !== 'undefined') {

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
                    const typeTagHTML = evt.event_type ? `<span class="tag-primary">${evt.event_type}</span>` : '';

                    // Check if a second image actually exists
                    const hasDetailsImage = !!evt.details_image && evt.details_image.trim() !== "";

                    // Set main image classes dynamically based on whether there's a second image
                    const mainImageClasses = hasDetailsImage
                        ? "absolute inset-0 w-full h-full object-cover transition-opacity duration-700 lg:group-hover:opacity-0 group-[.show-details]:opacity-0"
                        : "absolute inset-0 w-full h-full object-cover";

                    // 4. Build the HTML Card
                    const html = `
        <div class="flex flex-col gap-3 ${staggerClass}">
            
            <div class="flex justify-between items-center w-full gap-2">

                <div class="tag-wrapper">
                    ${typeTagHTML}
                    ${evt.department ? `<span class= "tag-base ${getDepartmentColor(evt.department)}">${evt.department}</span>` : ''}
                    ${evt.date ? `<span class="tag-secondary">${evt.date}</span>` : ''}
                </div>

                ${evt.ig_link ? `
                <a href="${evt.ig_link}" target="_blank" aria-label="View on Instagram"
                    class="icon-ig">
                    <svg class="icon-ig-svg fill-current">
                        <use href="#ig-svg"></use>    
                    </svg>
                </a>
                ` : ''}
                
            </div>

            <div class="relative aspect-4/5 block rounded-3xl overflow-hidden shadow-lg border border-gray-200 group">
                <img src="${evt.image}" alt="${evt.title}" loading="lazy" class="${mainImageClasses}">

                ${hasDetailsImage ? `
                <img src="${evt.details_image}" loading="lazy" alt="details image"
                    class="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700 lg:group-hover:opacity-100 group-[.show-details]:opacity-100">
                
                <button type="button" aria-label="Toggle details"
                    class="mobile-detail-toggle-btn absolute bottom-4 right-4 z-40 lg:hidden bg-black/60 hover:bg-black/80 text-white p-2.5 rounded-full backdrop-blur-md border border-white/30 transition-all shadow-lg">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                    </svg>
                </button>
                ` : ''}

                <div class="media-card-overlay group-[.show-details]:opacity-0">
                    <a href="${regLink}" target="${target}" rel="noopener noreferrer" class="media-card-cta btn-blur ${regLink == '#' ? 'cursor-not-allowed lg:hover:bg-transparent! lg:hover:text-white!' : ''}">
                        ${regLink !== "#" ? evt.button_text : "Coming Soon"}
                    </a>
                </div>
            </div>
        </div>
        `;

                    upcomingContainer.insertAdjacentHTML('beforeend', html);
                });
            } else {
                // ==========================================
                // Default Empty State (Using Grid Card format)
                // ==========================================

                // Fetch default data from siteContent
                const defaultData = siteContent.eventsPage.default;

                // Center the single card using Flexbox to restrict its width nicely
                upcomingContainer.className = "flex justify-center items-start w-full";

                // Construct identical card DOM without the active hover states
                upcomingContainer.innerHTML = `
            <div class="flex flex-col gap-3 w-full max-w-md">

                <div class="relative aspect-4/5 block rounded-3xl overflow-hidden shadow-lg border border-gray-200">
                    <img src="${defaultData.default_image}" alt="${defaultData.default_title}" loading="lazy"
                        class="absolute inset-0 w-full h-full object-cover">
                </div>

            </div>
        `;
            }
        }
        // B. Render PAST Events (Zig-Zag Editorial Gallery)
        if (pastContainer && siteContent.eventsPage && siteContent.eventsPage.past) {
            pastContainer.innerHTML = "";

            siteContent.eventsPage.past.forEach((evt, index) => {

                // 1. Zig-Zag Stagger & Links
                const staggerClass = (index % 2 !== 0) ? "md:mt-24" : "";
                const link = evt.ig_link || "#";
                const target = link !== "#" ? "_blank" : "";

                // 2. Build the HTML Card
                const html = `
                <div class="flex flex-col gap-3 ${staggerClass}">
                    
                    <div class="flex justify-between items-center w-full gap-2">

                        <div class="tag-wrapper">
                            ${evt.department ? `<span class="tag-base ${getDepartmentColor(evt.department)}">${evt.department}</span>` : ''}
                            ${evt.date ? `<span class="tag-secondary">${evt.date}</span>` : ''}
                        </div>

                        ${evt.ig_link ? `
                        <a href="${evt.ig_link}" target="_blank" aria-label="View on Instagram"
                            class="icon-ig">
                            <svg class="icon-ig-svg fill-current">
                                <use href="#ig-svg"></use>    
                            </svg>
                        </a>
                        ` : ''}    
                    </div>

                    <div class="relative aspect-4/5 block rounded-3xl overflow-hidden shadow-lg border border-gray-200 group">
                        
                        <img src="${evt.image}" alt="${evt.title}" loading="lazy"
                            class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 lg:group-hover:scale-105">

                        <div class="absolute inset-0 z-20 flex items-center justify-center transition-all duration-500 group-[.show-details]:opacity-0 pointer-events-none">
                            <a href="${link}" target="${target}" class="btn-blur pointer-events-auto tracking-[0.2em] uppercase opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transform lg:translate-y-4 lg:group-hover:translate-y-0 duration-500! ${link == '#' ? 'cursor-not-allowed lg:hover:bg-transparent! lg:hover:text-white!' : ''}">
                                ${link !== "#" ? 'View More' : "Upcoming"}
                            </a>
                        </div>

                    </div>
                </div>
            `;

                pastContainer.insertAdjacentHTML('beforeend', html);
            });
        }

    } else {
        console.error("content.js not loaded! Navigation cannot be built.");
    }
});