// ==========================================
// 1. Function to load HTML components
// ==========================================
async function loadComponent(elementId, filePath) {
    try {
        const response = await fetch(filePath);
        if (response.ok) {
            const content = await response.text();
            document.getElementById(elementId).innerHTML = content;

            // Only run active link logic if we just loaded the navbar
            if (elementId === 'navbar-placeholder') {
                setActiveLink();
            }
        } else {
            console.error(`Error loading ${filePath}: ${response.status}`);
        }
    } catch (error) {
        console.error(`Error fetching ${filePath}:`, error);
    }
}

// ==========================================
// 2. Function to Highlight the Current Page
// ==========================================

function setActiveLink() {
    const currentPath = window.location.pathname; // e.g., "/events.html" or "/"

    // Get all nav links (Desktop & Mobile)
    const links = document.querySelectorAll('.nav-link');

    links.forEach(link => {
        // Check if the link's href matches the current path
        // We use 'getAttribute' to get the raw value from HTML (e.g., "/about.html")
        const linkPath = link.getAttribute('href');

        // Handle the root "/" case explicitly
        if (currentPath === "/" || currentPath === "/index.html") {
            if (linkPath === "/") {
                link.classList.add('primary-maroon', 'font-bold');
            }
        }
        // Handle other pages
        else if (currentPath.includes(linkPath) && linkPath !== "/") {
            link.classList.add('primary-maroon', 'font-bold');
        }
    });
}

