// Ensure your type tag has the updated responsive padding, text size, and whitespace-nowrap!
const typeTagHTML = evt.event_type ? `<span class="px-2 py-1 md:px-3 md:py-1.5 rounded-full text-[9px] md:text-xs font-bold uppercase tracking-widest shadow-sm bg-maroon text-white backdrop-blur-md bg-opacity-90 whitespace-nowrap">${evt.event_type}</span>` : '';

const html = `
    <div class="flex flex-col gap-3 md:gap-3 ${staggerClass}">
        <div class="flex justify-between items-start w-full gap-2">

            <div class="flex flex-row flex-wrap-reverse gap-1.5 md:gap-2 items-center justify-start flex-1">
                ${typeTagHTML}
                ${evt.department ? `<span class="px-2 py-1 md:px-3 md:py-1.5 rounded-full text-[9px] md:text-xs font-bold uppercase tracking-widest shadow-sm backdrop-blur-md ${deptColorClass} bg-opacity-90 whitespace-nowrap">${evt.department}</span>` : ''}
                ${evt.date ? `<span class="px-2 py-1 md:px-3 md:py-1.5 rounded-full text-[9px] md:text-xs font-bold uppercase tracking-widest shadow-sm bg-black/80 text-white backdrop-blur-md whitespace-nowrap">${evt.date}</span>` : ''}
            </div>

            ${evt.instagram_link ? `
            <a href="${evt.instagram_link}" target="_blank" aria-label="Instagram"
                class="flex-shrink-0 bg-[#E1306C] text-white p-2 md:p-2.5 rounded-full transition-all duration-300 lg:hover:scale-110 lg:hover:shadow-lg mt-0.5">
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
                class="mobile-detail-toggle-btn absolute bottom-4 right-4 z-40 lg:hidden bg-black/60 hover:bg-black/80 text-white p-3 rounded-full backdrop-blur-md border border-white/30 transition-all shadow-lg">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                </svg>
            </button>

            <div class="absolute inset-0 z-20 flex items-center justify-center transition-all duration-500 lg:group-hover:bg-black/30 group-[.show-qr]:opacity-0 pointer-events-none">
                
                <a href="${regLink}" target="${target}" 
                    class="pointer-events-auto text-white font-bold bg-black/40 lg:bg-transparent lg:hover:bg-white lg:hover:text-maroon tracking-[0.2em] uppercase opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-500 transform lg:translate-y-4 lg:group-hover:translate-y-0 border-2 border-white px-4 py-1.5 text-[10px] md:text-sm md:px-6 md:py-2 rounded-full backdrop-blur-sm ${regLink === '#' ? 'cursor-not-allowed hover:bg-transparent hover:text-white' : ''}">
                    ${regLink !== '#' ? 'Register Now' : 'Coming Soon'}
                </a>
                
            </div>
        </div>
    </div>
`;