// Entry point - keeps same style that worked antes (eventSource)
import { eventSource, event_types } from "../../../../script.js";
import { initSettings } from "./src/settings/settings.js";
import { ensureButtonInit } from "./src/ui/paraphraserInterface.js";

jQuery(async () => {
    console.log("Paraphraser-On-Demand: initializing");
    // init settings UI (loads html into Extensions panel)
    await initSettings();

    // Ensure button is inserted on app ready and chat changes
    eventSource.on(event_types.APP_READY, () => {
        console.log("Paraphraser-On-Demand: APP_READY");
        ensureButtonInit();
    });

    eventSource.on(event_types.CHAT_CHANGED, () => {
        ensureButtonInit();
    });

    // also run immediately in case app already ready
    ensureButtonInit();
});