// --- Helper Function: The "Card Factory" ---
function createEventCard(evt, isFeatured) {
    // 🔥 FIX: Made this safe! Only runs toLowerCase() if button_text actually exists
    const isEnabled = evt.button_text ? evt.button_text.toLowerCase().includes("open") : false;

    // 1. SETUP LAYOUT RATIOS
    const imgWidthClass = isFeatured ? "lg:w-2/5" : "lg:w-1/2";
    const txtWidthClass = isFeatured ? "lg:w-3/5" : "lg:w-1/2";

    // 2. SETUP GRID SPAN
    const containerSpan = isFeatured ? "lg:col-span-2" : "";

    // 3. SETUP TEXT SIZING
    const titleSize = isFeatured ? "text-2xl md:text-4xl" : "text-xl font-bold";
    const padding = isFeatured ? "p-6 md:p-10" : "p-5";

    // 🔥 FIX: Added safe checks for evt.date and evt.button_text so it doesn't print "undefined"
    return `
        <div class="${containerSpan} border-custom rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col lg:flex-row h-full">
            
            <div class="relative w-full ${imgWidthClass} shrink-0 aspect-[4/5] overflow-hidden group">
                <img src="${evt.image}" alt="${evt.title}" 
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
            </div>

            <div class="${padding} flex flex-col flex-grow justify-center ${txtWidthClass}">
                <div class="flex items-center gap-3 mb-4">
                    ${isFeatured ? '<span class="tag-latest">Featured</span>' : ''}
                    <span class="date-chip text-sm">${evt.date || ""}</span>
                </div>
                
                <h3 class="${titleSize} font-bold mb-4 tracking-tight leading-tight">
                    ${evt.title}
                </h3>
                
                <p class="leading-relaxed text-main text-justify mb-8 flex-grow ${isFeatured ? 'text-base' : 'text-sm line-clamp-3 lg:line-clamp-none'}">
                    ${evt.description}
                </p>
                
                <a href="${isEnabled ? evt.registration_link : '#'}" target="${isEnabled ? '_blank' : ''}" 
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

    // 🔥 FIX: Checks if there is an event AND if it actually has a title filled out
    if (events.length > 0 && events[0].title) {

        // A. Render UPCOMING Events
        events.forEach((evt, index) => {
            const isFeatured = index === 0;
            const cardHTML = createEventCard(evt, isFeatured);
            upcomingContainer.insertAdjacentHTML('beforeend', cardHTML);
        });

    } else {
        // B. Render DEFAULT State
        // 🔥 FIX: Map the default properties to the standard names the factory expects
        const default_event = {
            image: siteContent.eventsPage.default.default_image,
            title: siteContent.eventsPage.default.default_title,
            description: siteContent.eventsPage.default.default_description,
            button_text: siteContent.eventsPage.default.default_button,
            date: "",
            registration_link: "#"
        };

        const isFeatured = true;
        const cardHTML = createEventCard(default_event, isFeatured);
        upcomingContainer.insertAdjacentHTML('beforeend', cardHTML);
    }
}

function createEventCard(evt, isFeatured) {
    const isEnabled = evt.button_text ? evt.button_text.toLowerCase().includes("open") : false;

    // 1. SETUP LAYOUT RATIOS & SPAN
    const imgWidthClass = isFeatured ? "lg:w-2/5" : "lg:w-1/2";
    const txtWidthClass = isFeatured ? "lg:w-3/5" : "lg:w-1/2";
    const containerSpan = isFeatured ? "lg:col-span-2" : "";
    const titleSize = isFeatured ? "text-2xl md:text-4xl" : "text-xl font-bold";
    const padding = isFeatured ? "p-6 md:p-10" : "p-5";

    // 2. DEPARTMENT COLOR DICTIONARY
    // Automatically assigns the correct Tailwind colors based on the department name
    let deptColorClass = "bg-red-100 text-red-700"; // Default (ALSCO)
    if (evt.department) {
        const dept = evt.department.toLowerCase();
        if (dept.includes("leadership")) deptColorClass = "bg-red-100 text-red-700";
        else if (dept.includes("welfare")) deptColorClass = "bg-blue-100 text-blue-700";
        else if (dept.includes("comserve") || dept.includes("community")) deptColorClass = "bg-green-100 text-green-700";
        else if (dept.includes("public") || dept.includes("pr")) deptColorClass = "bg-pink-100 text-pink-700";

    }

    // 3. BUILD THE HTML
    return `
    <div class="${containerSpan} border-custom rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col lg:flex-row h-full">
        
        <div class="relative w-full ${imgWidthClass} shrink-0 aspect-[4/5] overflow-hidden group">
            <img src="${evt.image}" alt="${evt.title}" 
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
        </div>

        <div class="${padding} flex flex-col flex-grow justify-center ${txtWidthClass}">
            
            <div class="flex flex-wrap items-center gap-2 mb-4">
                ${isFeatured ? '<span class="tag-latest">Featured</span>' : ''}
                
                ${evt.department ? `<span class="px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest ${deptColorClass}">${evt.department}</span>` : ''}
                
                <span class=" rounded-full date-chip text-sm">${evt.date || ""}</span>
                
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
            
            <p class="leading-relaxed text-main text-justify mb-8 flex-grow ${isFeatured ? 'text-base' : 'text-sm line-clamp-3 lg:line-clamp-none'}">
                ${evt.description}
            </p>
            
            <a href="${isEnabled ? evt.registration_link : '#'}" target="${isEnabled ? '_blank' : ''}" 
            class="btn-modern btn-maroon text-sm py-2.5 px-6 w-full sm:w-auto text-center ${isEnabled ? '' : 'opacity-50 cursor-not-allowed bg-gray-400 hover:bg-gray-400'} ${evt.button_text ? '' : 'hidden'}">
                ${evt.button_text || ""}
            </a>
        </div>
    </div>`;
}


//  B. Render PAST Events
if (pastContainer && siteContent.eventsPage && siteContent.eventsPage.past) {
    pastContainer.innerHTML = "";

    siteContent.eventsPage.past.forEach(evt => {

        // 1. REUSE DEPARTMENT COLOR DICTIONARY
        let deptColorClass = "bg-gray-100 text-gray-700";
        if (evt.department) {
            const dept = evt.department.toLowerCase();
            if (dept.includes("leadership")) deptColorClass = "bg-red-100 text-red-700";
            else if (dept.includes("welfare")) deptColorClass = "bg-blue-100 text-blue-700";
            else if (dept.includes("relations")) deptColorClass = "bg-pink-100 text-pink-700";
            else if (dept.includes("comserve") || dept.includes("community")) deptColorClass = "bg-green-100 text-green-700";
        }

        // 2. BUILD THE HTML
        const html = `
                <div class="border-custom rounded-2xl bg-white p-8 flex flex-col h-full hover:border-[#88113b] transition-colors group">
                    
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
                    
                    <h3 class="text-xl font-bold mb-2 group-hover:text-[#88113b] transition-colors">${evt.title}</h3>
                    
                    ${evt.date ? `
                    <div class="mb-4">
                        <span class="inline-block ${deptColorClass} px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
                            ${evt.date}
                        </span>
                    </div>` : ''}

                    <p class="text-sm text-gray-600 leading-relaxed mb-6 flex-grow">${evt.description}</p>
                    
                    <button onclick="loadDriveGallery('${evt.driveFolderID}')" class="btn-modern btn-ghost w-full text-sm py-2">
                        View Photos
                    </button>
                </div>`;

        pastContainer.insertAdjacentHTML('beforeend', html);
    });
}



siteContent.eventsPage.past.forEach(evt => {

    // 1. EXPANDED DEPARTMENT COLOR DICTIONARY
    let deptColorClass = "bg-gray-100 text-gray-700";
    let deptHoverBorderClass = "hover:border-[#88113b]";   // Default ALSCO maroon border
    let deptHoverTextClass = "group-hover:text-[#88113b]"; // Default ALSCO maroon text

    if (evt.department) {
        const dept = evt.department.toLowerCase();
        if (dept.includes("leadership")) {
            deptColorClass = "bg-red-100 text-red-700";
            deptHoverBorderClass = "hover:border-red-500";
            deptHoverTextClass = "group-hover:text-red-700";
        }
        else if (dept.includes("welfare")) {
            deptColorClass = "bg-blue-100 text-blue-700";
            deptHoverBorderClass = "hover:border-blue-500";
            deptHoverTextClass = "group-hover:text-blue-700";
        }
        else if (dept.includes("relations")) {
            deptColorClass = "bg-pink-100 text-pink-700";
            deptHoverBorderClass = "hover:border-pink-500";
            deptHoverTextClass = "group-hover:text-pink-700";
        }
        else if (dept.includes("comserve") || dept.includes("community")) {
            deptColorClass = "bg-green-100 text-green-700";
            deptHoverBorderClass = "hover:border-green-500";
            deptHoverTextClass = "group-hover:text-green-700";
        }
    }

    // 2. BUILD THE HTML
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
                    
                    <button onclick="loadDriveGallery('${evt.driveFolderID}')" class="btn-modern btn-ghost w-full text-sm py-2">
                        View Photos
                    </button>
                </div>`;

    pastContainer.insertAdjacentHTML('beforeend', html);
});


