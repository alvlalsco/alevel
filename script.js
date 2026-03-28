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

    // --- FEATURED EVENT DATA ---

    // --- HELPER FUNCTION: Department Colors ---
    // You can customize the keywords and Tailwind color classes here!
    function getDepartmentColors(deptName) {
        const name = deptName.toLowerCase();

        if (name.includes('leadership')) return 'bg-red-100 text-red-800';
        if (name.includes('comserve')) return 'bg-green-100 text-green-800';
        if (name.includes('public relations')) return 'bg-rose-100 text-rose-800';
        if (name.includes('student welfare')) return 'bg-blue-100 text-blue-800';

        // Default fallback color if no keywords match
        return 'bg-red-100 text-red-800';
    }

    // --- C. FEATURED EVENT INJECTION LOGIC ---
    const eventData = siteContent.index.featuredEvent;

    if (eventData && eventData.title) {
        setImage("event-img", eventData.image);
        setImage("event-qr-img", eventData.qr_image);
        setText("event-title", eventData.title);
        setText("event-desc", eventData.description);
        setText("event-reg-btn-text", eventData.button_text);

        // Inject New Fields: Date
        const dateEl = document.getElementById("event-date");
        if (dateEl && eventData.date) {
            dateEl.textContent = eventData.date;
            dateEl.classList.remove("hidden");
        }

        // Inject New Fields: Department Tag
        const deptEl = document.getElementById("event-department");
        if (deptEl && eventData.department) {
            deptEl.textContent = eventData.department;
            // Keep baseline classes, append dynamic colors
            deptEl.className = `px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-block ${getDepartmentColors(eventData.department)}`;
        }

        // Inject New Fields: Instagram Link
        const igEl = document.getElementById("event-ig-link");
        if (igEl && eventData.ig_link) {
            igEl.href = eventData.ig_link;
            igEl.classList.remove("hidden");
        }

        // Button Logic
        const eventBtn = document.getElementById("event-reg-btn");
        if (eventBtn) {
            if (eventData.button_text.toLowerCase().includes("open")) {
                eventBtn.href = eventData.registration_link;
            } else {
                eventBtn.href = "#";
            }
        }

    } else {
        // Fallback logic
        setImage("event-img", siteContent.eventsPage.default.default_image);
        setText("event-title", siteContent.eventsPage.default.default_title);
        setText("event-desc", siteContent.eventsPage.default.default_description);
        setText("event-reg-btn-text", siteContent.eventsPage.default.default_button);

        // Hide the new elements if there is no featured event
        document.getElementById("event-department")?.classList.add("hidden");
        document.getElementById("event-ig-link")?.classList.add("hidden");
        document.getElementById("event-date")?.classList.add("hidden");

        const eventBtn = document.getElementById("event-reg-btn");
        if (eventBtn) {
            eventBtn.style.display = "none";
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
    const hcContainer = document.getElementById("high-council-tree");
    const deptRoster = document.getElementById("dept-roster");
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
                    
                    <div class="${imgSize} rounded-full overflow-hidden border-4 border-gray-100 group-hover:border-maroon group-hover:shadow-[0_0_20px_rgba(136,17,59,0.3)] transition-all duration-300 p-1 bg-white relative z-30">
                        <img src="${member.image}" class="w-full h-full object-cover object-top rounded-full" loading="lazy">
                    </div>

                    <div class="absolute top-1/2 left-[90%] -translate-y-1/2 w-52 bg-white/95 backdrop-blur-sm p-5 rounded-2xl shadow-[0_8px_30px_rgba(136,17,59,0.15)] border border-maroon/10 z-40 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out transform translate-x-2.5 scale-95 group-hover:translate-x-0 group-hover:scale-100 pointer-events-none hidden md:block">
                        
                        <div class="absolute top-1/2 -left-2 -translate-y-1/2 w-4 h-4 bg-white/95 transform rotate-45 border-l border-b border-maroon/10"></div>
                        
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
        deptRoster.innerHTML = "";
        siteContent.committee.departments.forEach(dept => {
            const section = document.createElement("div");

            // Header
            let html = `
                <div class="flex items-center gap-4 mb-10 justify-center">
                    <div class="h-0.5 w-12 bg-gray-300"></div>
                    <h3 class="text-2xl font-black uppercase tracking-tight text-main">${dept.name}</h3>
                    <div class="h-0.5 w-12 bg-gray-300"></div>
                </div>
                
                <div class="flex flex-wrap justify-center gap-12 mb-12">`;

            // Add Directors
            if (dept.leaders && dept.leaders.length > 0) {
                dept.leaders.forEach(leader => {
                    const userQuote = leader.quote || "Dedicated to serving the A-Level Student Committee";

                    html += `
                        <div class="flex flex-col items-center text-center group w-48 md:w-64">
                            <div class="relative mb-4">
                                <div class="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-gray-200 group-hover:border-maroon group-hover:shadow-[0_0_15px_rgba(136,17,59,0.4)] transition-all duration-300 p-1 bg-white relative z-10">
                                    <img src="${leader.image}" class="w-full h-full object-cover object-top rounded-full" loading="lazy">
                                </div>
                                <div class="absolute top-1/2 left-[90%] -translate-y-1/2 w-52 bg-white/95 backdrop-blur-sm p-5 rounded-2xl shadow-[0_8px_30px_rgba(136,17,59,0.15)] border border-maroon/10 z-40 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out transform translate-x-2.5 scale-95 group-hover:translate-x-0 group-hover:scale-100 pointer-events-none hidden md:block">
                            
                                    <div class="absolute top-1/2 -left-2 -translate-y-1/2 w-4 h-4 bg-white/95 transform rotate-45 border-l border-b border-maroon/10"></div>
                                    
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

            // Add General Members
            if (dept.members && dept.members.length > 0) {
                html += `<div class="flex flex-wrap justify-center gap-x-8 gap-y-12 max-w-6xl mx-auto">`;

                dept.members.forEach(member => {
                    const userQuote = member.quote || "Dedicated to serving the A-Level Student Committee";

                    html += `
                    <div class="flex flex-col items-center text-center group w-48 md:w-64">
                        <div class="relative mb-4">
                            <div class="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-gray-200 group-hover:border-maroon group-hover:shadow-[0_0_15px_rgba(136,17,59,0.4)] transition-all duration-300 p-1 bg-white relative z-10">
                                <img src="${member.image}" class="w-full h-full object-cover object-top rounded-full" loading="lazy">
                            </div>
                            <div class="absolute top-1/2 left-[90%] -translate-y-1/2 w-52 bg-white/95 backdrop-blur-sm p-5 rounded-2xl shadow-[0_8px_30px_rgba(136,17,59,0.15)] border border-maroon/10 z-40 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out transform translate-x-2.5 scale-95 group-hover:translate-x-0 group-hover:scale-100 pointer-events-none hidden md:block">
                        
                                <div class="absolute top-1/2 -left-2 -translate-y-1/2 w-4 h-4 bg-white/95 transform rotate-45 border-l border-b border-maroon/10"></div>
                                
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
            deptContainer.innerHTML = ""; // Clear the loading text

            siteContent.committee.coreStructure.forEach(dept => {

                // 1. Build the Instagram Button (Only if a link exists in content.js)
                const igHTML = dept.ig_link ? `
                    <a href="${dept.ig_link}" target="_blank" class="mt-6 inline-flex w-fit items-center gap-2 text-maroon hover:text-[#E1306C] font-bold transition-colors group/link">
                        <svg class="w-5 h-5 transform group-hover/link:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                            <path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clip-rule="evenodd" />
                        </svg>
                        Follow ${dept.title}
                    </a>
                ` : '';

                // 2. Build the full Card HTML
                const cardHTML = `
                    <div class="border-custom bg-white overflow-hidden rounded-2xl flex flex-col group shadow-sm hover:shadow-md transition-shadow">
                        
                        <div class="relative w-full aspect-5/4 bg-gray-100 overflow-hidden">
                            
                            <img src="${dept.image}" alt="${dept.title} Formal" loading="lazy"
                                class="absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-600 group-hover:opacity-0">
                            
                            <img src="${dept.image_playful}" alt="${dept.title} Playful" loading="lazy"
                                class="absolute inset-0 w-full h-full object-cover object-top opacity-0 transition-all duration-600 group-hover:opacity-100 transform group-hover:scale-105">
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

                // 1. Department Color Dictionary
                let deptColorClass = "bg-red-100 text-red-700";
                if (evt.department) {
                    const dept = evt.department.toLowerCase();
                    if (dept.includes("leadership")) deptColorClass = "bg-red-100 text-red-700";
                    else if (dept.includes("welfare")) deptColorClass = "bg-blue-100 text-blue-700";
                    else if (dept.includes("relations")) deptColorClass = "bg-pink-100 text-pink-700";
                    else if (dept.includes("comserve") || dept.includes("community")) deptColorClass = "bg-green-100 text-green-700";
                    else if (dept.includes("sst") || dept.includes("secretaries")) deptColorClass = "bg-amber-100 text-amber-700";
                }

                // 2. Zig-Zag Stagger & Links
                const staggerClass = (index % 2 !== 0) ? "md:mt-24" : "";
                const regLink = evt.registration_link || "#";
                const target = regLink !== "#" ? "_blank" : "";

                // 3. New Event Type Tag (ETR / AE)
                const typeTagHTML = evt.event_type ? `<span class="px-3 py-1.5 md:px-3 md:py-1.5 rounded-full text-[9px] md:text-xs font-bold uppercase tracking-widest shadow-sm bg-maroon text-white backdrop-blur-md bg-opacity-90 whitespace-nowrap">${evt.event_type}</span>` : '';

                // 4. Build the HTML Card
                const html = `
                <div class="flex flex-col gap-3 ${staggerClass}">
                    <div class="flex justify-between items-center w-full">

                        <div class="flex flex-row flex-wrap-reverse gap-2 md:gap-1.5 items-center justify-start flex-1">
                            ${typeTagHTML}
                            ${evt.department ? `<span class="px-3 py-1.5 md:px-2 md:py-1 rounded-full text-[9px] md:text-xs font-bold uppercase tracking-widest shadow-sm backdrop-blur-md ${deptColorClass} bg-opacity-90 whitespace-nowrap">${evt.department}</span>` : ''}
                            ${evt.date ? `<span class="px-3 py-1.5 md:px-2 md:py-1 rounded-full text-[9px] md:text-xs font-bold uppercase tracking-widest shadow-sm bg-black/80 text-white backdrop-blur-md whitespace-nowrap">${evt.date}</span>` : ''}
                        </div>

                        ${evt.instagram_link ? `
                        <a href="${evt.instagram_link}" target="_blank" aria-label="Instagram"
                            class="shirnk-0 bg-[#E1306C] text-white p-2.5 md:p-2 rounded-full transition-all duration-300 lg:hover:scale-110 lg:hover:shadow-lg mt-0.5">
                            <svg class="w-5 h-5 md:w-4 md:h-4 fill-current" viewBox="0 0 24 24">
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
                            <svg class="w-5 h-5 md:w-4 md:h-4 " fill="currentColor" viewBox="0 0 24 24">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                            </svg>
                        </button>

                        <div class="absolute inset-0 z-20 flex items-center justify-center transition-all duration-500 lg:group-hover:bg-black/30 group-[.show-qr]:opacity-0 pointer-events-none">
                            
                            <a href="${regLink}" target="${target}" 
                                class="pointer-events-auto text-white font-bold bg-black/40 lg:bg-transparent lg:hover:bg-white lg:hover:text-maroon tracking-[0.2em] uppercase opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-500 transform lg:translate-y-4 lg:group-hover:translate-y-0 border-2 border-white md:px-4 md:py-1.5 text-[10px] md:text-sm px-6 py-2 rounded-full backdrop-blur-sm ${regLink === '#' ? 'cursor-not-allowed hover:bg-transparent hover:text-white' : ''}">
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

        // Override default classes to force the zig-zag layout
        pastContainer.className = "grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 items-start mt-8";

        siteContent.eventsPage.past.forEach((evt, index) => {

            // 1. Department Color Dictionary
            let deptColorClass = "bg-red-100 text-red-700";
            if (evt.department) {
                const dept = evt.department.toLowerCase();
                if (dept.includes("leadership")) deptColorClass = "bg-red-100 text-red-700";
                else if (dept.includes("welfare")) deptColorClass = "bg-blue-100 text-blue-700";
                else if (dept.includes("relations")) deptColorClass = "bg-rose-100 text-rose-700";
                else if (dept.includes("comserve") || dept.includes("community")) deptColorClass = "bg-green-100 text-green-700";
                else if (dept.includes("sst") || dept.includes("secretaries")) deptColorClass = "bg-amber-100 text-amber-700";
            }

            // 2. Zig-Zag Stagger & Links
            const staggerClass = (index % 2 !== 0) ? "md:mt-24" : "";
            const link = evt.instagram_link || "#";
            const target = evt.instagram_link ? "_blank" : "";

            // 3. Build the HTML Card
            const html = `
                <div class="relative block rounded-3xl overflow-hidden shadow-lg border border-gray-200 group ${staggerClass}">

                    <img src="${evt.image}" alt="${evt.title}" loading="lazy"
                         class="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105">

                    <div class="absolute top-4 left-4 right-4 flex justify-between items-start z-20 pointer-events-none">
                        <div class="flex flex-col gap-2 items-start">
                            ${evt.department ? `<span class="px-3 py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest shadow-sm backdrop-blur-md ${deptColorClass} bg-opacity-90">${evt.department}</span>` : ''}
                            ${evt.date ? `<span class="px-3 py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest shadow-sm bg-black/80 text-white backdrop-blur-md">${evt.date}</span>` : ''}
                        </div>

                        ${evt.instagram_link ? `
                        <div class="bg-white/95 backdrop-blur-sm p-2 rounded-full shadow-md text-[#E1306C]">
                            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                        </div>
                        ` : ''}
                    </div>

                    <a href="${link}" target="${target}"
                       class="absolute inset-0 z-10 bg-black/0 group-hover:bg-black/75 transition-colors duration-500 flex flex-col items-center justify-center p-6 text-center ${!evt.instagram_link ? 'cursor-not-allowed' : ''}">

                        <h3 class="text-white text-2xl md:text-3xl font-bold mb-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-6 group-hover:translate-y-0">
                            ${evt.title}
                        </h3>

                        <span class="text-white font-bold tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-6 group-hover:translate-y-0 border-2 border-white px-8 py-3 rounded-full backdrop-blur-sm hover:bg-white hover:text-black">
                            ${evt.instagram_link ? 'View on IG' : 'No Link Available'}
                        </span>
                    </a>
                </div>`;

            pastContainer.insertAdjacentHTML('beforeend', html);
        });
    }

    // ==========================================
    //  5. NEWSLETTER PAGE
    // ==========================================
    const newsletterContainer = document.getElementById("newsletter-list-container");
    const newsletterHero = document.getElementById("newsletter-hero-bg");
    const newsData = siteContent.newsletterPage.newsletters; // The raw data

    if (newsletterContainer && newsData) {

        // 1. Set Background Image
        if (newsletterHero) {
            newsletterHero.style.backgroundImage = `url('${siteContent.newsletterPage.heroImage}')`;
        }

        // 2. THE RENDERING FUNCTION
        function renderGallery(filterCategory) {
            newsletterContainer.innerHTML = ""; // Clear the board

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

                    // Check if this specific item has an Instagram link in the data
                    const igButtonHTML = item.ig_link ? `
                        <a href="${item.ig_link}" target="_blank" aria-label="Watch on Instagram"
                           class="absolute top-4 left-4 z-30 lg:bg-black/40 bg-[#E1306C] backdrop-blur-md border border-white/20 text-white p-2.5 rounded-full transition-all duration-300 lg:hover:bg-[#E1306C] lg:hover:scale-110 lg:hover:shadow-lg group/ig">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clip-rule="evenodd" />
                            </svg>
                        </a>
                    ` : ''; // If no link exists, inject nothing!

                    const cardHTML = `
                        <div class="relative block rounded-2xl overflow-hidden shadow-lg border border-gray-200 group ${staggerClass} ${isDisabled ? 'opacity-80' : ''}">
                            
                            <img src="${item.image}" alt="${item.title}" loading="lazy"
                                 class="w-full h-auto object-cover transform transition-transform duration-700">
                            
                            ${igButtonHTML}
                            
                            <a href="${link}" target="${target}" 
                               class="absolute inset-0 z-10 bg-black/0 lg:group-hover:bg-black/30 transition-colors duration-500 flex items-center justify-center ${isDisabled ? 'cursor-not-allowed' : ''}">
                                
                                <span class="text-white font-bold bg-black/20 lg:bg-transparent lg:hover:bg-white lg:hover:text-maroon tracking-[0.2em] uppercase opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-500 transform lg:translate-y-4 lg:group-hover:translate-y-0 border-2 border-white px-6 py-2 rounded-full backdrop-blur-sm">
                                    ${isDisabled ? 'Coming Soon' : item.button_text}
                                </span>
                            </a>
                        </div>
                    `;
                    gridDiv.insertAdjacentHTML('beforeend', cardHTML);
                });

                newsletterContainer.appendChild(gridDiv);
            } else {
                newsletterContainer.innerHTML = `<p class="text-center text-gray-400 py-12">No documents found in this category.</p>`;
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

    function handleScroll() {
        // 🔥 THE FIX: If the menu is open, ignore scrolling entirely!
        if (isOpen) return;

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