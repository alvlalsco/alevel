

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
                    const typeTagHTML = evt.event_type ? `<span class="shrink-0 px-2 py-1 md:px-3 md:py-2 rounded-full text-xs md:text-base font-bold uppercase tracking-widest shadow-sm bg-maroon text-white backdrop-blur-md bg-opacity-90 whitespace-nowrap" style="font-size: 10px;">${evt.event_type}</span>` : '';

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
                
                <div class="flex justify-between items-center w-full gap-2 min-h-[32px]">
                    <div class="flex flex-row flex-nowrap gap-2 md:gap-3 items-center justify-start flex-1 w-0 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-1">
                        <span class="shrink-0 px-2 py-1 md:px-3 md:py-2 rounded-full text-xs md:text-base font-bold uppercase tracking-widest shadow-sm bg-maroon text-white backdrop-blur-md bg-opacity-90 whitespace-nowrap" style="font-size: 10px;">INFO</span>
                    </div>
                </div>

                <div class="relative aspect-4/5 block rounded-3xl overflow-hidden shadow-lg border border-gray-200">
                    <img src="${defaultData.default_image}" alt="${defaultData.default_title}" loading="lazy"
                        class="absolute inset-0 w-full h-full object-cover">
                    
                    <div class="absolute inset-0 bg-black/10 z-10"></div>

                    <div class="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                        <div class="pointer-events-auto text-white font-bold bg-black/40 tracking-[0.1em] uppercase border-2 border-white px-4 py-2 md:px-6 md:py-3 rounded-2xl backdrop-blur-sm text-center max-w-[80%]" style="font-size: 12px;">
                            ${defaultData.default_title}
                        </div>
                    </div>
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

    } else {
        console.error("content.js not loaded! Navigation cannot be built.");
    }
});