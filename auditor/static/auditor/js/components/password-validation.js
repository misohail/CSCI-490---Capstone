    // ==========================================
    // HELPER FUNCTIONS: CHARACTER VALIDATION
    // ==========================================

    // Checks if the string contains at least one uppercase letter
    export function hasUppercase(value) {
        return /[A-Z]/.test(value);
    }

    // Checks if the string contains at least one lowercase letter
    export function hasLowercase(value) {
        return /[a-z]/.test(value);
    }

    // Checks if the string contains at least one number
    export function hasNumber(value) {
        return /[0-9]/.test(value);
    }

    // Checks if the string contains at least one special symbol
    export function hasSymbol(value) {
        return /[^A-Za-z0-9]/.test(value);
    }

    // Updates the visual checklist items with checkmarks or circles
    export function updateCheck(element, passed, text) {
        element.textContent = `${passed ? "✓" : "○"} ${text}`;
    }
