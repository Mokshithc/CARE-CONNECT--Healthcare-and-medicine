// Toggle Menu Functionality
document.getElementById("menuBtn").addEventListener("click", function () {
    let menu = document.getElementById("menu");
    if (menu.classList.contains("hidden")) {
        menu.classList.remove("hidden");
    } else {
        menu.classList.add("hidden");
    }
});

// Set Medication Reminder
function setReminder() {
    let medicine = document.getElementById("medicineName").value;
    let time = document.getElementById("reminderTime").value;

    if (medicine && time) {
        alert(`Reminder set for ${medicine} at ${time}`);
    } else {
        alert("Please enter both medicine name and time.");
    }
}
// script.js

document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("nav ul").addEventListener("click", function (event) {
        if (event.target.tagName === "A") {
            event.preventDefault();
            let page = event.target.innerText.trim();
            
            switch (page) {
                case "Contact":
                    window.location.href = "contact.html";
                    break;
                case "Help":
                    window.location.href = "help.html";
                    break;
                case "Home":
                    window.location.href = "index.html"; // Reloads the home page
                    break;
                case "Logout":
                    alert("Logging you out...");
                    window.location.href = "logout.html"; // Redirect to logout page (you can change this accordingly)
                    break;
            }
        }
    });
});
