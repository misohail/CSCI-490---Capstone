import { symbols } from "./dom.js";

    // ==========================================
    // GENERATOR & SECURITY CHECK FUNCTIONS
    // ==========================================

    // Generates a secure random password using browser cryptographic APIs
    export function generateSecurePassword(length = 20) {
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
