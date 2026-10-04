(() => {
    "use strict";

    // ==========================================
    // DOM ELEMENT REFERENCES
    // ==========================================
    const password = document.getElementById("password");
    const toggle = document.getElementById("toggle");
    const generate = document.getElementById("generate");
    const check = document.getElementById("check");

    const strength = document.getElementById("strength");
    const bar = document.getElementById("bar");

    const len = document.getElementById("len");
    const variety = document.getElementById("variety");
    const entropy = document.getElementById("entropy");

    const status = document.getElementById("status");

    const result = document.getElementById("result");
    const resultTitle = document.getElementById("resultTitle");
    const resultText = document.getElementById("resultText");
    const resultIcon = document.getElementById("resultIcon");

    const checks = {
        length: document.getElementById("c1"),
        uppercase: document.getElementById("c2"),
        lowercase: document.getElementById("c3"),
        numbers: document.getElementById("c4"),
        symbols: document.getElementById("c5")
    };

    const symbols = "!@#$%^&*()-_=+[]{};:,.?";

    // ==========================================
    // HELPER FUNCTIONS: CHARACTER VALIDATION
    // ==========================================

    // Checks if the string contains at least one uppercase letter
    function hasUppercase(value) {
        return /[A-Z]/.test(value);
    }

    // Checks if the string contains at least one lowercase letter
    function hasLowercase(value) {
        return /[a-z]/.test(value);
    }

    // Checks if the string contains at least one number
    function hasNumber(value) {
        return /[0-9]/.test(value);
    }

    // Checks if the string contains at least one special symbol
    function hasSymbol(value) {
        return /[^A-Za-z0-9]/.test(value);
    }

    // Updates the visual checklist items with checkmarks or circles
    function updateCheck(element, passed, text) {
        element.textContent = `${passed ? "✓" : "○"} ${text}`;
    }

    // ==========================================
    // CALCULATION FUNCTIONS: ENTROPY & STRENGTH
    // ==========================================

    // Estimates password randomness/entropy in bits
    function calculateEntropy(value) {
        if (!value) {
            return 0;
        }

        let pool = 0;

        if (hasLowercase(value)) {
            pool += 26;
        }

        if (hasUppercase(value)) {
            pool += 26;
        }

        if (hasNumber(value)) {
            pool += 10;
        }

        if (hasSymbol(value)) {
            pool += 32;
        }

        if (pool === 0) {
            return 0;
        }

        return Math.round(value.length * Math.log2(pool));
    }

    // Evaluates password strength and assigns a score level
    function calculateStrength(value) {
        if (!value) {
            return {
                name: "—",
                score: 0
            };
        }

        let score = 0;

        if (value.length >= 12) {
            score++;
        }

        if (value.length >= 16) {
            score++;
        }

        if (hasUppercase(value)) {
            score++;
        }

        if (hasLowercase(value)) {
            score++;
        }

        if (hasNumber(value)) {
            score++;
        }

        if (hasSymbol(value)) {
            score++;
        }

        if (value.length >= 20) {
            score++;
        }

        if (score <= 2) {
            return {
                name: "Weak",
                score: 1
            };
        }

        if (score <= 4) {
            return {
                name: "Fair",
                score: 2
            };
        }

        if (score <= 5) {
            return {
                name: "Strong",
                score: 3
            };
        }

        return {
            name: "Very strong",
            score: 4
        };
    }

    // Refreshes all UI text, meters, and checklists as the user types
    function updatePasswordStats() {
        const value = password.value;

        const upper = hasUppercase(value);
        const lower = hasLowercase(value);
        const number = hasNumber(value);
        const symbol = hasSymbol(value);

        const varietyCount = [
            upper,
            lower,
            number,
            symbol
        ].filter(Boolean).length;

        const entropyValue = calculateEntropy(value);
        const strengthValue = calculateStrength(value);

        len.textContent = value.length;
        variety.textContent = `${varietyCount}/4`;
        entropy.textContent = `${entropyValue} bits`;

        strength.textContent = strengthValue.name;

        const percentage = (strengthValue.score / 4) * 100;
        bar.style.width = `${percentage}%`;

        updateCheck(
            checks.length,
            value.length >= 12,
            "At least 12 characters"
        );

        updateCheck(
            checks.uppercase,
            upper,
            "Uppercase letters"
        );

        updateCheck(
            checks.lowercase,
            lower,
            "Lowercase letters"
        );

        updateCheck(
            checks.numbers,
            number,
            "Numbers"
        );

        updateCheck(
            checks.symbols,
            symbol,
            "Symbols"
        );
    }

    // ==========================================
    // GENERATOR & SECURITY CHECK FUNCTIONS
    // ==========================================

    // Generates a secure random password using browser cryptographic APIs
    function generateSecurePassword(length = 20) {
        const characters =
            "ABCDEFGHJKLMNPQRSTUVWXYZ" +
            "abcdefghijkmnopqrstuvwxyz" +
            "23456789" +
            symbols;

        const values = new Uint32Array(length);

        crypto.getRandomValues(values);

        let generated = "";

        for (let i = 0; i < length; i++) {
            generated += characters[
                values[i] % characters.length
            ];
        }

        return generated;
    }

    // Converts a string into an uppercase SHA-1 hash for k-anonymity checks
    async function sha1(value) {
        const encoder = new TextEncoder();
        const data = encoder.encode(value);

        const hash = await crypto.subtle.digest("SHA-1", data);

        return Array.from(new Uint8Array(hash))
            .map(byte => byte.toString(16).padStart(2, "0"))
            .join("")
            .toUpperCase();
    }

    // Queries the Have I Been Pwned API safely using the k-anonymity model (only sending the first 5 characters of the hash)
    async function checkForBreach() {
        const value = password.value;

        if (!value) {
            showResult(
                "!",
                "Enter a password",
                "Enter a password before checking for breaches.",
                true
            );

            return;
        }

        status.textContent = "Checking breach database...";

        result.classList.add("hidden");

        try {
            const hash = await sha1(value);

            const prefix = hash.substring(0, 5);
            const suffix = hash.substring(5);

            const response = await fetch(
                `https://api.pwnedpasswords.com/range/${prefix}`,
                {
                    method: "GET",
                    headers: {
                        "Add-Padding": "true"
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Breach service unavailable");
            }

            const text = await response.text();

            const lines = text.split("\n");

            let count = 0;

            for (const line of lines) {
                const parts = line.trim().split(":");

                if (parts.length !== 2) {
                    continue;
                }

                const returnedSuffix = parts[0].trim();

                if (returnedSuffix === suffix) {
                    count = Number(parts[1].trim());
                    break;
                }
            }

            status.textContent = "";

            if (count > 0) {
                showResult(
                    "!",
                    "Password found in breaches",
                    `This password has appeared in known data breaches ${count.toLocaleString()} time${count === 1 ? "" : "s"}. You should choose a different password.`,
                    true
                );
            } else {
                showResult(
                    "✓",
                    "No breach found",
                    "This password was not found in the breach data checked.",
                    false
                );
            }

        } catch (error) {
            status.textContent = "";

            showResult(
                "!",
                "Unable to check",
                "The breach service could not be reached. Your password was not sent to the service.",
                true
            );
        }
    }

    // Displays the results box with warning or success styling
    function showResult(icon, title, message, isWarning) {
        resultIcon.textContent = icon;
        resultTitle.textContent = title;
        resultText.textContent = message;

        result.classList.remove("hidden");

        result.dataset.type = isWarning ? "warning" : "success";
    }

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

    // Triggers the breach lookup when the check button is clicked
    check.addEventListener("click", checkForBreach);

    // Initial run on load
    updatePasswordStats();
})();