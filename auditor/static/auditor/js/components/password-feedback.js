import { feedbackBox, feedbackWarning, feedbackSuggestions } from "./dom.js";

    // Displays warnings and actionable advice from zxcvbn
    export function renderFeedback(feedback) {
        if (!feedbackBox || !feedbackWarning || !feedbackSuggestions) {
            return;
        }

        const warning = feedback ? feedback.warning : "";
        const suggestions = (feedback && feedback.suggestions) ? feedback.suggestions : [];

        if (!warning && suggestions.length === 0) {
            feedbackBox.classList.add("hidden");
            feedbackWarning.textContent = "";
            feedbackSuggestions.innerHTML = "";
            return;
        }

        feedbackWarning.textContent = warning ? `⚠️ ${warning}` : "";
        feedbackSuggestions.innerHTML = suggestions
            .map(item => `<li>${item}</li>`)
            .join("");

        feedbackBox.classList.remove("hidden");
    }