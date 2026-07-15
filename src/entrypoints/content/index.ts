import { browser } from "wxt/browser";
import { defineContentScript } from "wxt/utils/define-content-script";

import { detectConfig, getPlatformShortcuts } from "@/common/platforms";
import { loadSettings, type Settings } from "@/common/settings";

import { addEventListeners } from "./add-listeners";
import { VideoManager } from "./video/video-manager";

export default defineContentScript({
  matches: ["https://*/*"],
  async main() {
    const settings = await loadSettings();
    const platformConfig = detectConfig(window.location.hostname);
    const { videoControls } = settings;

    const videoManager = new VideoManager(videoControls, platformConfig);

    // Pre-compute active platform shortcuts to handle conflicts
    const platformShortcuts = getPlatformShortcuts(platformConfig);

    addEventListeners({
      videoManager,
      platformConfig,
      platformShortcuts,
    });

    browser.storage.onChanged.addListener((changes) => {
      const settingsChange = changes["bingeflow.settings"];
      if (settingsChange?.newValue) {
        const newSettings = settingsChange.newValue as Settings;
        if (newSettings.videoControls) {
          videoManager.updateConfig(newSettings.videoControls);
        }
      }
    });
  },
});
