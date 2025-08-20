import { registerExtension, getContext } from "../../extensions.js";

registerExtension("Paraphraser-On-Demand", (api) => {
    console.log("Paraphraser-On-Demand loaded!");

    // cria botão no input
    const button = document.createElement("button");
    button.innerText = "♻️ Paraphrase";
    button.style.marginLeft = "5px";

    // adiciona no chat input
    const input = document.querySelector("#send_textarea");
    input.parentNode.appendChild(button);

    // ação do botão
    button.addEventListener("click", async () => {
        const originalText = input.value.trim();
        if (!originalText) return;

        // aqui você escolhe a API que vai usar
        const newText = await paraphraseText(originalText);
        if (newText) {
            input.value = newText;
        }
    });

    async function paraphraseText(message) {
        try {
            const response = await fetch("http://localhost:5000/paraphrase", { // coloque sua API
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: message })
            });

            const data = await response.json();
            return data.output || message;
        } catch (err) {
            console.error("Erro ao chamar API:", err);
            return message;
        }
    }
});
