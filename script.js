// ==========================================
// GLOBAL UTILITIES & LAYOUT MANAGER (script.js)
// ==========================================

// 1. Helper Functions (Exposed to the global window object so other scripts can use them)
window.setText = (id, text) => {
    const el = document.getElementById(id);
    if (el && text) el.textContent = text;
};

window.setImage = (id, src) => {
    const el = document.getElementById(id);
    if (el && src) el.src = src;
};

window.setLink = (id, url) => {
    const el = document.getElementById(id);
    if (el && url) el.href = url;
};

window.setBackgroundImage = (elementId, imageUrl) => {
    const el = document.getElementById(elementId);
    if (el && imageUrl) {
        el.style.backgroundImage = `url('${imageUrl}')`;
    }
};

window.getDepartmentColor = (department) => {
    if (!department) return "";
    let deptColorClass = "bg-red-100 text-red-700";
    const dept = department.toLowerCase();
    if (dept.includes("leadership")) deptColorClass = "bg-red-100 text-red-700";
    else if (dept.includes("welfare")) deptColorClass = "bg-blue-100 text-blue-700";
    else if (dept.includes("relations")) deptColorClass = "bg-pink-100 text-pink-700";
    else if (dept.includes("comserve") || dept.includes("community")) deptColorClass = "bg-green-100 text-green-700";
    else if (dept.includes("sst") || dept.includes("secretaries")) deptColorClass = "bg-amber-100 text-amber-700";
    return deptColorClass;
};


// 2. Component Loader
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


// 3. Navigation Manager
function navbarManagement() {
    const btn = document.getElementById("menu-btn");
    const panel = document.getElementById("menu-panel");
    const overlay = document.getElementById("menu-overlay");
    const content = document.getElementById("menu-content");
    const navbar = document.getElementById("navbar");

    let isOpen = false;

    // Toggle Menu
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

    if (btn) btn.addEventListener("click", toggleMenu);
    if (overlay) overlay.addEventListener("click", toggleMenu);

    // Generate Menu
    function renderMenu() {
        if (!content || !siteContent || !siteContent.navStructure) return;
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

            if (page.sections && page.sections.length > 0) {
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

        // Close Menu on Link Click
        content.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", (e) => {
                const url = new URL(link.href);
                if (url.hash && url.pathname === window.location.pathname) {
                    e.preventDefault();
                    toggleMenu();
                    setTimeout(() => {
                        const targetSection = document.querySelector(url.hash);
                        if (targetSection) targetSection.scrollIntoView({ behavior: "smooth" });
                    }, 300);
                } else {
                    toggleMenu();
                }
            });
        });
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && isOpen) toggleMenu();
    });

    renderMenu();

    // Highlight Active Link
    function setActiveLink() {
        const currentUrl = window.location.href.split('#')[0];
        const links = document.querySelectorAll('#menu-content a');

        links.forEach(link => {
            const linkUrl = link.href.split('#')[0];
            if (currentUrl === linkUrl) {
                if (link.classList.contains('text-2xl')) {
                    link.classList.add('text-yellow-400', 'underline', 'underline-offset-8');
                } else {
                    link.classList.remove('opacity-80');
                    link.classList.add('text-yellow-200', 'font-bold');
                }
            }
        });
    }
    setActiveLink();

    // Handle Scroll Hide/Show
    let lastScrollY = window.scrollY;

    function handleScroll() {
        if (isOpen || !navbar) return;
        const currentScrollY = window.scrollY;

        if (currentScrollY <= 0) {
            navbar.classList.remove('-translate-y-full', 'opacity-0');
            navbar.classList.add('translate-y-0', 'opacity-100');
            lastScrollY = currentScrollY;
            return;
        }

        if (currentScrollY > lastScrollY) {
            navbar.classList.remove('translate-y-0', 'opacity-100');
            navbar.classList.add('-translate-y-full', 'opacity-0');
        } else {
            navbar.classList.remove('-translate-y-full', 'opacity-0');
            navbar.classList.add('translate-y-0', 'opacity-100');
        }
        lastScrollY = currentScrollY;
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // Handle Hash Navigation on Load
    function checkHashOnLoad() {
        if (window.location.hash) {
            setTimeout(() => {
                const targetSection = document.querySelector(window.location.hash);
                if (targetSection) targetSection.scrollIntoView({ behavior: "smooth" });
            }, 150);
        }
    }
    checkHashOnLoad();
}

// 4. Initialize Core Layout
document.addEventListener("DOMContentLoaded", async () => {
    // 1. Load the Navbar and Footer HTML
    await loadComponent("navbar-placeholder", "/html_pages/nav.html");
    await loadComponent("footer-placeholder", "/html_pages/footer.html");

    // 2. Initialize Navigation Logic (Requires siteContent to be loaded first)
    if (typeof siteContent !== 'undefined') {
        navbarManagement();
    } else {
        console.error("content.js not loaded! Navigation cannot be built.");
    }
});