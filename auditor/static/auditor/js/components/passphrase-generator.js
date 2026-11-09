// ==========================================
// MEMORABLE PASSPHRASE GENERATOR
// ==========================================

// Loads the official EFF Short Wordlist #1 locally
let wordListPromise;

async function loadEffWordlist() {
    if (!wordListPromise) {
        wordListPromise = fetch(
            new URL("../../wordlists/eff_short_wordlist_1.txt", import.meta.url)
        )
            .then(response => {
                if (!response.ok) {
                    throw new Error("Unable to load the EFF wordlist");
                }

                return response.text();
            })
            .then(text => {
                // Each EFF line contains a four-digit code followed by a word
                const words = text
                    .split(/\r?\n/)
                    .map(line => line.trim())
                    .filter(Boolean)
                    .map(line => line.split(/\s+/).pop());

                if (words.length !== 1296) {
                    throw new Error("The EFF wordlist must contain exactly 1,296 words");
                }

                return words;
            });
    }

    return wordListPromise;
}

// Returns a cryptographically secure random integer without modulo bias
function secureRandomIndex(max) {
    const range = 0x100000000;
    const limit = Math.floor(range / max) * max;
    const values = new Uint32Array(1);
    let value;

    do {
        crypto.getRandomValues(values);
        value = values[0];
    } while (value >= limit);

    return value % max;
}

// Generates a passphrase from randomly selected words in the EFF wordlist
export async function generateMemorablePassphrase(wordCount = 5) {
    const words = await loadEffWordlist();
    const selectedWords = [];

    for (let i = 0; i < wordCount; i++) {
        selectedWords.push(words[secureRandomIndex(words.length)]);
    }

    return selectedWords
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join("-");
}
