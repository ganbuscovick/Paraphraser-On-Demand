import { generateParaphrase } from "../generation.js";

let listenerAttached = false;
const extensionKey = "paraphraser_on_demand";

export function ensureButtonInit() {
    // try to create button if not present
    ensureButtonExists();
}

function ensureButtonExists() {
    let paraphraseButton = document.getElementById('paraphraser_button');
    const qrToggleButton = document.getElementById('qr_toggle_button');

    if (!qrToggleButton) {
        // UI not ready yet
        return;
    }

    if (!paraphraseButton && qrToggleButton) {
        paraphraseButton = createButtonElement();
        qrToggleButton.insertAdjacentElement('afterend', paraphraseButton);
        attachListener(paraphraseButton);
    } else if (paraphraseButton && !listenerAttached) {
        attachListener(paraphraseButton);
    }
}

function createButtonElement() {
    const button = document.createElement('div');
    button.id = 'paraphraser_button';
    button.className = 'fa-solid fa-sync-alt interactable';
    button.tabIndex = 0;
    button.title = 'Paraphrase last message';
    button.style.display = 'flex';
    return button;
}

function attachListener(buttonElement) {
    if (listenerAttached) return;

    buttonElement.addEventListener('click', async () => {
        try {
            const enabled = (extension_settings && extension_settings[extensionKey] && extension_settings[extensionKey].enabled) !== false;
            if (!enabled) {
                toastr.info("Paraphraser disabled in settings.");
                return;
            }

            // selector for your installation: messages from user have attribute is_user="true"
            const messages = document.querySelectorAll('.mes[is_user="true"] .mes_text, .mes.from-user .mes_text');

            if (!messages || messages.length === 0) {
                console.log("Paraphraser: nenhuma mensagem encontrada.");
                toastr.warning("Nenhuma mensagem de usuário encontrada.");
                return;
            }

            const lastMessage = messages[messages.length - 1];
            const originalText = lastMessage.innerText.trim();

            if (!originalText) {
                toastr.warning("Última mensagem vazia.");
                return;
            }

            console.log("Paraphraser captou a última mensagem:", originalText);
            toastr.info("Paraphraser: solicitando reformulação...");

            // read settings
            const s = extension_settings[extensionKey] || {};
            const modelOverride = s.modelOverride || "";
            const maxTokens = s.maxTokens || 0;

            const paraphrased = await generateParaphrase(originalText, { modelOverride, max_tokens: maxTokens });

            if (!paraphrased) {
                toastr.error("Falha ao gerar reformulação. Veja console.");
                return;
            }

            // Replace message text in DOM
            // keep markup simple: replace innerHTML preserving paragraphs
            try {
                // if original contained tags (<q>, <p>), keep them simple:
                lastMessage.innerText = paraphrased;
            } catch (e) {
                // fallback to textContent
                lastMessage.textContent = paraphrased;
            }

            toastr.success("Mensagem reformulada e atualizada.");
        } catch (err) {
            console.error("Paraphraser UI error:", err);
            toastr.error("Erro interno do Paraphraser. Veja console.");
        }
    });

    listenerAttached = true;
    console.log("Paraphraser-On-Demand: Listener attached.");
}