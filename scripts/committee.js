// 4. Initialize Core Layout
document.addEventListener("DOMContentLoaded", async () => {

    // 2. Initialize Navigation Logic (Requires siteContent to be loaded first)
    if (typeof siteContent !== 'undefined') {
        // ==========================================
        // 3. COMMITTEE PAGE
        // ==========================================

        // --- Mobile Interaction Logic ---
        // --- Mobile Interaction & Collision Logic ---
        window.toggleQuote = function (event, btn) {
            event.stopPropagation();
            const popup = btn.nextElementSibling;
            const arrow = popup.querySelector('.popup-arrow');
            // Get the parent card container
            const card = btn.closest('.group\\/card');
            const isVisible = popup.classList.contains('opacity-100');

            // Hide all other open popups first
            document.querySelectorAll('.quote-popup').forEach(p => {
                p.classList.remove('opacity-100', 'scale-100');
                p.classList.add('opacity-0', 'scale-95');
            });

            if (!isVisible) {

                // Mobile Collision Detection
                if (window.innerWidth < 768 && card && popup && arrow) {
                    // Measure where the card is physically located on the screen
                    const rect = card.getBoundingClientRect();
                    const cardCenter = rect.left + rect.width / 2;
                    const screenCenter = window.innerWidth / 2;
                    const threshold = 30; // Pixel margin to consider a card "centered"

                    // 1. Strip ALL mobile positioning classes first to start with a blank slate
                    popup.classList.remove(
                        'top-full', 'left-1/2', '-translate-x-1/2', 'mt-4',
                        'top-1/2', 'left-[90%]', '-translate-y-1/2', 'translate-x-2.5',
                        'right-[90%]', '-translate-x-2.5', 'left-auto'
                    );

                    arrow.classList.remove(
                        '-top-2', 'left-1/2', '-translate-x-1/2', 'border-t', 'border-l',
                        '-left-2', 'top-1/2', '-translate-y-1/2', 'border-b',
                        '-right-2', 'border-r', 'left-auto'
                    );

                    // 2. Apply classes based on screen position
                    if (Math.abs(cardCenter - screenCenter) < threshold) {
                        // Centered (1 person row) -> Pop to Bottom
                        popup.classList.add('top-full', 'left-1/2', '-translate-x-1/2', 'mt-4');
                        arrow.classList.add('-top-2', 'left-1/2', '-translate-x-1/2', 'border-t', 'border-l');

                    } else if (cardCenter < screenCenter) {
                        // Left person -> Pop to Right
                        popup.classList.add('top-1/2', 'left-[90%]', '-translate-y-1/2', 'translate-x-2.5');
                        arrow.classList.add('-left-2', 'top-1/2', '-translate-y-1/2', 'border-b', 'border-l');

                    } else {
                        // Right person -> Pop to Left
                        popup.classList.add('top-1/2', 'right-[90%]', '-translate-y-1/2', '-translate-x-2.5', 'left-auto');
                        arrow.classList.add('-right-2', 'top-1/2', '-translate-y-1/2', 'border-t', 'border-r', 'left-auto');
                    }
                }

                // Finally, reveal the popup
                popup.classList.remove('opacity-0', 'scale-95');
                popup.classList.add('opacity-100', 'scale-100');
            }
        };

        window.toggleDeptImg = function (event, btn) {
            event.preventDefault();
            const container = btn.closest('.relative');
            const playful = container.querySelector('.playful-img');
            const formal = container.querySelector('.formal-img');

            if (playful.classList.contains('opacity-0')) {
                playful.classList.remove('opacity-0');
                playful.classList.add('opacity-100');
                formal.classList.add('opacity-0');
            } else {
                playful.classList.add('opacity-0');
                playful.classList.remove('opacity-100');
                formal.classList.remove('opacity-0');
            }
        };

        document.addEventListener('click', () => {
            document.querySelectorAll('.quote-popup').forEach(p => {
                p.classList.remove('opacity-100', 'scale-100');
                p.classList.add('opacity-0', 'scale-95');
            });
        });

        // --- Collision Detection for Desktop Popups ---
        // This flips the popup to the left side if it goes off the right edge of the screen
        window.checkPopupBounds = function (card) {
            if (window.innerWidth < 768) return; // Skip on mobile (handled by bottom popups)

            const popup = card.querySelector('.quote-popup');
            const arrow = card.querySelector('.popup-arrow');
            if (!popup || !arrow) return;

            // 1. Reset to default (Right side)
            popup.classList.remove('md:right-[90%]', 'md:-translate-x-2.5', 'md:left-auto');
            popup.classList.add('md:left-[90%]', 'md:translate-x-2.5');

            arrow.classList.remove('md:-right-2', 'md:left-auto', 'md:border-t', 'md:border-r');
            arrow.classList.add('md:-left-2', 'md:border-b', 'md:border-l');

            // 2. Measure the bounding box
            const rect = popup.getBoundingClientRect();

            // 3. Flip to Left Side if it overflows the window width (with a 20px safety margin)
            if (rect.right > window.innerWidth - 20) {
                popup.classList.remove('md:left-[90%]', 'md:translate-x-2.5');
                popup.classList.add('md:right-[90%]', 'md:-translate-x-2.5', 'md:left-auto');

                arrow.classList.remove('md:-left-2', 'md:border-b', 'md:border-l');
                arrow.classList.add('md:-right-2', 'md:left-auto', 'md:border-t', 'md:border-r');
            }
        };

        const hcContainer = document.getElementById("high-council-tree");
        const deptRoster = document.getElementById("dept-roster");
        if (hcContainer && siteContent.committee) {

            // --- 1. RENDER HIGH COUNCIL (The Pyramid) ---
            const hc = siteContent.committee.highCouncil;

            const createCard = (member, size = "normal") => {
                const card = document.createElement("div");

                // ADDED onmouseenter EVENT HERE
                card.className = "flex flex-col items-center text-center group/card w-40 sm:w-48 md:w-64";
                card.setAttribute("onmouseenter", "checkPopupBounds(this)");

                const imgSize = size === "large"
                    ? "w-40 h-40 md:w-52 md:h-52"
                    : "w-32 h-32 md:w-40 md:h-40";

                const userQuote = member.quote || "Dedicated to serving the A-Level Student Committee";

                card.innerHTML = `
                    <div class="relative mb-4">
                        
                        <div class="${imgSize} rounded-full overflow-hidden border-4 border-gray-100 md:group-hover/card:border-maroon md:group-hover/card:shadow-[0_0_20px_rgba(136,17,59,0.3)] transition-all duration-300 p-1 bg-white relative z-30">
                            <img src="${member.image}" class="w-full h-full object-cover object-top rounded-full" loading="lazy">
                        </div>

                        <button onclick="toggleQuote(event, this)" class="md:hidden absolute bottom-0 right-0 md:right-2 bg-white border border-gray-200 text-maroon rounded-full w-9 h-9 flex items-center justify-center shadow-lg z-50 active:scale-95 transition-transform">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>
                        </button>

                        <div class="quote-popup absolute top-full left-1/2 -translate-x-1/2 mt-4 md:mt-0 md:top-1/2 md:left-[90%] md:-translate-y-1/2 w-44 sm:w-max min-w-44 sm:min-w-48 max-w-[50vw] sm:max-w-xs bg-white/95 backdrop-blur-sm p-2 rounded-2xl shadow-[0_8px_30px_rgba(136,17,59,0.15)] border border-maroon/10 z-40 opacity-0 md:group-hover/card:opacity-100 transition-all duration-300 ease-out transform scale-95 md:translate-x-2.5 md:group-hover/card:translate-x-0 md:group-hover/card:scale-100 pointer-events-none">
                            
                            <div class="popup-arrow absolute -top-2 left-1/2 -translate-x-1/2 md:top-1/2 md:-left-2 md:-translate-y-1/2 md:translate-x-0 w-4 h-4 bg-white/95 transform rotate-45 border-t border-l md:border-t-0 md:border-b md:border-l border-maroon/10"></div>
                            
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

            const row1 = document.createElement("div");
            row1.className = "flex justify-center w-full relative";
            row1.innerHTML = `<div class="absolute -bottom-6 left-1/2 w-0.5 h-6 bg-gray-300"></div>`;
            if (hc[0]) row1.appendChild(createCard(hc[0], "large"));
            hcContainer.appendChild(row1);

            const row2 = document.createElement("div");
            row2.className = "flex justify-center gap-12 md:gap-24 w-full relative pt-2";
            row2.innerHTML = `<div class="absolute -top-2 left-1/2 -translate-x-1/2 w-1/2 h-4 border-t-2 border-x-2 border-gray-300 rounded-t-xl"></div>`;
            if (hc[1]) row2.appendChild(createCard(hc[1]));
            if (hc[2]) row2.appendChild(createCard(hc[2]));
            hcContainer.appendChild(row2);

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

                let html = `
                    <div class="flex items-center gap-4 mb-10 justify-center">
                        <div class="h-0.5 w-12 bg-gray-300"></div>
                        <h3 class="text-2xl font-black uppercase tracking-tight text-main">${dept.name}</h3>
                        <div class="h-0.5 w-12 bg-gray-300"></div>
                    </div>
                    
                    <div class="flex flex-wrap justify-center gap-12 mb-12">`;

                if (dept.leaders && dept.leaders.length > 0) {
                    dept.leaders.forEach(leader => {
                        const userQuote = leader.quote || "Dedicated to serving the A-Level Student Committee";

                        // ADDED onmouseenter AND updated w-52 AND popup-arrow
                        html += `
                            <div class="flex flex-col items-center text-center group/card w-48 md:w-64" onmouseenter="checkPopupBounds(this)">
                                <div class="relative mb-4">
                                    <div class="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-gray-200 md:group-hover/card:border-maroon md:group-hover/card:shadow-[0_0_15px_rgba(136,17,59,0.4)] transition-all duration-300 p-1 bg-white relative z-10">
                                        <img src="${leader.image}" class="w-full h-full object-cover object-top rounded-full" loading="lazy">
                                    </div>

                                    <button onclick="toggleQuote(event, this)" class="md:hidden absolute bottom-0 right-0 md:right-2 bg-white border border-gray-200 text-maroon rounded-full w-9 h-9 flex items-center justify-center shadow-lg z-50 active:scale-95 transition-transform">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>
                                    </button>

                                    <div class="quote-popup absolute top-full left-1/2 -translate-x-1/2 mt-4 md:mt-0 md:top-1/2 md:left-[90%] md:-translate-y-1/2 w-max min-w-48 max-w-xs bg-white/95 backdrop-blur-sm p-5 rounded-2xl shadow-[0_8px_30px_rgba(136,17,59,0.15)] border border-maroon/10 z-40 opacity-0 md:group-hover/card:opacity-100 transition-all duration-300 ease-out transform scale-95 md:translate-x-2.5 md:group-hover/card:translate-x-0 md:group-hover/card:scale-100 pointer-events-none">
                                        
                                        <div class="popup-arrow absolute -top-2 left-1/2 -translate-x-1/2 md:top-1/2 md:-left-2 md:-translate-y-1/2 md:translate-x-0 w-4 h-4 bg-white/95 transform rotate-45 border-t border-l md:border-t-0 md:border-b md:border-l border-maroon/10"></div>
                                        
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

                if (dept.members && dept.members.length > 0) {
                    html += `<div class="flex flex-wrap justify-center gap-x-8 gap-y-12 max-w-6xl mx-auto">`;

                    dept.members.forEach(member => {
                        const userQuote = member.quote || "Dedicated to serving the A-Level Student Committee";

                        // ADDED onmouseenter AND updated w-52 AND popup-arrow
                        html += `
                        <div class="flex flex-col items-center text-center group/card w-48 md:w-64" onmouseenter="checkPopupBounds(this)">
                            <div class="relative mb-4">
                                <div class="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-gray-200 md:group-hover/card:border-maroon md:group-hover/card:shadow-[0_0_15px_rgba(136,17,59,0.4)] transition-all duration-300 p-1 bg-white relative z-10">
                                    <img src="${member.image}" class="w-full h-full object-cover object-top rounded-full" loading="lazy">
                                </div>
                                
                                <button onclick="toggleQuote(event, this)" class="md:hidden absolute bottom-0 right-0 md:right-2 bg-white border border-gray-200 text-maroon rounded-full w-9 h-9 flex items-center justify-center shadow-lg z-50 active:scale-95 transition-transform">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>
                                </button>

                                <div class="quote-popup absolute top-full left-1/2 -translate-x-1/2 mt-4 md:mt-0 md:top-1/2 md:left-[90%] md:-translate-y-1/2 w-max min-w-48 max-w-xs bg-white/95 backdrop-blur-sm p-5 rounded-2xl shadow-[0_8px_30px_rgba(136,17,59,0.15)] border border-maroon/10 z-40 opacity-0 md:group-hover/card:opacity-100 transition-all duration-300 ease-out transform scale-95 md:translate-x-2.5 md:group-hover/card:translate-x-0 md:group-hover/card:scale-100 pointer-events-none">
                            
                                    <div class="popup-arrow absolute -top-2 left-1/2 -translate-x-1/2 md:top-1/2 md:-left-2 md:-translate-y-1/2 md:translate-x-0 w-4 h-4 bg-white/95 transform rotate-45 border-t border-l md:border-t-0 md:border-b md:border-l border-maroon/10"></div>
                                    
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
                deptContainer.innerHTML = "";

                siteContent.committee.coreStructure.forEach(dept => {
                    const igHTML = dept.ig_link ? `
                        <a href="${dept.ig_link}" target="_blank" class="mt-6 inline-flex w-fit items-center gap-2 text-maroon hover:text-[#E1306C] font-bold transition-colors group/link">
                            <svg class="w-5 h-5 transform group-hover/link:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                <path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clip-rule="evenodd" />
                            </svg>
                            Follow ${dept.title}
                        </a>
                    ` : '';

                    const cardHTML = `
                        <div class="border-custom bg-white overflow-hidden rounded-2xl flex flex-col shadow-sm hover:shadow-md transition-shadow group/dept">
                            
                            <div class="relative w-full aspect-5/4 bg-gray-100 overflow-hidden">
                                
                                <img src="${dept.image}" alt="${dept.title} Formal" loading="lazy"
                                    class="formal-img absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-600 md:group-hover/dept:opacity-0">
                                
                                <img src="${dept.image_playful}" alt="${dept.title} Playful" loading="lazy"
                                    class="playful-img absolute inset-0 w-full h-full object-cover object-top opacity-0 transition-all duration-600 md:group-hover/dept:opacity-100">
                                
                                <button onclick="toggleDeptImg(event, this)" class="md:hidden absolute bottom-4 right-4 bg-white/90 backdrop-blur text-maroon p-2.5 rounded-full shadow-lg z-20 flex items-center justify-center border border-maroon/20 active:scale-90 transition-transform" aria-label="Toggle playful image">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                                </button>
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
    } else {
        console.error("content.js not loaded! Navigation cannot be built.");
    }
});