// generation.js - centraliza a chamada pra camada de geração do SillyTavern
// tenta usar /api/generate/text que usa o profile/preset atual do ST.
// retorna string output ou null em erro.

export async function generateParaphrase(originalText, opts = {}) {
    // opts: { modelOverride, max_tokens }
    try {
        const body = {
            input: `Reescreva a frase abaixo mantendo o mesmo sentido e emoção, mas com outras palavras:\n\n"${originalText}"`,
            // many ST installs accept 'stream' false and model override params
            stream: false
        };

        if (opts.modelOverride) body.model = opts.modelOverride;
        if (opts.max_tokens && Number(opts.max_tokens) > 0) body.max_tokens = Number(opts.max_tokens);

        // primary attempt: use ST internal generator endpoint
        const resp = await fetch("/api/generate/text", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (!resp.ok) {
            // try to read text for debugging
            const txt = await resp.text();
            console.error("Paraphraser: /api/generate/text returned", resp.status, txt);
            throw new Error(`Generation error: ${resp.status}`);
        }

        // response normally JSON with { output: "..." } or {output: [{content: "..."}]}
        const data = await resp.json();

        // Several ST versions wrap output in different shapes. Try robust extraction:
        if (!data) return null;

        // common shapes:
        if (data.output && typeof data.output === "string") return data.output;
        if (Array.isArray(data.output) && data.output.length && typeof data.output[0].content === "string") return data.output[0].content;
        if (data.choices && Array.isArray(data.choices) && data.choices[0]?.text) return data.choices[0].text;
        if (data.result && typeof data.result === "string") return data.result;

        // fallback: try joining any text fields
        const flat = JSON.stringify(data);
        return flat.substring(0, 5000); // return something if parsing weird
    } catch (err) {
        console.error("Paraphraser generation error:", err);
        return null;
    }
}