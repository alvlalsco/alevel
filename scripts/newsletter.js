async function submitNewsletter() {
    // a. Get Elements
    const emailInput = document.getElementById("newsletter-email-input");
    const btn = document.getElementById("newsletter-sub-btn");
    const successMsg = document.getElementById("newsletter-success-msg");
    const errorMsg = document.getElementById("newsletter-error-msg");

    // b. Reset States
    successMsg.classList.add("hidden");
    errorMsg.classList.add("hidden");

    const email = emailInput.value.trim();

    // c. Simple Validation
    if (!email || !email.includes("@")) {
        errorMsg.textContent = "Please enter a valid email address.";
        errorMsg.classList.remove("hidden");
        return;
    }

    // d. Loading State
    const originalText = btn.textContent;
    btn.textContent = "Subsrcibing...";
    btn.disabled = true;
    btn.classList.add("opacity-75", "cursor-not-allowed");

    // e. Send Data to Google Sheets using google app script
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyyWT4XJQ7CjhLyNEwdy-UZGjSr5PMcAkARv2knu6HkSC9HiKmhvRtmv2Re59YrKwE0/exec";

    try {
        const formData = new FormData();
        formData.append("email", email);

        const response = await fetch(SCRIPT_URL, {
            method: "POST",
            body: formData
        });

        if (response.ok) {
            // Success!
            emailInput.value = ""; // Clear input
            successMsg.classList.remove("hidden");
        } else {
            throw new Error("Network response was not ok.");
        }
    } catch (error) {
        console.error("Error!", error.message);
        errorMsg.textContent = "Something went wrong. Please try again.";
        errorMsg.classList.remove("hidden");
    } finally {
        // 6. Reset Button
        btn.textContent = originalText;
        btn.disabled = false;
        btn.classList.remove("opacity-75", "cursor-not-allowed");

        // Hide success message after 5 seconds
        setTimeout(() => {
            successMsg.classList.add("hidden");
        }, 5000);
    }
}

