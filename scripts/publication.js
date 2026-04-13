async function submitEmail() {
    // a. Get Elements
    const emailInput = document.getElementById("publication-email-input");
    const btn = document.getElementById("publication-sub-btn");
    const successMsg = document.getElementById("publication-success-msg");
    const errorMsg = document.getElementById("publication-error-msg");

    // b. Reset States
    successMsg.classList.add("hidden");
    errorMsg.classList.add("hidden");

    const email = emailInput.value.trim();

    // c. Simple Validation
    if (!email || !email.includes("@")) {
        errorMsg.textContent = "Please enter a valid email address.";
        errorMsg.classList.remove("hidden");
        return;
    }

    // d. Loading State
    const originalText = btn.textContent;
    btn.textContent = "Subsrcibing...";
    btn.disabled = true;
    btn.classList.add("opacity-75", "cursor-not-allowed");

    // e. Send Data to Google Sheets using google app script
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyyWT4XJQ7CjhLyNEwdy-UZGjSr5PMcAkARv2knu6HkSC9HiKmhvRtmv2Re59YrKwE0/exec";

    try {
        const formData = new FormData();
        formData.append("email", email);

        const response = await fetch(SCRIPT_URL, {
            method: "POST",
            body: formData
        });

        if (response.ok) {
            // Success!
            emailInput.value = ""; // Clear input
            successMsg.classList.remove("hidden");
        } else {
            throw new Error("Network response was not ok.");
        }
    } catch (error) {
        console.error("Error!", error.message);
        errorMsg.textContent = "Something went wrong. Please try again.";
        errorMsg.classList.remove("hidden");
    } finally {
        // 6. Reset Button
        btn.textContent = originalText;
        btn.disabled = false;
        btn.classList.remove("opacity-75", "cursor-not-allowed");

        // Hide success message after 5 seconds
        setTimeout(() => {
            successMsg.classList.add("hidden");
        }, 5000);
    }
}

// 4. Initialize Core Layout
document.addEventListener("DOMContentLoaded", async () => {

    // 2. Initialize Navigation Logic (Requires siteContent to be loaded first)
    if (typeof siteContent !== 'undefined') {
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
                            
                            ${item.ig_link ? `
                            <a href="${item.ig_link}" target="_blank" aria-label="View on Instagram"
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


    } else {
        console.error("content.js not loaded! Navigation cannot be built.");
    }
});