"
[
    1. Do I need to go through an interview to become an ALSTAR ?

        Nope, no interviews needed! Becoming an ALSTAR is super straightforward—just fill in the registration form on the ALSTAR page.Once you're in, you’ll receive a confirmation email with everything you need, including the link to join the MS Teams group.

2. What exactly is the ALSTAR journey like ?

    Your ALSTAR experience kicks off with your ALSTAR 1st Event.You’ll be grouped with other ALSTARs to plan and execute an event based on a theme—it could be anything from a bake sale to a campaign or even a themed party.

Think of it as a hands - on preview of what it’s like to be part of ALSCO.You’ll learn by doing, collaborate with others, and bring ideas to life.

3. How do I join ALSCO after being an ALSTAR ?

    After completing your ALSTAR 1st Event, you can decide if ALSCO is for you.If you’re interested, you’ll fill in an application form and go through an interview process.From there, selected candidates will be invited to join the next ALSCO committee.

4. Is being an ALSTAR worth it ? How much time does it take ?

    Definitely worth it.You’ll build real skills—communication, teamwork, leadership, and time management—while meeting new people and gaining meaningful experiences.

As for time commitment, it’s flexible.You choose which events to join, so how involved you get is entirely up to you.

5. Can I join other clubs while being an ALSTAR or ALSCO ?

    Yes! Being an ALSTAR(or even an ALSCO) doesn’t stop you from joining other clubs.

The only restriction is that ALSCO members can’t join other college councils like SCC, and vice versa.Just make sure you manage your time well—your studies should always come first.

6. How do I balance A - Levels with ALSCO commitments ?

    It’s definitely a challenge—but a manageable one.Staying organised, prioritising tasks, and asking for help when needed can go a long way.

Balancing both isn’t just doable—it’s a valuable experience that builds resilience and prepares you for future challenges.

7. What happens during ALSTAR General Meetings ?

    There are three main meetings:

1st GM(Physical): Introduction to ALSTAR, how everything works, and getting started with your event planning.

2nd GM(Online): You’ll pitch your event ideas and plans.

3rd GM(Online): A post - mortem session where you reflect on your event—what worked, what didn’t, and what you learned.

8. What’s the difference between ALSCO and COMSERVE ?

    COMSERVE is a branch of ALSCO that focuses specifically on community service.It operates with some independence(like its own projects and platforms), but it’s still part of the larger ALSCO structure.

9. Will I receive certificates for participating ?

    For ALSTAR, certificates aren’t given per event.Instead, you’ll need to collect points:

5 Participation Points

6 Volunteer Points

5 Talk / Workshop Points

Once you meet these, you’ll earn your ALSTAR certificate.

For COMSERVE, certificates depend on the event or follow their Credit Hour System.

10. Are there any fees for COMSERVE activities ?

    It depends on the event.Some are free, while others—especially those held outside of Sunway—may require a registration fee.

11. How can I join the ALSCO committee ?

    ALSCO recruitment happens at the start of each semester.Keep an eye on the official Instagram page for updates on applications and interview dates.

12. How do I give feedback or raise a concern ?

    You can submit feedback through the “Get In Touch” form on the Contact page or drop a DM on Instagram.All feedback is reviewed regularly.

13. Where can I check my ALSTAR points ?

    You can track your points directly on the ALSTAR page—just enter your Student ID to see your current progress.
]
"