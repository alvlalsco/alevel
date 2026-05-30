// ============================================================================
// about.js — ABOUT PAGE
// ============================================================================
// Fills the About page's mission/values placeholders from siteContent.about.
// The simplest page script: just five setText() calls (setText is defined in
// script.js). Each id below must match an element id in about.html and a key
// in siteContent.about — see GUIDE.md ("the two contracts").
// ============================================================================
document.addEventListener("DOMContentLoaded", async () => {

    // Guard: bail out if content.js failed to load (everything reads siteContent).
    if (typeof siteContent !== 'undefined') {

        // setText(<html element id>, <text from content.js>)
        setText("about-mission-p1", siteContent.about.missionp1);
        setText("about-mission-p2", siteContent.about.missionp2);
        setText("about-representation", siteContent.about.representation);
        setText("about-development", siteContent.about.development);
        setText("about-welfare", siteContent.about.welfare);

    } else {
        console.error("content.js not loaded! Navigation cannot be built.");
    }
});