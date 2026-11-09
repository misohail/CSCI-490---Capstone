import { password, toggle, generate, check, status, result } from "./components/dom.js";
import { updatePasswordStats } from "./components/password-stats.js";
import { generateSecurePassword } from "./components/password-generator.js";
import { generatePassphrase } from "./components/dom.js";
import { generateMemorablePassphrase } from "./components/passphrase-generator.js";
import { checkForBreach } from "./components/breach-checker.js";
import { initBulkChecker } from "./components/bulk-checker.js";

// ==========================================
// EVENT LISTENERS
// ==========================================

// Toggles password visibility between hidden and plaintext
toggle.addEventListener("click", () => {
    const showing = password.type === "text";

    password.type = showing ? "password" : "text";
    toggle.textContent = showing ? "Show" : "Hide";
});

// Re-calculates strength stats as the user types
password.addEventListener("input", () => {
    updatePasswordStats();

    result.classList.add("hidden");
    status.textContent = "";
});

// Populates input with a generated password and updates the UI
generate.addEventListener("click", () => {
    password.value = generateSecurePassword();

    password.type = "text";
    toggle.textContent = "Hide";

    updatePasswordStats();

    result.classList.add("hidden");
    status.textContent = "";
});

// Generates an easy-to-remember passphrase using random words
generatePassphrase.addEventListener("click", async () => {
    try {
        password.value = await generateMemorablePassphrase();

        password.type = "text";
        toggle.textContent = "Hide";

        updatePasswordStats();

        result.classList.add("hidden");
        status.textContent = "";
    } catch (error) {
        status.textContent = "Unable to load the EFF wordlist. Please check that the wordlist file is installed correctly.";
        console.error(error);
    }
});

// Triggers the breach lookup when the check button is clicked
check.addEventListener("click", checkForBreach);

// ==========================================
// TAB SWITCHING HANDLER
// ==========================================
const tabButtons = document.querySelectorAll(".tab-btn");
const tabPanels = document.querySelectorAll(".tab-panel");

tabButtons.forEach(button => {
    button.addEventListener("click", () => {
        const targetTabId = button.dataset.tab;

        // Update button active state
        tabButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        // Update visible panel
        tabPanels.forEach(panel => {
            if (panel.id === targetTabId) {
                panel.classList.add("active");
            } else {
                panel.classList.remove("active");
            }
        });
    });
});

// Initialize bulk password checker
initBulkChecker();

// Initial run on load
updatePasswordStats();
