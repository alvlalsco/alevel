// ============================================================================
// contact.js — CONTACT PAGE
// ============================================================================
// Builds the contact cards (Instagram / Email / TikTok / ...) from
// siteContent.contact.cards into #contact-cards-container. Each card keeps the
// `id` from content.js so the nav menu's scroll-target links still work.
// Same pattern as the other page scripts: wait for DOMContentLoaded, guard on
// siteContent, then build the markup. See GUIDE.md.
// ============================================================================
document.addEventListener("DOMContentLoaded", async () => {

    // Guard: bail out if content.js failed to load (everything reads siteContent).
    if (typeof siteContent !== 'undefined') {

        const container = document.getElementById("contact-cards-container");

        if (container && siteContent.contact && siteContent.contact.cards) {
            container.innerHTML = ""; // Clear the "Loading..." placeholder

            siteContent.contact.cards.forEach(card => {
                // Email links open the mail client (no new tab); web links open in a new tab.
                const linkAttrs = card.isEmail
                    ? ""
                    : 'target="_blank" rel="noopener noreferrer"';

                const cardHTML = `
                <div id="${card.id}" class="contact-card">
                    <div class="contact-card-body">
                        <div class="mb-6 flex justify-center">
                            <img src="${card.icon}" alt="${card.title}" class="w-12 h-12">
                        </div>
                        <h3 class="font-bold mb-4">${card.title}</h3>
                        <p class="text-main mb-8 grow">
                            ${card.description}
                        </p>
                        <a href="${card.link}" ${linkAttrs} class="btn-maroon">${card.link_text}</a>
                    </div>
                </div>`;

                container.insertAdjacentHTML('beforeend', cardHTML);
            });
        }

    } else {
        console.error("content.js not loaded! Navigation cannot be built.");
    }
});
