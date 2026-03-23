function openGallery(eventIndex) {
    // 1. Get the data for the specific event clicked
    const evt = siteContent.eventsPage.past[eventIndex];
    if (!evt || !evt.image_folder) return;

    // 2. Grab the modal elements
    const modal = document.getElementById('gallery-modal');
    const titleEl = document.getElementById('modal-title');
    const gridEl = document.getElementById('modal-grid');
    const videoContainer = document.getElementById('modal-video-container');

    // 3. Set the Title
    titleEl.textContent = evt.title;

    // 4. Build the Pinterest Masonry Layout using our 1-10 loop!
    gridEl.innerHTML = ""; // Clear out any old images

    for (let i = 1; i <= 20; i++) {
        const imagePath = `${evt.image_folder}/${i}.avif`;

        const imgHTML = `
            <div class="mb-3 md:mb-4 break-inside-avoid rounded-2xl overflow-hidden group bg-gray-100 relative">
                <img src="${imagePath}" 
                     alt="${evt.title} photo ${i}" 
                     loading="lazy" 
                     onerror="this.parentElement.style.display='none'"
                     class="w-full h-auto block group-hover:scale-105 transition-transform duration-500">
            </div>
        `;
        gridEl.insertAdjacentHTML('beforeend', imgHTML);
    }

    // 5. Build the Video Section
    if (evt.video_path) {
        videoContainer.style.display = "block";
        videoContainer.innerHTML = `
            <video controls class="w-full max-h-[70vh] object-cover">
                <source src="${evt.video_path}" type="video/mp4">
                Your browser does not support the video tag.
            </video>
        `;
    } else {
        videoContainer.style.display = "none";
        videoContainer.innerHTML = "";
    }

    // 6. Show Modal and Lock Background Scroll
    modal.classList.remove('opacity-0', 'pointer-events-none');
    document.body.classList.add('overflow-hidden');
}

function closeGallery() {
    const modal = document.getElementById('gallery-modal');
    const videoContainer = document.getElementById('modal-video-container');

    // 1. Hide Modal and Unlock Scroll
    modal.classList.add('opacity-0', 'pointer-events-none');
    document.body.classList.remove('overflow-hidden');

    // 2. Destroy the video so it stops playing in the background
    setTimeout(() => {
        videoContainer.innerHTML = "";
    }, 300); // Wait for the fade-out animation to finish first
}
