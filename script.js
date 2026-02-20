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

    // ==========================================
    // 1. HERO PAGE
    // ==========================================

    //  A. HERO SECTION
    setImage("hero-img", siteContent.home.hero.image);
    setText("hero-desc", siteContent.home.hero.description);
    setLink("hero-handbook-btn", siteContent.home.hero.handbook_pdf);

    //  B. AFFILIATES 
    const affiliateContainer = document.getElementById("affiliates-grid");
    if (affiliateContainer && siteContent.home.affiliates) {
        // Clear any existing content first
        affiliateContainer.innerHTML = "";

        siteContent.home.affiliates.forEach(partner => {
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

    //  C. FEATURED EVENT
    setImage("event-img", siteContent.home.featuredEvent.image);
    setText("event-title", siteContent.home.featuredEvent.title);
    setText("event-desc", siteContent.home.featuredEvent.description);
    setText("event-reg-btn-text", siteContent.home.featuredEvent.button_text); // Set button text

    //  C1. If button = "Registration is Open", will link to form. Otherwise, will be disable or link to events page.
    const eventBtn = document.getElementById("event-reg-btn");
    if (eventBtn) {
        if (siteContent.home.featuredEvent.button_text.toLowerCase().includes("open")) {
            eventBtn.href = siteContent.home.featuredEvent.registration_link;
        } else {
            eventBtn.href = "/events.html"; // Default fallback
        }
    }

    //  D. NEWSLETTER
    setImage("news-img", siteContent.home.newsletter.image);
    setText("news-title", siteContent.home.newsletter.title);
    setText("news-desc", siteContent.home.newsletter.description);
    setLink("news-read-btn", siteContent.home.newsletter.pdf_link);

    //  E. FAQ SECTION
    siteContent.home.faq.forEach((item, index) => {
        const num = index + 1; // 1, 2, 3
        setText(`faq-q${num}`, item.question);
        setText(`faq-a${num}`, item.answer);
    });

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
                        <img src="${member.image}" class="w-full h-full object-cover object-top rounded-full">
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
            dept.leaders.forEach(leader => {
                const userQuote = leader.quote || "Dedicated to serving the A-Level Student Committee";

                html += `
                    <div class="flex flex-col items-center text-center group w-48 md:w-64">
                        <div class="relative mb-4">
                            <div class="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-gray-200 group-hover:border-[#88113b] group-hover:shadow-[0_0_15px_rgba(136,17,59,0.4)] transition-all duration-300 p-1 bg-white relative z-10">
                                <img src="${leader.image}" class="w-full h-full object-cover object-top rounded-full">
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
                                <img src="${member.image}" class="w-full h-full object-cover object-top rounded-full">
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

    // Check for existence of events.html and events in content.js
    if (upcomingContainer && siteContent.eventsPage && siteContent.eventsPage.upcoming) {
        upcomingContainer.innerHTML = "";
        const events = siteContent.eventsPage.upcoming;

        // A. Render UPCOMING Events
        if (events.length > 0) {
            events.forEach((evt, index) => {
                // Index 0 is the "Featured" (Big) card. All others are "Standard".
                const isFeatured = index === 0;
                const cardHTML = createEventCard(evt, isFeatured);
                upcomingContainer.insertAdjacentHTML('beforeend', cardHTML);
            });
        }
    }

    // --- Helper Function: The "Card Factory" ---
    function createEventCard(evt, isFeatured) {
        const isEnabled = evt.button_text.toLowerCase().includes("Register");

        // 1. SETUP LAYOUT RATIOS
        // Featured: Image 2/5 (40%), Text 3/5 (60%)
        // Standard: Image 1/2 (50%), Text 1/2 (50%)
        const imgWidthClass = isFeatured ? "lg:w-2/5" : "lg:w-1/2";
        const txtWidthClass = isFeatured ? "lg:w-3/5" : "lg:w-1/2";

        // 2. SETUP GRID SPAN
        // Featured spans 2 columns (full row). Standard spans 1 column.
        const containerSpan = isFeatured ? "lg:col-span-2" : "";

        // 3. SETUP TEXT SIZING (Optional: Make big card text slightly larger)
        const titleSize = isFeatured ? "text-2xl md:text-4xl" : "text-xl font-bold";
        const padding = isFeatured ? "p-6 md:p-10" : "p-5";

        return `
        <div class="${containerSpan} border-custom rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col lg:flex-row h-full">
            
            <div class="relative w-full ${imgWidthClass} shrink-0 aspect-[4/5] overflow-hidden group">
                <img src="${evt.image}" alt="${evt.title}" 
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
            </div>

            <div class="${padding} flex flex-col flex-grow justify-center ${txtWidthClass}">
                <div class="flex items-center gap-3 mb-4">
                    ${isFeatured ? '<span class="tag-latest">Featured</span>' : ''}
                    <span class="date-chip text-sm">${evt.date}</span>
                </div>
                
                <h3 class="${titleSize} font-bold mb-4 tracking-tight leading-tight">
                    ${evt.title}
                </h3>
                
                <p class="leading-relaxed text-main text-justify mb-8 flex-grow ${isFeatured ? 'text-base' : 'text-sm line-clamp-3 lg:line-clamp-none'}">
                    ${evt.description}
                </p>
                
                <a href="${isEnabled ? evt.registration_link : ''}" target="${isEnabled ? '_blank' : ''}" 
                class="btn-modern btn-maroon text-sm py-2.5 px-6 w-full sm:w-auto text-center ${isEnabled ? 'opacity-50 cursor-not-allowed bg-gray-400 hover:bg-gray-400' : ''}">
                    ${evt.button_text}
                </a>
            </div>
        </div>`;
    }

    //  B. Render PAST Events
    if (pastContainer && siteContent.eventsPage && siteContent.eventsPage.past) {
        pastContainer.innerHTML = "";
        siteContent.eventsPage.past.forEach(evt => {
            const html = `
                <div class="border-custom rounded-2xl bg-white p-8 flex flex-col h-full hover:border-[#88113b] transition-colors group">
                    <div class="flex justify-between items-start mb-4">
                        <span class="text-xs font-bold text-gray-400 uppercase tracking-widest">${evt.date}</span>
                        <span class="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-bold text-gray-600 uppercase">${evt.department}</span>
                    </div>
                    <h3 class="text-xl font-bold mb-3 group-hover:text-[#88113b] transition-colors">${evt.title}</h3>
                    <p class="text-sm text-gray-600 leading-relaxed mb-6 flex-grow">${evt.description}</p>
                    <button onclick="loadDriveGallery('${evt.driveFolderID}')" class="btn-modern btn-ghost w-full text-sm py-2">
                        View Photos
                    </button>
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
// 5. GOOGLE DRIVE GALLERY LOGIC
// ==========================================

// a. Global variables to track state
let currentGalleryImages = [];
let currentImageIndex = 0;
const GALLERY_API_URL = "https://script.google.com/macros/s/AKfycbynT_f15st6P_R9qFUfCoYWtQp2xZ0eytgB6JbRazJ2JbkH3fVa_2-kZ3qpPa8p6PbOUA/exec";

// b. Load google drive folder
async function loadDriveGallery(folderId) {
    if (!folderId) return alert("No folder linked for this event.");

    // 1. Show Modal & Loader
    const modal = document.getElementById('gallery-modal');
    const loader = document.getElementById('gallery-loader');
    const imgEl = document.getElementById('gallery-main-image');

    modal.classList.remove('hidden');
    // Tiny delay to allow CSS transition
    setTimeout(() => modal.classList.remove('opacity-0'), 10);

    loader.textContent = "Fetching images from Drive...";
    loader.classList.remove('hidden');
    imgEl.classList.add('hidden');

    try {
        // 2. Call your Apps Script
        const response = await fetch(`${GALLERY_API_URL}?folderId=${folderId}`);
        const data = await response.json();

        if (data.error) throw new Error(data.error);
        if (data.length === 0) throw new Error("No images found in this folder.");

        // 3. Setup Gallery
        currentGalleryImages = data; // Array of objects {id, url}
        currentImageIndex = 0;

        loader.classList.add('hidden'); // Hide loader
        imgEl.classList.remove('hidden'); // Show image tag

        showImage(); // Display first image

    } catch (error) {
        console.error(error);
        loader.textContent = "Error: " + error.message;
    }
}

// c. Gallery functions
function showImage() {
    const imgEl = document.getElementById('gallery-main-image');
    const counterEl = document.getElementById('gallery-counter');

    // Set source
    // Note: Drive images might load slowly. 
    imgEl.src = currentGalleryImages[currentImageIndex].url;

    // Update counter
    counterEl.textContent = `${currentImageIndex + 1} / ${currentGalleryImages.length}`;
}

function nextImage() {
    if (currentGalleryImages.length === 0) return;
    currentImageIndex = (currentImageIndex + 1) % currentGalleryImages.length;
    showImage();
}

function prevImage() {
    if (currentGalleryImages.length === 0) return;
    currentImageIndex = (currentImageIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length;
    showImage();
}

function closeGallery() {
    const modal = document.getElementById('gallery-modal');
    modal.classList.add('opacity-0');

    // Wait for fade out animation before hiding
    setTimeout(() => {
        modal.classList.add('hidden');
        document.getElementById('gallery-main-image').src = ""; // Clear image
    }, 300);
}

// Keyboard Navigation Support
document.addEventListener('keydown', function (event) {
    const modal = document.getElementById('gallery-modal');
    if (modal && !modal.classList.contains('hidden')) {
        if (event.key === "Escape") closeGallery();
        if (event.key === "ArrowRight") nextImage();
        if (event.key === "ArrowLeft") prevImage();
    }
});

// ==========================================
// 6. Initialise Everything
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    loadComponent("navbar-placeholder", "nav.html");
    loadComponent("footer-placeholder", "footer.html");

    // Run content update ONLY if siteContent is loaded
    if (typeof siteContent !== 'undefined') {
        updateSiteContent();
    } else {
        console.error("content.js not loaded!");
    }
});