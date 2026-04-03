async function lookupStudent() {
    const input = document.getElementById('studentIdInput');
    const btn = document.getElementById('lookupBtn');
    const idToFind = input.value.trim();

    // UI Elements
    const resName = document.getElementById('resName');
    const resStatusBadge = document.getElementById('resStatusBadge');
    const resPart = document.getElementById('resParticipation');
    const resVol = document.getElementById('resVolunteer');
    const resTalk = document.getElementById('resTalk');
    // ... (keep your other UI elements) ...

    if (!idToFind) return;

    btn.innerText = "Loading...";
    btn.disabled = true;

    // ==========================================
    // 🕵️ CLIENT ID GENERATOR
    // ==========================================
    // Check if the browser already remembers this user
    let clientId = localStorage.getItem('alstar_client_id');

    // If not, create a random string and save it to their browser
    if (!clientId) {
        clientId = Math.random().toString(36).substring(2, 15);
        localStorage.setItem('alstar_client_id', clientId);
    }
    // ==========================================

    const API_BASE_URL = 'https://script.google.com/macros/s/AKfycbwS3WsrRAeNuhz5bIe4-JQ0QAxPa9DLgFuZN_XJKMDuFV2G-j4IBGvT9A6ySzTkeygt8A/exec';

    // Append BOTH the student ID and the Client ID to the URL
    const fetchUrl = `${API_BASE_URL}?id=${encodeURIComponent(idToFind)}&clientId=${clientId}`;

    const baseBadgeClasses = "px-5 py-2 rounded-full text-xs font-bold uppercase text-white transition-colors duration-300";

    try {
        const response = await fetch(fetchUrl);
        if (!response.ok) throw new Error("Network response was not ok");

        const result = await response.json();

        if (result.success) {
            n = result.data.name;
            p = result.data.participation;
            v = result.data.volunteer;
            t = result.data.talk;
            resName.innerText = n;
            resPart.innerText = p;
            resVol.innerText = v;
            resTalk.innerText = t;

            // 3. Status Logic (Criteria: 5, 6, 5)
            if (p >= 5 && v >= 6 && t >= 5) {
                resStatusBadge.innerText = "Eligible for Certificate";
                resStatusBadge.className = `${baseBadgeClasses} bg-green-700`;
            } else {
                resStatusBadge.innerText = "Not Eligible for Certificate";
                resStatusBadge.className = `${baseBadgeClasses} bg-maroon`;
            }

        } else {
            // Handle the Rate Limit Error OR "ID Not Found"
            resName.innerText = "---";

            // If the error contains "Too many requests", show it in the badge
            if (result.error.includes("Too many requests")) {
                resStatusBadge.innerText = "Rate Limited (Wait 1 Min)";
                resStatusBadge.className = `${baseBadgeClasses} bg-orange-500`;
            } else {
                resName.innerText = "---";
                resPart.innerText = "0";
                resVol.innerText = "0";
                resTalk.innerText = "0";
                resStatusBadge.innerText = result.error; // "ID Not Found"
                resStatusBadge.className = `${baseBadgeClasses} bg-gray-800`;
            }
        }
    } catch (err) {
        console.error("Fetch Error:", err);
        resStatusBadge.innerText = "System Error";
        resStatusBadge.className = `${baseBadgeClasses} bg-red-600`;
    } finally {
        btn.innerText = "View Points";
        btn.disabled = false;
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

    // C. Generate Certificate Pillars Dynamically
    const pillarsContainer = document.getElementById("certificate-pillars-container");
    if (pillarsContainer && siteContent.alstarPage.certificate) {
        pillarsContainer.innerHTML = ""; // Clear out any existing content

        siteContent.alstarPage.certificate.forEach((pillar, index) => {
            // Apply the specific border classes only to the middle item (index 1)
            const borderClasses = index === 1
                ? "border-t-custom border-b-custom sm:border-t-0 sm:border-b-0 sm:border-x-custom py-6 sm:py-0"
                : "";

            pillarsContainer.innerHTML += `
                    <div class="flex flex-col items-center ${borderClasses}">
                        <span class="text-4xl font-black text-main mb-1">${pillar.count}</span>
                        <span class="text-xs font-bold uppercase tracking-widest primary-maroon">${pillar.label}</span>
                        <span class="text-sm text-gray-500 mt-2">${pillar.desc}</span>
                    </div>
                `;
        });
    }

    // C. Submission Forms
    setLink("btn-submit-amendment", siteContent.alstarPage.forms.amendment);
    setLink("btn-submit-talk", siteContent.alstarPage.forms.talk);

    // D. Google Calendar Embed
    const calFrame = document.getElementById("calendar-frame");
    if (calFrame) calFrame.src = siteContent.alstarPage.calendar;
}
