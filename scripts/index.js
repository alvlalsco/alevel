function toggleFaq(clickedIndex) {
    const targetAnswer = document.getElementById(`faq-answer-${clickedIndex}`);
    const targetIcon = document.getElementById(`faq-icon-${clickedIndex}`);

    // Check if the clicked answer is currently closed (grid-rows-[0fr])
    const isClosed = targetAnswer.classList.contains('grid-rows-[0fr]');

    // FORCE CLOSE ALL FAQs FIRST
    const allAnswers = document.querySelectorAll('[id^="faq-answer-"]');
    const allIcons = document.querySelectorAll('[id^="faq-icon-"]');

    allAnswers.forEach(answer => {
        answer.classList.add('grid-rows-[0fr]', 'opacity-0');
        answer.classList.remove('grid-rows-[1fr]', 'opacity-100');
    });

    allIcons.forEach(icon => {
        icon.classList.remove('rotate-180');
    });

    // OPEN THE CLICKED ONE (If it was originally closed)
    if (isClosed) {
        targetAnswer.classList.remove('grid-rows-[0fr]', 'opacity-0');
        targetAnswer.classList.add('grid-rows-[1fr]', 'opacity-100'); // Smoothly expands to exact height
        targetIcon.classList.add('rotate-180');
    }
}

// MOBILE SHOW QR TOGGLE BUTTON
document.addEventListener('DOMContentLoaded', () => {
    const qrToggleBtn = document.getElementById('mobile-qr-toggle');
    const qrContainer = document.getElementById('qr-img-container');

    if (qrToggleBtn && qrContainer) {
        qrToggleBtn.addEventListener('click', (e) => {
            // Prevent the button from doing anything else (like scrolling)
            e.preventDefault();

            // Toggle the custom class that forces the QR code to show
            qrContainer.classList.toggle('show-qr');
        });
    }
});
