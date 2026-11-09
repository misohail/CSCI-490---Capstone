import { bulkInput, bulkAuditBtn, bulkClearBtn, bulkStatus, bulkResultsContainer, bulkResultsBody } from "./dom.js";
import { calculateEntropy, calculateStrength } from "./password-strength.js";
import { getBreachCount } from "./breach-checker.js";

export function initBulkChecker() {
    if (!bulkAuditBtn || !bulkInput) return;

    // Clear button action
    if (bulkClearBtn) {
        bulkClearBtn.addEventListener("click", () => {
            bulkInput.value = "";
            if (bulkResultsBody) bulkResultsBody.innerHTML = "";
            if (bulkResultsContainer) bulkResultsContainer.classList.add("hidden");
            if (bulkStatus) {
                bulkStatus.classList.add("hidden");
                bulkStatus.textContent = "";
            }
        });
    }

    // Audit button action
    bulkAuditBtn.addEventListener("click", async () => {
        const text = bulkInput.value.trim();
        if (!text) return;

        // Split passwords by line, trim, and remove empty entries / duplicates
        const passwords = Array.from(new Set(text.split("\n").map(p => p.trim()).filter(Boolean)));
        if (passwords.length === 0) return;

        if (bulkResultsBody) bulkResultsBody.innerHTML = "";
        if (bulkResultsContainer) bulkResultsContainer.classList.remove("hidden");
        if (bulkStatus) {
            bulkStatus.classList.remove("hidden");
            bulkStatus.textContent = `Auditing ${passwords.length} password(s)...`;
        }
        bulkAuditBtn.disabled = true;

        // Populate table immediately with local evaluations
        const rows = passwords.map((pwd, idx) => {
            let zScore = 4;
            if (typeof window.zxcvbn === "function") {
                zScore = window.zxcvbn(pwd).score;
            } else if (typeof zxcvbn === "function") {
                zScore = zxcvbn(pwd).score;
            }

            const strengthData = calculateStrength(pwd, zScore);
            const entropyBits = calculateEntropy(pwd);

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><code>${pwd.replace(/</g, "&lt;")}</code></td>
                <td><strong>${strengthData.name}</strong></td>
                <td>${entropyBits} bits</td>
                <td id="breach-status-${idx}"><span class="badge-status status-checking">Checking...</span></td>
            `;
            if (bulkResultsBody) bulkResultsBody.appendChild(tr);
            return { pwd, idx };
        });

        // Run k-anonymity breach check sequentially with 150ms delay between requests
        for (const item of rows) {
            const cell = document.getElementById(`breach-status-${item.idx}`);
            if (!cell) continue;

            try {
                const count = await getBreachCount(item.pwd);
                if (count > 0) {
                    cell.innerHTML = `<span class="badge-status status-breached">Breached (${count.toLocaleString()})</span>`;
                } else {
                    cell.innerHTML = `<span class="badge-status status-safe">No Breaches</span>`;
                }
            } catch (err) {
                cell.innerHTML = `<span class="badge-status status-checking">Unavailable</span>`;
            }

            await new Promise(res => setTimeout(res, 150));
        }

        if (bulkStatus) bulkStatus.textContent = "Batch audit complete.";
        bulkAuditBtn.disabled = false;
    });
}