// ==========================================
// 3. Website Content Manager
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
    }

    // ==========================================
    // 1. HERO PAGE
    // ==========================================

    //  A. HERO SECTION
    setBackgroundImage("hero-header", siteContent.index.hero.image);
    setText("hero-desc", siteContent.index.hero.description);
    setLink("hero-handbook-btn", siteContent.index.hero.handbook_pdf);

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
            img.className = "w-16 h-16 w-auto md:h-44 object-contain opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 filter grayscale group-hover:grayscale-0";

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

    // C. FEATURED EVENT
    // Check if the featured event has an actual title defined
    if (siteContent.index.featuredEvent && siteContent.index.featuredEvent.title) {

        setImage("event-img", siteContent.index.featuredEvent.image);
        setText("event-title", siteContent.index.featuredEvent.title);
        setText("event-desc", siteContent.index.featuredEvent.description);
        setText("event-reg-btn-text", siteContent.index.featuredEvent.button_text);

        // C1. Button Logic
        const eventBtn = document.getElementById("event-reg-btn");
        if (eventBtn) {
            if (siteContent.index.featuredEvent.button_text.toLowerCase().includes("open")) {
                eventBtn.href = siteContent.index.featuredEvent.registration_link;
            } else {
                eventBtn.href = "/events.html";
            }
        }

    } else {
        // Fallback to default "Stay Tuned"
        setImage("event-img", siteContent.eventsPage.default.default_image);

        // FIXED: Changed setImage to setText
        setText("event-title", siteContent.eventsPage.default.default_title);

        setText("event-desc", siteContent.eventsPage.default.default_description);
        setText("event-reg-btn-text", siteContent.eventsPage.default.default_button);

        // Optional: Hide or disable the button if there is no event
        const eventBtn = document.getElementById("event-reg-btn");
        if (eventBtn) {
            eventBtn.style.display = "none"; // Or you can make it disabled
        }
    }


    //  D. NEWSLETTER
    setImage("news-img", siteContent.index.newsletter.image);
    setText("news-title", siteContent.index.newsletter.title);
    setText("news-desc", siteContent.index.newsletter.description);
    setLink("news-read-btn", siteContent.index.newsletter.pdf_link);

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
                    
                    <span class="text-lg font-bold group-hover:text-[#88113b] transition-colors pr-6">
                        ${item.question}
                    </span>
                    
                    <div class="shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                        <svg id="faq-icon-${index}" class="w-5 h-5 text-gray-600 group-hover:text-[#88113b] transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    const hcContainer = document.getElementById("high-council-tree");
    const deptContainer = document.getElementById("dept-roster");
    if (hcContainer && siteContent.committee) {

        // --- 1. RENDER HIGH COUNCIL (The Pyramid) ---
        const hc = siteContent.committee.highCouncil;

        // Function to create a Member Card
        const createCard = (member, size = "normal") => {
            const card = document.createElement("div");

            // Size of the card container
            card.className = "flex flex-col items-center text-center group w-48 md:w-64";

            // Size of the circle
            const imgSize = size === "large"
                ? "w-40 h-40 md:w-52 md:h-52"
                : "w-32 h-32 md:w-40 md:h-40";

            const userQuote = member.quote || "Dedicated to serving the A-Level Student Committee";

            card.innerHTML = `
                <div class="relative mb-4">
                    
                    <div class="${imgSize} rounded-full overflow-hidden border-4 border-gray-100 group-hover:border-[#88113b] group-hover:shadow-[0_0_20px_rgba(136,17,59,0.3)] transition-all duration-300 p-1 bg-white relative z-30">
                        <img src="${member.image}" class="w-full h-full object-cover object-top rounded-full" loading="lazy">
                    </div>

                    <div class="absolute top-1/2 left-[90%] -translate-y-1/2 w-52 bg-white/95 backdrop-blur-sm p-5 rounded-2xl shadow-[0_8px_30px_rgba(136,17,59,0.15)] border border-[#88113b]/10 z-40 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out transform translate-x-[-10px] scale-95 group-hover:translate-x-0 group-hover:scale-100 pointer-events-none hidden md:block">
                        
                        <div class="absolute top-1/2 -left-2 -translate-y-1/2 w-4 h-4 bg-white/95 transform rotate-45 border-l border-b border-[#88113b]/10"></div>
                        
                        <span class="absolute top-2 left-3 text-[#88113b]/20 text-4xl font-serif leading-none -z-10"></span>
                        
                        <p class="text-[#88113b] text-sm font-medium italic leading-relaxed relative z-10 pl-2">
                            "${userQuote}"
                        </p>
                    </div>

                </div>

                <h4 class="font-bold text-lg leading-tight text-main mt-2">${member.name}</h4>
                <p class="text-xs font-bold text-[#88113b] uppercase tracking-widest mt-1">${member.role}</p>
            `;
            return card;
        };

        // Row 1: President (Index 0)
        const row1 = document.createElement("div");
        row1.className = "flex justify-center w-full relative";
        row1.innerHTML = `<div class="absolute -bottom-6 left-1/2 w-0.5 h-6 bg-gray-300"></div>`;
        if (hc[0]) row1.appendChild(createCard(hc[0], "large"));
        hcContainer.appendChild(row1);

        // Row 2: VPs (Index 1 & 2)
        const row2 = document.createElement("div");
        row2.className = "flex justify-center gap-12 md:gap-24 w-full relative pt-2";
        row2.innerHTML = `<div class="absolute -top-2 left-1/2 -translate-x-1/2 w-1/2 h-4 border-t-2 border-x-2 border-gray-300 rounded-t-xl"></div>`;
        if (hc[1]) row2.appendChild(createCard(hc[1]));
        if (hc[2]) row2.appendChild(createCard(hc[2]));
        hcContainer.appendChild(row2);

        // Row 3: Secs & Treasurer (Index 3, 4, 5)
        const row3 = document.createElement("div");
        row3.className = "flex flex-wrap justify-center gap-8 md:gap-16 w-full pt-6 border-t-2 border-gray-200 mt-4";
        if (hc[3]) row3.appendChild(createCard(hc[3]));
        if (hc[4]) row3.appendChild(createCard(hc[4]));
        if (hc[5]) row3.appendChild(createCard(hc[5]));
        hcContainer.appendChild(row3);


        // --- 2. RENDER DEPARTMENTS ---
        deptContainer.innerHTML = "";
        siteContent.committee.departments.forEach(dept => {
            const section = document.createElement("div");

            // Header
            let html = `
                <div class="flex items-center gap-4 mb-10 justify-center">
                    <div class="h-[2px] w-12 bg-gray-300"></div>
                    <h3 class="text-2xl font-black uppercase tracking-tight text-main">${dept.name}</h3>
                    <div class="h-[2px] w-12 bg-gray-300"></div>
                </div>
                
                <div class="flex flex-wrap justify-center gap-12 mb-12">`;

            // Add Directors
            if (dept.leaders && dept.leaders.length > 0) {
                dept.leaders.forEach(leader => {
                    const userQuote = leader.quote || "Dedicated to serving the A-Level Student Committee";

                    html += `
                        <div class="flex flex-col items-center text-center group w-48 md:w-64">
                            <div class="relative mb-4">
                                <div class="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-gray-200 group-hover:border-[#88113b] group-hover:shadow-[0_0_15px_rgba(136,17,59,0.4)] transition-all duration-300 p-1 bg-white relative z-10">
                                    <img src="${leader.image}" class="w-full h-full object-cover object-top rounded-full" loading="lazy">
                                </div>
                                <div class="absolute top-1/2 left-[90%] -translate-y-1/2 w-52 bg-white/95 backdrop-blur-sm p-5 rounded-2xl shadow-[0_8px_30px_rgba(136,17,59,0.15)] border border-[#88113b]/10 z-40 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out transform translate-x-[-10px] scale-95 group-hover:translate-x-0 group-hover:scale-100 pointer-events-none hidden md:block">
                            
                                    <div class="absolute top-1/2 -left-2 -translate-y-1/2 w-4 h-4 bg-white/95 transform rotate-45 border-l border-b border-[#88113b]/10"></div>
                                    
                                    <span class="absolute top-2 left-3 text-[#88113b]/20 text-4xl font-serif leading-none -z-10"></span>
                                    
                                    <p class="text-[#88113b] text-sm font-medium italic leading-relaxed relative z-10 pl-2">
                                        "${userQuote}"
                                    </p>
                                </div>
                            </div>
                            <h4 class="font-bold text-lg leading-tight text-main">${leader.name}</h4>
                            <p class="text-xs font-bold text-[#88113b] uppercase tracking-widest mt-1">${leader.role}</p>
                        </div>`;
                });
            };
            html += `</div>`;

            // Add General Members
            if (dept.members && dept.members.length > 0) {
                html += `<div class="flex flex-wrap justify-center gap-x-8 gap-y-12 max-w-6xl mx-auto">`;

                dept.members.forEach(member => {
                    const userQuote = member.quote || "Dedicated to serving the A-Level Student Committee";

                    html += `
                    <div class="flex flex-col items-center text-center group w-48 md:w-64">
                        <div class="relative mb-4">
                            <div class="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-gray-200 group-hover:border-[#88113b] group-hover:shadow-[0_0_15px_rgba(136,17,59,0.4)] transition-all duration-300 p-1 bg-white relative z-10">
                                <img src="${member.image}" class="w-full h-full object-cover object-top rounded-full" loading="lazy">
                            </div>
                            <div class="absolute top-1/2 left-[90%] -translate-y-1/2 w-52 bg-white/95 backdrop-blur-sm p-5 rounded-2xl shadow-[0_8px_30px_rgba(136,17,59,0.15)] border border-[#88113b]/10 z-40 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out transform translate-x-[-10px] scale-95 group-hover:translate-x-0 group-hover:scale-100 pointer-events-none hidden md:block">
                        
                                <div class="absolute top-1/2 -left-2 -translate-y-1/2 w-4 h-4 bg-white/95 transform rotate-45 border-l border-b border-[#88113b]/10"></div>
                                
                                <span class="absolute top-2 left-3 text-[#88113b]/20 text-4xl font-serif leading-none -z-10"></span>
                                
                                <p class="text-[#88113b] text-sm font-medium italic leading-relaxed relative z-10 pl-2">
                                    "${userQuote}"
                                </p>
                            </div>
                        </div>
                        <h4 class="font-bold text-lg leading-tight text-main">${member.name}</h4>
                        <p class="text-xs font-bold text-[#88113b] uppercase tracking-widest mt-1">${member.role}</p>
                    </div>`;
                });

                html += `</div>`;
            }

            section.innerHTML = html;
            deptContainer.appendChild(section);
        });

        // --- CORE STRUCTURE (Committee Page) ---
        if (siteContent.committee && siteContent.committee.coreStructure) {
            siteContent.committee.coreStructure.forEach(dept => {
                const imgEl = document.getElementById(`${dept.id}-img`);
                const titleEl = document.getElementById(`${dept.id}-title`);
                const descEl = document.getElementById(`${dept.id}-desc`);
                if (imgEl) imgEl.src = dept.image;
                if (titleEl) titleEl.textContent = dept.title;
                if (descEl) descEl.textContent = dept.description;
            });
        }
    }

    // ==========================================
    // 4. EVENTS PAGE
    // ==========================================
    const upcomingContainer = document.getElementById("events-upcoming-container");
    const pastContainer = document.getElementById("events-past-container");

    // --- Helper Function: The "Card Factory" ---
    function createEventCard(evt, isFeatured) {
        const isEnabled = evt.button_text ? evt.button_text.toLowerCase().includes("open") : false;

        // 1. SETUP LAYOUT RATIOS, GRID SPAN, TEXT SIZING
        // Featured: Image 2/5 (40%), Text 3/5 (60%)
        // Standard: Image 1/2 (50%), Text 1/2 (50%)
        const imgWidthClass = isFeatured ? "lg:w-2/5" : "lg:w-1/2";
        const txtWidthClass = isFeatured ? "lg:w-3/5" : "lg:w-1/2";
        // Featured spans 2 columns (full row). Standard spans 1 column.
        const containerSpan = isFeatured ? "lg:col-span-2" : "";
        //Make big card text slightly larger
        const titleSize = isFeatured ? "text-2xl md:text-4xl" : "text-xl font-bold";
        const padding = isFeatured ? "p-6 md:p-10" : "p-5";

        // 2. DEPARTMENT COLOR DICTIONARY
        let deptColorClass = "bg-red-100 text-red-700";
        if (evt.department) {
            const dept = evt.department.toLowerCase();
            if (dept.includes("leadership")) deptColorClass = "bg-red-100 text-red-700";
            else if (dept.includes("welfare")) deptColorClass = "bg-blue-100 text-blue-700";
            else if (dept.includes("relations")) deptColorClass = "bg-pink-100 text-pink-700";
            else if (dept.includes("comserve")) deptColorClass = "bg-green-100 text-green-700";
            else if (dept.includes("sst") || dept.includes("secretaries & treasurer")) deptColorClass = "bg-amber-100 text-amber-700";
        }

        // 3. BUILT THE HTML
        return `
        <div class="${containerSpan} border-custom rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col lg:flex-row h-full">
            
            <div class="relative w-full ${imgWidthClass} shrink-0 aspect-[4/5] overflow-hidden group">
                <img src="${evt.image}" alt="${evt.title}" loading="lazy"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
            </div>

            <div class="${padding} flex flex-col flex-grow justify-center ${txtWidthClass}">

                <div class="flex items-center gap-2 mb-4">

                    ${isFeatured ? '<span class="tag-latest">Featured</span>' : ''}
                    ${evt.department ? `<span class="px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest ${deptColorClass}">${evt.department}</span>` : ''}                    
                    ${evt.instagram_link ? `
                        <a href="${evt.instagram_link}" target="_blank" 
                    class="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] md:text-xs font-bold text-white uppercase tracking-widest bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] hover:scale-105 transition-transform shadow-sm">
                        <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                        IG
                    </a>` : ''}
                </div>
                
                <h3 class="${titleSize} font-bold mb-4 tracking-tight leading-tight">
                    ${evt.title}
                </h3>

                ${evt.date ? `
                <div class="mb-4">
                    <span class="date-chip inline-block ${deptColorClass} px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
                        ${evt.date}
                    </span>
                </div>` : ''}
                
                <p class="leading-relaxed text-main text-justify mb-8 flex-grow ${isFeatured ? 'text-base' : 'text-sm line-clamp-3 lg:line-clamp-none'}">
                    ${evt.description}
                </p>
                
                <a href="${isEnabled ? evt.registration_link : ''}" target="${isEnabled ? '_blank' : ''}" 
                class="btn-modern btn-maroon text-sm py-2.5 px-6 w-full sm:w-auto text-center ${isEnabled ? '' : 'opacity-50 cursor-not-allowed bg-gray-400 hover:bg-gray-400'} ${evt.button_text ? '' : 'hidden'}">
                    ${evt.button_text || ""}
                </a>
            </div>
        </div>`;
    }

    // Check for existence of events.html and events in content.js
    if (upcomingContainer && siteContent.eventsPage && siteContent.eventsPage.upcoming) {
        upcomingContainer.innerHTML = "";
        const events = siteContent.eventsPage.upcoming;

        // A. Render UPCOMING Events
        // Checks for events and whether got event title
        if (events.length > 0 && events[0].title) {
            events.forEach((evt, index) => {
                // Index 0 is the "Featured" (Big) card. All others are "Standard".
                const isFeatured = index === 0;
                const cardHTML = createEventCard(evt, isFeatured);
                upcomingContainer.insertAdjacentHTML('beforeend', cardHTML);
            });
        } else {
            // Render Default State
            const default_event = {
                image: siteContent.eventsPage.default.default_image,
                title: siteContent.eventsPage.default.default_title,
                description: siteContent.eventsPage.default.default_description,
                button_text: siteContent.eventsPage.default.default_button,
                date: "",
                registration_link: "#",
            }

            const isFeatured = true;
            const cardHTML = createEventCard(default_event, isFeatured);
            upcomingContainer.insertAdjacentHTML('beforeend', cardHTML)
        }
    }



    //  B. Render PAST Events
    if (pastContainer && siteContent.eventsPage && siteContent.eventsPage.past) {
        pastContainer.innerHTML = "";
        siteContent.eventsPage.past.forEach((evt, index) => {

            // 1. DEPARTMENT COLOR DICTIONARY
            //Default Colors
            let deptColorClass = "bg-red-100 text-red-700";
            let deptHoverBorderClass = "hover:border-[#88113b]";
            let deptHoverTextClass = "group-hover:text-[#88113b]";
            let deptSolidBtnClass = "bg-red-800 text-white hover:bg-red-900";

            // Departmental Colours
            if (evt.department) {
                const dept = evt.department.toLowerCase();
                if (dept.includes("leadership")) {
                    deptColorClass = "bg-red-100 text-red-700";
                    deptHoverBorderClass = "hover:border-red-500";
                    deptHoverTextClass = "group-hover:text-red-700";
                    deptSolidBtnClass = "bg-red-600 text-white hover:bg-red-700";
                }
                else if (dept.includes("welfare")) {
                    deptColorClass = "bg-blue-100 text-blue-700";
                    deptHoverBorderClass = "hover:border-blue-500";
                    deptHoverTextClass = "group-hover:text-blue-700";
                    deptSolidBtnClass = "bg-blue-600 text-white hover:bg-blue-700";
                }
                else if (dept.includes("relations")) {
                    deptColorClass = "bg-pink-100 text-pink-700";
                    deptHoverBorderClass = "hover:border-pink-500";
                    deptHoverTextClass = "group-hover:text-pink-700";
                    deptSolidBtnClass = "bg-pink-600 text-white hover:bg-pink-700";
                }
                else if (dept.includes("comserve") || dept.includes("community")) {
                    deptColorClass = "bg-green-100 text-green-700";
                    deptHoverBorderClass = "hover:border-green-500";
                    deptHoverTextClass = "group-hover:text-green-700";
                    deptSolidBtnClass = "bg-green-600 text-white hover:bg-green-700";
                }
                else if (dept.includes("sst") || dept.includes("secretaries & treasurer")) {
                    deptColorClass = "bg-amber-100 text-amber-700";
                    deptHoverBorderClass = "hover:border-amber-500";
                    deptHoverTextClass = "group-hover:text-amber-700"
                    deptSolidBtnClass = "bg-amber-600 text-white hover:bg-amber-700";
                }
            }

            //2. BUILD THE HTML
            const html = `
                <div class="border-custom rounded-2xl bg-white p-8 flex flex-col h-full ${deptHoverBorderClass} transition-colors group">
                    
                    <div class="flex flex-wrap items-center gap-2 mb-4">
                        ${evt.department ? `<span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${deptColorClass}">${evt.department}</span>` : ''}
                        
                        ${evt.instagram_link ? `
                        <a href="${evt.instagram_link}" target="_blank" class="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-widest bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] hover:scale-105 transition-transform shadow-sm">
                            <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                            IG
                        </a>` : ''}
                    </div>
                    
                    <h3 class="text-xl font-bold mb-2 ${deptHoverTextClass} transition-colors">${evt.title}</h3>
                    
                    ${evt.date ? `
                    <div class="mb-4">
                        <span class="inline-block ${deptColorClass} px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
                            ${evt.date}
                        </span>
                    </div>` : ''}

                    <p class="text-sm text-gray-600 leading-relaxed mb-6 flex-grow">${evt.description}</p>
                    
                    ${evt.image_folder ? `
                        <button onclick="openGallery(${index})" class="rounded-xl font-bold w-full text-sm py-3 transition-colors ${deptSolidBtnClass}">
                            View Photos
                        </button>
                    ` : `
                        <button disabled class="rounded-xl font-bold w-full text-sm py-3 bg-gray-100 text-gray-400 cursor-not-allowed">
                            Photos Coming Soon!
                        </button>
                    `}
                    
                </div>`;

            pastContainer.insertAdjacentHTML('beforeend', html);
        });
    }

    // ==========================================
    //  5. NEWSLETTER PAGE
    // ==========================================
    const newsletterContainer = document.getElementById("newsletter-list-container");
    const newsletterHero = document.getElementById("newsletter-hero-bg");

    if (newsletterContainer && siteContent.newsletterPage) {

        // 1. Set Background Image
        if (newsletterHero) {
            newsletterHero.style.backgroundImage = `url('${siteContent.newsletterPage.heroImage}')`;
        }

        // 2. Render Newsletters
        newsletterContainer.innerHTML = "";
        const news = siteContent.newsletterPage.newsletters;

        if (news.length > 0) {
            // A. LATEST NEWSLETTER (The Big Horizontal Card)
            const latest = news[0];
            const isLatDisabled = latest.button_text.toLowerCase().includes("soon");

            const latestHTML = `
                <div class="border-custom rounded-3xl bg-white overflow-hidden flex flex-col md:flex-row shadow-sm hover:shadow-md transition-shadow">
                    <div class="md:w-3/5 relative h-64 md:h-auto overflow-hidden group">
                        <img src="${latest.image}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                    </div>
                    <div class="md:w-2/5 p-6 md:p-10 flex flex-col justify-center items-start">
                        <div class="flex items-center gap-3 mb-6">
                            <span class="tag-latest">Latest</span>
                            <span class="date-chip tracking-tight">${latest.date}</span>
                        </div>
                        <h2 class="text-2xl md:text-3xl font-bold mb-4 tracking-tight">${latest.title}</h2>
                        <p class="leading-relaxed text-base text-main text-justify mb-8">${latest.description}</p>
                        <a href="${isLatDisabled ? '#' : latest.pdf_link}" target="${isLatDisabled ? '' : '_blank'}" 
                           class="btn-modern btn-maroon text-base py-2.5 px-6 w-full sm:w-auto ${isLatDisabled ? 'opacity-50 cursor-not-allowed bg-gray-400 hover:bg-gray-400' : ''}">
                            ${latest.button_text}
                        </a>
                    </div>
                </div>`;

            newsletterContainer.insertAdjacentHTML('beforeend', latestHTML);

            // B. OLDER NEWSLETTERS (The Grid)
            if (news.length > 1) {
                const gridDiv = document.createElement("div");
                gridDiv.className = "grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10";

                for (let i = 1; i < news.length; i++) {
                    const item = news[i];
                    const isDisabled = item.button_text.toLowerCase().includes("soon");

                    const cardHTML = `
                        <div class="border-custom rounded-3xl bg-white overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow">
                            <div class="h-48 overflow-hidden relative group">
                                <img src="${item.image}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                            </div>
                            
                            <div class="p-6 md:p-8 flex flex-col flex-grow">
                                <div class="flex items-center gap-3 mb-4">
                                    <span class="date-chip">${item.date}</span>
                                </div>
                                <h3 class="text-2xl font-bold mb-3">${item.title}</h3>
                                <p class="leading-relaxed text-base text-main text-justify mb-8 flex-grow">${item.description}</p>
                                <div class="flex justify-start">
                                    <a href="${isDisabled ? '#' : item.pdf_link}" target="${isDisabled ? '' : '_blank'}"
                                        class="btn-modern btn-maroon text-base py-2.5 px-6 w-full sm:w-auto ${isDisabled ? 'opacity-50 cursor-not-allowed bg-gray-400 hover:bg-gray-400' : ''}">
                                        ${item.button_text}
                                    </a>
                                </div>
                            </div>
                        </div>`;
                    gridDiv.insertAdjacentHTML('beforeend', cardHTML);
                }
                newsletterContainer.appendChild(gridDiv);
            }
        }
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

        // C. Submission Forms
        setLink("btn-submit-participation", siteContent.alstarPage.forms.participation);
        setLink("btn-submit-volunteer", siteContent.alstarPage.forms.volunteer);
        setLink("btn-submit-talk", siteContent.alstarPage.forms.talk);

        // D. Google Calendar Embed
        const calFrame = document.getElementById("calendar-frame");
        if (calFrame) calFrame.src = siteContent.alstarPage.calendar;
    }
}

// The function that animates opening and closing (Smooth Grid Version)
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

// ==========================================
// 4. NEWSLETTER SUBSCRIBING LOGIC
// ==========================================
async function submitNewsletter() {
    // a. Get Elements
    const emailInput = document.getElementById("newsletter-email-input");
    const btn = document.getElementById("newsletter-sub-btn");
    const successMsg = document.getElementById("newsletter-success-msg");
    const errorMsg = document.getElementById("newsletter-error-msg");

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

// ==========================================
// GALLERY MODAL LOGIC
// ==========================================

function openGallery(eventIndex) {
    // 1. Get the data for the specific event clicked
    const evt = siteContent.eventsPage.past[eventIndex];
    if (!evt || !evt.image_folder) return;

    // 2. Grab the modal elements
    const modal = document.getElementById('gallery-modal');
    const titleEl = document.getElementById('modal-title');
    const gridEl = document.getElementById('modal-grid');
    const videoContainer = document.getElementById('modal-video-container');

    // 3. Set the Title
    titleEl.textContent = evt.title;

    // 4. Build the Pinterest Masonry Layout using our 1-10 loop!
    gridEl.innerHTML = ""; // Clear out any old images

    for (let i = 1; i <= 20; i++) {
        const imagePath = `${evt.image_folder}/${i}.avif`;

        const imgHTML = `
            <div class="mb-3 md:mb-4 break-inside-avoid rounded-2xl overflow-hidden group bg-gray-100 relative">
                <img src="${imagePath}" 
                     alt="${evt.title} photo ${i}" 
                     loading="lazy" 
                     onerror="this.parentElement.style.display='none'"
                     class="w-full h-auto block group-hover:scale-105 transition-transform duration-500">
            </div>
        `;
        gridEl.insertAdjacentHTML('beforeend', imgHTML);
    }

    // 5. Build the Video Section
    if (evt.video_path) {
        videoContainer.style.display = "block";
        videoContainer.innerHTML = `
            <video controls class="w-full max-h-[70vh] object-cover">
                <source src="${evt.video_path}" type="video/mp4">
                Your browser does not support the video tag.
            </video>
        `;
    } else {
        videoContainer.style.display = "none";
        videoContainer.innerHTML = "";
    }

    // 6. Show Modal and Lock Background Scroll
    modal.classList.remove('opacity-0', 'pointer-events-none');
    document.body.classList.add('overflow-hidden');
}

function closeGallery() {
    const modal = document.getElementById('gallery-modal');
    const videoContainer = document.getElementById('modal-video-container');

    // 1. Hide Modal and Unlock Scroll
    modal.classList.add('opacity-0', 'pointer-events-none');
    document.body.classList.remove('overflow-hidden');

    // 2. Destroy the video so it stops playing in the background
    setTimeout(() => {
        videoContainer.innerHTML = "";
    }, 300); // Wait for the fade-out animation to finish first
}


// NAVIGATION BAR DYAMIC LOADING FUNCTION
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
            wrapper.className = "flex flex-col gap-3 items-center text-center";

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
            link.addEventListener("click", () => {
                toggleMenu();
            });
        });
    }
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && isOpen) {
            toggleMenu();
        }
    });
    renderMenu();

    function handleScroll() {
        if (window.scrollY > 200) {
            // Scrolled down: Hide navbar
            navbar.classList.remove('translate-y-0', 'opacity-100');
            navbar.classList.add('-translate-y-full', 'opacity-0');
        } else {
            // At the top: Show navbar
            navbar.classList.remove('-translate-y-full', 'opacity-0');
            navbar.classList.add('translate-y-0', 'opacity-100');

        }
    }

    // 1. Listen for standard scrolling
    window.addEventListener('scroll', handleScroll);

    // 2. Run it immediately once on page load to set the correct initial state
    handleScroll();
}

// ==========================================
// 5. Initialise Everything
// ==========================================
document.addEventListener("DOMContentLoaded", async () => {
    await loadComponent("navbar-placeholder", "nav.html");
    await loadComponent("footer-placeholder", "footer.html");

    // Run content update ONLY if siteContent is loaded
    if (typeof siteContent !== 'undefined') {
        updateSiteContent();
        navbarManagement();
    } else {
        console.error("content.js not loaded!");
    }

});