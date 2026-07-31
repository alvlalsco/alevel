// ============================================================================
// alstar.js — ALSTAR PAGE
// ============================================================================
// Fills the ALSTAR page from siteContent.alstarPage (logo, descriptions,
// certificate pillars, form links, calendar embed) AND provides the points
// tracker, lookupStudent(), which queries a Google Apps Script endpoint for a
// student's ALSTAR points by Student ID.
//
// Like the other page scripts, the page-fill block runs on DOMContentLoaded and
// guards on siteContent. lookupStudent() stays at the top level because it's
// called from the inline onclick="lookupStudent()" on the tracker button.
// See GUIDE.md.
// ============================================================================

// Points tracker: looks up a Student ID via the Apps Script endpoint and shows
// their points + eligibility. Wired to the button via onclick="lookupStudent()".
// ============================================================================
// HOURS SHEET — fetch from two published CSV tabs
//
// Tab 1 (summary):  StudentID[0] | Name[1] | Intake[2] | ALSTARHours[3] | Certificate[4]
// Tab 2 (events):   StudentID[0] | Name[1] | Intake[2] | EventName[3] | EventDate[4] | ALSTARHours[5]
// ============================================================================
async function fetchHoursFromSheet(studentId) {
    const cfg = siteContent?.alstarPage;
    if (!cfg) return null;

    const summaryUrl = cfg.hoursSummaryTabUrl;
    const eventsUrl  = cfg.hoursEventsTabUrl;

    // Helper — fetch a CSV URL and split into rows of columns.
    // Handles quoted fields that contain commas (e.g. "Little Notes, Big Smiles").
    async function fetchCsv(url) {
        if (!url || url.startsWith('<')) return null;
        try {
            const res = await fetch(url);
            if (!res.ok) return null;
            const text = await res.text();

            // Proper CSV row parser — respects double-quoted fields
            function parseRow(row) {
                const cols = [];
                let cur = '', inQuotes = false;
                for (let i = 0; i < row.length; i++) {
                    const ch = row[i];
                    if (ch === '"') {
                        inQuotes = !inQuotes;
                    } else if (ch === ',' && !inQuotes) {
                        cols.push(cur.trim());
                        cur = '';
                    } else {
                        cur += ch;
                    }
                }
                cols.push(cur.trim());
                return cols;
            }

            return text.trim().split('\n').slice(1).map(parseRow); // skip header
        } catch { return null; }
    }

    // 1. Fetch summary tab — get name + total hours
    const summaryRows = await fetchCsv(summaryUrl);
    if (!summaryRows) return null;

    const summaryRow = summaryRows.find(r => r[0] === studentId);
    if (!summaryRow) return null;

    const name        = summaryRow[1] || '---';
    const total       = parseFloat(summaryRow[3]) || 0;
    const certificate = summaryRow[4] || '';

    // 2. Fetch events tab — get list of events for this student
    const eventRows = await fetchCsv(eventsUrl);
    const events    = (eventRows || [])
        .filter(r => r[0] === studentId && r[3])  // match student ID, skip blank event names
        .map(r => ({
            name:  r[3],   // Event Name
            date:  r[4],   // Event Date
            hours: r[5],   // ALSTAR Hours
        }));

    return { name, total, certificate, events };
}

// Updates the roadmap progress bar in the Certificate Roadmap section
function updateRoadmapBar(total) {
    const mask = document.getElementById('roadmap-mask');
    if (!mask || !siteContent?.alstarPage?.certificate) return;
    const max  = siteContent.alstarPage.certificate.at(-1).hours;
    const pct  = Math.min((parseFloat(total) / max) * 100, 100);
    // Shrink the grey mask from the right — reveals the coloured track underneath
    mask.style.width = `${100 - pct}%`;
}

