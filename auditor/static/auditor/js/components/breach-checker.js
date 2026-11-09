import { password, status, result, resultIcon, resultTitle, resultText } from "./dom.js";

// Converts a string into an uppercase SHA-1 hash for k-anonymity checks
export async function sha1(value) {
    const encoder = new TextEncoder();
    const data = encoder.encode(value);

    const hash = await crypto.subtle.digest("SHA-1", data);

    return Array.from(new Uint8Array(hash))
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("")
        .toUpperCase();
}

/**
 * Checks a single password against HIBP using k-anonymity.
 * Returns the breach count (0 if not breached).
 * Throws an error if the network request fails.
 */
export async function getBreachCount(value) {
    if (!value) return 0;

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

    for (const line of lines) {
        const parts = line.trim().split(":");
        if (parts.length !== 2) continue;

        const returnedSuffix = parts[0].trim();
        if (returnedSuffix === suffix) {
            return Number(parts[1].trim());
        }
    }

    return 0;
}

// Queries the Have I Been Pwned API safely for the single-password UI
export async function checkForBreach() {
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
        const count = await getBreachCount(value);
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
export function showResult(icon, title, message, isWarning) {
    resultIcon.textContent = icon;
    resultTitle.textContent = title;
    resultText.textContent = message;

    result.classList.remove("hidden");
    result.dataset.type = isWarning ? "warning" : "success";
}