// 4. Initialize Core Layout
document.addEventListener("DOMContentLoaded", async () => {

    // 2. Initialize Navigation Logic (Requires siteContent to be loaded first)
    if (typeof siteContent !== 'undefined') {

        // ==========================================
        // 2. ABOUT PAGE
        // ==========================================
        setText("about-mission-p1", siteContent.about.missionp1);
        setText("about-mission-p2", siteContent.about.missionp2);
        setText("about-representation", siteContent.about.representation);
        setText("about-development", siteContent.about.development);
        setText("about-welfare", siteContent.about.welfare);

    } else {
        console.error("content.js not loaded! Navigation cannot be built.");
    }
});