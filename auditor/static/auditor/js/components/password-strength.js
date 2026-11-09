import { hasUppercase, hasLowercase, hasNumber, hasSymbol } from "./password-validation.js";

    // ==========================================
    // CALCULATION FUNCTIONS: ENTROPY & STRENGTH
    // ==========================================

    // Estimates password randomness/entropy in bits
    export function calculateEntropy(value) {
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

    // Evaluates password strength and integrates zxcvbn pattern penalties
    export function calculateStrength(value, zxcvbnScore = 4) {
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

        // If zxcvbn detects a trivial dictionary word, sequence, or spatial walk, penalize score
        if (zxcvbnScore <= 1) {
            score = Math.min(score, 2);
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
