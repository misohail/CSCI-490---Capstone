import { password, strength, bar, len, variety, entropy, checks } from "./dom.js";
import { hasUppercase, hasLowercase, hasNumber, hasSymbol, updateCheck } from "./password-validation.js";
import { calculateEntropy, calculateStrength } from "./password-strength.js";
import { renderFeedback } from "./password-feedback.js";

    // Refreshes all UI text, meters, checklists, and pattern feedback
    export function updatePasswordStats() {
        const value = password.value;

        // Run zxcvbn analysis locally if script is loaded
        let zxcvbnResult = null;
        if (typeof zxcvbn === "function" && value) {
            zxcvbnResult = zxcvbn(value);
        }

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
        const strengthValue = calculateStrength(
            value,
            zxcvbnResult ? zxcvbnResult.score : 4
        );

        len.textContent = value.length;
        variety.textContent = `${varietyCount}/4`;
        entropy.textContent = `${entropyValue} bits`;

        strength.textContent = strengthValue.name;

        const percentage = (strengthValue.score / 4) * 100;
        bar.style.width = `${percentage}%`;

        // Render zxcvbn warnings/suggestions
        renderFeedback(zxcvbnResult ? zxcvbnResult.feedback : null);

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