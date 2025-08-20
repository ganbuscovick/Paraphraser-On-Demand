// generation.js
import { doExtrasFetch } from "../../../../extensions.js";

export async function generateParaphrase(originalText, options = {}) {
    try {
        const body = {
            input: `Reescreva a frase abaixo mantendo o mesmo sentido e emoção, mas com outras palavras:\n\n"${originalText}"`,
            model: options.modelOverride || "gemini-2.5-pro",
            max_tokens: options.max_tokens || 100,
        };

        const response = await doExtrasFetch("/api/extra/openai/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            console.error("Paraphraser API error:", response.status, await response.text());
            return null;
        }

        const data = await response.json();
        console.log("Paraphraser: got response ->", data);

        // A API do ST geralmente retorna { output: "..." } ou { choices: [...] }
        return data?.output || data?.choices?.[0]?.message?.content || null;
    } catch (err) {
        console.error("Paraphraser generateParaphrase error:", err);
        return null;
    }
}