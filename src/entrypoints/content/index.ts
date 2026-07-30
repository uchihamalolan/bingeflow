import { browser } from "wxt/browser";
import { defineContentScript } from "wxt/utils/define-content-script";

import { isDomainEnabled } from "@/common/domain";
import { detectConfig, getPlatformShortcuts } from "@/common/platforms";
import { loadSettings, type Settings } from "@/common/settings";

import { addEventListeners } from "./add-listeners";
import { PlatformManager } from "./platform/platform-manager";
import { VideoManager } from "./video/video-manager";

export default defineContentScript({
  matches: ["https://*/*"],
  async main() {
    const settings = await loadSettings();
    const hostname = window.location.hostname;

    if (!isDomainEnabled(hostname, settings.enabledDomains)) {
      return;
    }

    const platformConfig = detectConfig(hostname);

    const platformManager = new PlatformManager(platformConfig);
    const videoManager = new VideoManager(settings.videoControls, platformConfig);

    // Pre-compute active platform shortcuts to handle conflicts
    const platformShortcuts = getPlatformShortcuts(platformConfig);

    const { keyboardListener, gamepadListener } = addEventListeners({
      videoManager,
      platformManager,
      platformShortcuts,
    });

    let active = true;

    browser.storage.onChanged.addListener((changes) => {
      const settingsChange = changes["bingeflow.settings"];
      if (settingsChange?.newValue) {
        const newSettings = settingsChange.newValue as Settings;
        const nowEnabled = isDomainEnabled(hostname, newSettings.enabledDomains);

        if (active && !nowEnabled) {
          active = false;
          videoManager.destroy();
          keyboardListener.stop();
          gamepadListener.stop();
        } else if (active && newSettings.videoControls) {
          videoManager.updateConfig(newSettings.videoControls);
          gamepadListener.updateConfig();
        }
      }
    });
  },
});