async function lookupStudent() {
    const input           = document.getElementById('studentIdInput');
    const btn             = document.getElementById('lookupBtn');
    const idToFind        = input.value.trim();
    const resName         = document.getElementById('resName');
    const resStatusBadge  = document.getElementById('resStatusBadge');
    const resTotal        = document.getElementById('resTotal');
    const eventsTableBody = document.getElementById('eventsTableBody');

    if (!idToFind) return;

    btn.innerText = "Loading...";
    btn.disabled  = true;

    const tiers     = siteContent?.alstarPage?.certificate || [];
    const baseBadge = "px-5 py-2 rounded-full text-xs font-bold uppercase text-white transition-colors duration-300";

    // Sets the status badge to the highest tier the student has reached
    function applyTierBadge(total) {
        const reached = [...tiers].reverse().find(t => (total ?? 0) >= t.hours);
        if (reached) {
            resStatusBadge.innerText          = `${reached.label} Certificate`;
            resStatusBadge.className          = baseBadge;
            resStatusBadge.style.background   = reached.color;
            resStatusBadge.style.color        = reached.label === 'Gold' ? '#000' : '#fff';
        } else {
            resStatusBadge.innerText          = "Not Yet Eligible";
            resStatusBadge.className          = `${baseBadge} bg-maroon`;
            resStatusBadge.style.background   = '';
            resStatusBadge.style.color        = '';
        }
        updateRoadmapBar(total ?? 0);
    }

    // Renders the events table
    function renderEvents(events) {
        if (!eventsTableBody) return;
        if (events?.length > 0) {
            eventsTableBody.innerHTML = events.map(evt => `
                <div class="grid grid-cols-3 gap-4 py-3 border-b border-gray-50 last:border-0">
                    <p class="text-sm font-bold text-main">${evt.name}</p>
                    <p class="text-sm text-main">${evt.date}</p>
                    <p class="text-sm text-main">${evt.hours}</p>
                </div>
            `).join('');
        } else {
            eventsTableBody.innerHTML = `<p class="text-sm text-gray-400 py-4">No events recorded yet.</p>`;
        }
    }

    try {
        // 1. Try live sheet CSV (primary source)
        const sheetResult = await fetchHoursFromSheet(idToFind);

        if (sheetResult) {
            resName.innerText  = sheetResult.name;
            resTotal.innerText = sheetResult.total;
            applyTierBadge(sheetResult.total);
            renderEvents(sheetResult.events || []);
            return;
        }

        // 2. Fall back to Apps Script endpoint
        let clientId = localStorage.getItem('alstar_client_id');
        if (!clientId) {
            clientId = Math.random().toString(36).substring(2, 15);
            localStorage.setItem('alstar_client_id', clientId);
        }

        const API_BASE_URL = 'https://script.google.com/macros/s/AKfycbwS3WsrRAeNuhz5bIe4-JQ0QAxPa9DLgFuZN_XJKMDuFV2G-j4IBGvT9A6ySzTkeygt8A/exec';
        const response     = await fetch(`${API_BASE_URL}?id=${encodeURIComponent(idToFind)}&clientId=${clientId}`);
        if (!response.ok) throw new Error("Network error");

        const result = await response.json();

        if (result.success) {
            const { name, total, events } = result.data;
            resName.innerText  = name;
            resTotal.innerText = total ?? '--';
            applyTierBadge(total);
            renderEvents(events);
        } else {
            resName.innerText  = "---";
            resTotal.innerText = "--";
            if (eventsTableBody) eventsTableBody.innerHTML = "";
            resStatusBadge.style.background = '';
            resStatusBadge.style.color      = '';

            if (result.error.includes("Too many requests")) {
                resStatusBadge.innerText = "Rate Limited (Wait 1 Min)";
                resStatusBadge.className = `${baseBadge} bg-orange-500`;
            } else {
                resStatusBadge.innerText = result.error;
                resStatusBadge.className = `${baseBadge} bg-gray-800`;
            }
        }

    } catch (err) {
        console.error("Fetch Error:", err);
        resStatusBadge.innerText        = "System Error";
        resStatusBadge.className        = `${baseBadge} bg-red-600`;
        resStatusBadge.style.background = '';
        resStatusBadge.style.color      = '';
    } finally {
        btn.innerText = "View Hours";
        btn.disabled  = false;
    }
}

// --- PAGE FILL ---
document.addEventListener("DOMContentLoaded", async () => {

    // Guard: bail out if content.js failed to load (everything reads siteContent).
    if (typeof siteContent === 'undefined') {
        console.error("content.js not loaded! Navigation cannot be built.");
        return;
    }

    const alstarContainer = document.getElementById("about-alstar-details");

    if (alstarContainer && siteContent.alstarPage) {

        // A. Alstar logo
        setImage("alstar-logo", siteContent.alstarPage.alstar_logo);

        // B. Text Content
        setText("alstar-description-text", siteContent.alstarPage.description);
        setText("alstar-difference-text", siteContent.alstarPage.difference);

        // C. Certificate Roadmap — progress bar with Bronze / Silver / Gold tiers
        const pillarsContainer = document.getElementById("certificate-pillars-container");
        if (pillarsContainer && siteContent.alstarPage.certificate) {
            const tiers  = siteContent.alstarPage.certificate;
            const maxHrs = tiers[tiers.length - 1].hours;

            // Tier marker labels — absolutely positioned at their correct % along the bar
            const markers = tiers.map(t => {
                const pct = (t.hours / maxHrs) * 100;
                // Last marker anchors right edge; others anchor center
                const transform = pct >= 100 ? 'translateX(-100%)' : pct <= 0 ? 'translateX(0)' : 'translateX(-50%)';
                return `
                <div class="absolute flex flex-col items-center" style="left:${pct}%; transform:${transform};">
                    <span class="text-xs font-bold uppercase" style="color:${t.color}">${t.label}</span>
                    <span class="text-xs text-gray-400">${t.hours}h</span>
                </div>`;
            }).join('');

            // Tick marks at each tier position
            const ticks = tiers.map(t => `
                <div class="absolute top-0 h-full w-0.5 bg-white/60"
                     style="left:${(t.hours / maxHrs) * 100}%"></div>
            `).join('');

            pillarsContainer.innerHTML = `
                <!-- Marker labels row — needs relative + fixed height so absolute children show -->
                <div class="relative h-8 mb-1">${markers}</div>

                <div class="relative w-full h-4 rounded-full overflow-hidden"
                     style="background: linear-gradient(to right, #cd7f32 ${(tiers[0].hours/maxHrs)*100}%, #a8a9ad ${(tiers[0].hours/maxHrs)*100}%, #a8a9ad ${(tiers[1].hours/maxHrs)*100}%, #ffd700 ${(tiers[1].hours/maxHrs)*100}%, #ffd700 ${(tiers[2].hours/maxHrs)*100}%);">
                    ${ticks}
                    <!-- Grey overlay slides in from the right to mask unearned progress -->
                    <div class="absolute top-0 right-0 h-full bg-gray-100 transition-all duration-700"
                         id="roadmap-mask"
                         style="width:100%">
                    </div>
                </div>

                <div class="flex justify-between mt-2">
                    <span class="text-xs text-gray-400">0h</span>
                    <span class="text-xs text-gray-400"></span>
                </div>
            `;
        }

        // C. Submission Form
        setLink("btn-submit-amendment", siteContent.alstarPage.forms.amendment);

        // D. Google Calendar Embed
        const calFrame = document.getElementById("calendar-frame");
        if (calFrame) calFrame.src = siteContent.alstarPage.calendar;
    }
});
