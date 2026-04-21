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
                                class="icon-ig">
                                <svg class="icon-ig-svg fill-current" >
                                    <use href="#ig-svg"></use>
                                <svg>
                            </a>
                            ` : ''}  
                        </div>

                        <div class="relative block rounded-3xl overflow-hidden shadow-lg border border-gray-200 group">
                            
                            <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover">

                            <div class="absolute inset-0 z-20 flex items-center justify-center transition-all duration-500 pointer-events-none">
                                <a href="${link}" target="${target}" class="btn-blur pointer-events-auto tracking-[0.2em] uppercase opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transform lg:translate-y-4 lg:group-hover:translate-y-0 duration-500! ${isDisabled ? 'cursor-not-allowed lg:hover:bg-transparent! lg:hover:text-white!' : ''}" style="font-size: 11px;">
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
                const isDisabled = book.button_text.toLowerCase().includes("soon");
                const link = isDisabled ? '#' : book.pdf_link;
                const target = isDisabled ? '' : '_blank';

                // 2. Build the HTML Card
                const html = `
                <div class="flex flex-col gap-3 ${staggerClass}">
                    
                    <div class="flex justify-between items-center w-full gap-2">

                        <div class="tag-wrapper">
                            ${book.department ? `<span class="tag-base tag-department ${getDepartmentColor(book.department)}">${book.department}</span>` : ''}
                            ${book.intake ? `<span class="tag-base tag-secondary">${book.intake}</span>` : ''}
                        </div>

                    </div>

                    <div class="relative block rounded-3xl overflow-hidden shadow-lg border border-gray-200 group">
                        
                        <img src="${book.image}" alt="${book.title}" loading="lazy"
                            class=" w-full h-full object-cover">

                        <div class="absolute inset-0 z-20 flex items-center justify-center transition-all duration-500 pointer-events-none">
                            <a href="${link}" target="${target}" class="btn-blur pointer-events-auto tracking-[0.2em] uppercase opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transform lg:translate-y-4 lg:group-hover:translate-y-0 duration-500! ${isDisabled ? 'cursor-not-allowed lg:hover:bg-transparent! lg:hover:text-white!' : ''}" style="font-size: 11px;">
                                    ${isDisabled ? 'Coming Soon' : book.button_text}
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