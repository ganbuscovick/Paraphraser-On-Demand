import { defaultSettings } from "./defaultSettings.js";

const extensionKey = "paraphraser_on_demand";

export async function initSettings() {
    // ensure extension_settings slot exists (SillyTavern global)
    if (!window.extension_settings) window.extension_settings = {};
    if (!extension_settings[extensionKey]) extension_settings[extensionKey] = {};

    // merge defaults
    const current = extension_settings[extensionKey];
    Object.keys(defaultSettings).forEach(k => {
        if (!(k in current)) current[k] = defaultSettings[k];
    });
    // load settings UI
    try {
        const path = `${location.origin}${location.pathname}`; // not used — we'll fetch relative
    } catch (e) {
        // ignore
    }
    await loadSettingsUI();
}

function saveSettings() {
    // extension_settings is global; it's persisted by ST
    try {
        // trigger ST save if available
        if (typeof saveSettingsDebounced === "function") saveSettingsDebounced();
    } catch (e) {
        console.warn("Paraphraser: saveSettingsDebounced not available");
    }
}

function registerListeners() {
    $("#paraphraser_enable").on("change", (ev) => {
        extension_settings[extensionKey].enabled = $("#paraphraser_enable").prop("checked");
        saveSettings();
    });
    $("#paraphraser_model_override").on("blur", (ev) => {
        extension_settings[extensionKey].modelOverride = $("#paraphraser_model_override").val().trim();
        saveSettings();
    });
    $("#paraphraser_max_tokens").on("blur", (ev) => {
        const v = parseInt($("#paraphraser_max_tokens").val(), 10) || 0;
        extension_settings[extensionKey].maxTokens = v;
        saveSettings();
    });
}

export async function loadSettingsUI() {
    try {
        const settingsHtml = await $.get(`${script_root}/scripts/extensions/third-party/Paraphraser-On-Demand/html/settings.html`);
        $("#extensions_settings2").append(settingsHtml);
    } catch (e) {
        // fallback: try relative path
        const base = window.location.pathname.replace(/\/$/, "");
        const url = `${base}/scripts/extensions/third-party/Paraphraser-On-Demand/html/settings.html`;
        try {
            const settingsHtml = await $.get(url);
            $("#extensions_settings2").append(settingsHtml);
        } catch (err) {
            console.error("Paraphraser: failed to load settings.html", err);
            return;
        }
    }

    // initialize fields from extension_settings
    const current = extension_settings[extensionKey];
    $("#paraphraser_enable").prop("checked", !!current.enabled);
    $("#paraphraser_model_override").val(current.modelOverride || "");
    $("#paraphraser_max_tokens").val(current.maxTokens ? current.maxTokens : "");

    registerListeners();
}